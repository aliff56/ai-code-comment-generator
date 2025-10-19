const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
app.post('/api/generate-comments', async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code || code.trim().length === 0) {
      return res.status(400).json({ error: 'Code snippet is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `You are an expert code reviewer and documentation specialist. Analyze the following ${language || 'code'} and provide detailed line-by-line explanations.

Code to analyze:
\`\`\`${language || 'javascript'}
${code}
\`\`\`

IMPORTANT: You must provide meaningful explanations for each line of code. Do NOT just repeat the code. Explain what each line does, why it's needed, and how it contributes to the overall functionality.

Please provide your response in the following JSON format:
{
  "originalCode": "the original code here",
  "explanations": [
    {
      "lineNumber": 1,
      "code": "the actual code line",
      "explanation": "detailed explanation of what this line does and why it's important"
    }
  ],
  "summary": "Brief overall summary of what this code does"
}

Requirements:
1. For each line, provide a clear explanation of its purpose and functionality
2. Explain the logic, syntax, and intent behind each line
3. If a line is a function call, explain what the function does
4. If a line is a variable declaration, explain what the variable stores
5. If a line is a control structure, explain the condition and flow
6. Make explanations helpful for developers to understand the code
7. Do NOT just repeat the code - provide actual explanations`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    let parsedResponse;
    try {
      console.log('Raw AI response:', text);
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
        console.log('Parsed response:', parsedResponse);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      console.log('Raw response that failed to parse:', text);
      
      const lines = code.split('\n');
      parsedResponse = {
        originalCode: code,
        explanations: lines.map((line, index) => {
          const trimmedLine = line.trim();
          let explanation = '';
          
          if (trimmedLine === '') {
            explanation = 'Empty line for code formatting and readability';
          } else if (trimmedLine.startsWith('//') || trimmedLine.startsWith('/*')) {
            explanation = `Comment: ${trimmedLine}`;
          } else if (trimmedLine.includes('function') || trimmedLine.includes('def')) {
            explanation = `Function definition: ${trimmedLine}`;
          } else if (trimmedLine.includes('=')) {
            explanation = `Variable assignment: ${trimmedLine}`;
          } else if (trimmedLine.includes('if') || trimmedLine.includes('for') || trimmedLine.includes('while')) {
            explanation = `Control structure: ${trimmedLine}`;
          } else if (trimmedLine.includes('{') || trimmedLine.includes('}')) {
            explanation = `Code block delimiter: ${trimmedLine}`;
          } else {
            explanation = `Code statement: ${trimmedLine}`;
          }
          
          return {
            lineNumber: index + 1,
            code: line,
            explanation: explanation
          };
        }),
        summary: 'Code analysis completed with fallback explanations'
      };
    }

    res.json(parsedResponse);

  } catch (error) {
    console.error('Error generating comments:', error);
    res.status(500).json({ 
      error: 'Failed to generate comments',
      details: error.message 
    });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 AI Code Comment Generator running on http://localhost:${PORT}`);
  console.log(`📝 Make sure to set your GEMINI_API_KEY in the .env file`);
});
