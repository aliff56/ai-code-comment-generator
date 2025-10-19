# 🤖 AI Code Comment Generator

A modern web application that uses Google's Gemini 2.0 Flash AI to automatically generate detailed, line-by-line comments for your code snippets. Built with Node.js, Express, and vanilla HTML/CSS/JavaScript.

## ✨ Features

- **AI-Powered Analysis**: Uses Gemini 2.0 Flash for intelligent code understanding
- **Multiple Display Modes**: 
  - Side-by-side view (code + explanations)
  - Line-by-line view (alternating code and comments)
- **Language Detection**: Automatically detects programming language from code syntax
- **Syntax Highlighting**: Beautiful code highlighting with Prism.js
- **Export Options**: Copy to clipboard or download as file
- **Modern UI**: Glassmorphism design with responsive layout
- **Real-time Stats**: Character and line count tracking

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- A Google AI Studio API key (free at [aistudio.google.com](https://aistudio.google.com/app/apikey))

### Installation

1. **Clone or download this project**
   ```bash
   git clone <your-repo-url>
   cd ai-code-comment-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp env.example .env
   
   # Edit .env and add your API key
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Google AI Studio API Key (required)
GEMINI_API_KEY=your_api_key_here

# Server Configuration (optional)
PORT=3000
```

### Getting Your API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key to your `.env` file

## 📖 Usage

1. **Enter Your Code**: Paste your code snippet in the text area
2. **Select Language**: Choose the programming language (auto-detected)
3. **Generate Comments**: Click "Generate Comments" to analyze your code
4. **View Results**: Switch between side-by-side and line-by-line views
5. **Export**: Copy to clipboard or download the results

## 🎨 Supported Languages

- JavaScript/TypeScript
- Python
- Java
- C++
- C#
- PHP
- Ruby
- Go
- Rust
- HTML/CSS
- SQL

## 🏗️ Project Structure

```
ai-code-comment-generator/
├── server.js              # Express server with Gemini API integration
├── package.json           # Dependencies and scripts
├── env.example            # Environment variables template
├── README.md              # This file
└── public/                # Frontend files
    ├── index.html         # Main HTML structure
    ├── styles.css         # Modern CSS with glassmorphism design
    └── app.js            # Client-side JavaScript logic
```

## 🔌 API Endpoints

### POST `/api/generate-comments`

Generates AI-powered code comments.

**Request Body:**
```json
{
  "code": "function hello() { console.log('Hello!'); }",
  "language": "javascript"
}
```

**Response:**
```json
{
  "originalCode": "function hello() { console.log('Hello!'); }",
  "explanations": [
    {
      "lineNumber": 1,
      "code": "function hello() {",
      "explanation": "Declares a function named 'hello' that takes no parameters"
    }
  ],
  "summary": "A simple function that logs 'Hello!' to the console"
}
```

## 🛠️ Development

### Running in Development Mode

```bash
npm run dev
```

This uses nodemon for automatic server restarts.

### Dependencies

- **express**: Web server framework
- **@google/generative-ai**: Google's Gemini AI SDK
- **dotenv**: Environment variable management
- **cors**: Cross-origin resource sharing
- **nodemon**: Development server (dev dependency)

## 🎯 Features in Detail

### AI Integration
- Uses Google's Gemini 2.0 Flash model
- Intelligent code analysis and explanation
- Context-aware comment generation

### User Interface
- Responsive design that works on all devices
- Modern glassmorphism aesthetic
- Smooth animations and transitions
- Real-time syntax highlighting

### Code Analysis
- Automatic language detection
- Line-by-line code explanation
- Summary generation
- Support for multiple programming languages

### Export Options
- Copy results to clipboard
- Download as text file
- Multiple output formats

## 🔒 Security Notes

- API keys are stored in environment variables
- No code is stored on the server
- All processing is done in real-time
- CORS is properly configured

## 🐛 Troubleshooting

### Common Issues

1. **"API key not configured" error**
   - Make sure you've created a `.env` file
   - Verify your `GEMINI_API_KEY` is set correctly
   - Restart the server after adding the key

2. **"Failed to generate comments" error**
   - Check your internet connection
   - Verify your API key is valid
   - Ensure you have remaining API quota

3. **Server won't start**
   - Make sure Node.js is installed
   - Run `npm install` to install dependencies
   - Check if port 3000 is available

### Getting Help

If you encounter issues:
1. Check the console for error messages
2. Verify your API key is correct
3. Ensure all dependencies are installed
4. Check your internet connection

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## 🙏 Acknowledgments

- Google AI Studio for providing the Gemini API
- Prism.js for syntax highlighting
- The open-source community for inspiration

---

**Happy Coding!** 🚀