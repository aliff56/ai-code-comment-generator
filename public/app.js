const codeInput = document.getElementById('codeInput');
const languageSelect = document.getElementById('language');
const generateBtn = document.getElementById('generateBtn');
const clearBtn = document.getElementById('clearBtn');
const resultsSection = document.getElementById('resultsSection');
const summary = document.getElementById('summary');
const summaryText = document.getElementById('summaryText');
const sideBySideView = document.getElementById('sideBySideView');
const lineByLineView = document.getElementById('lineByLineView');
const originalCodeDisplay = document.getElementById('originalCodeDisplay');
const originalCodeContent = document.getElementById('originalCodeContent');
const explanationsDisplay = document.getElementById('explanationsDisplay');
const lineByLineContent = document.getElementById('lineByLineContent');
const sideBySideBtn = document.getElementById('sideBySideBtn');
const lineByLineBtn = document.getElementById('lineByLineBtn');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');
const loadingOverlay = document.getElementById('loadingOverlay');
const lineCount = document.getElementById('lineCount');
const charCount = document.getElementById('charCount');

let currentData = null;
let currentDisplayMode = 'side-by-side';

document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    updateStats();
});

function setupEventListeners() {
    codeInput.addEventListener('input', updateStats);
    codeInput.addEventListener('input', detectLanguage);
    
    generateBtn.addEventListener('click', generateComments);
    clearBtn.addEventListener('click', clearAll);
    copyBtn.addEventListener('click', copyToClipboard);
    downloadBtn.addEventListener('click', downloadFile);
    
    sideBySideBtn.addEventListener('click', () => switchDisplayMode('side-by-side'));
    lineByLineBtn.addEventListener('click', () => switchDisplayMode('line-by-line'));
}

function updateStats() {
    const text = codeInput.value;
    const lines = text.split('\n').length;
    const chars = text.length;
    
    lineCount.textContent = `Lines: ${lines}`;
    charCount.textContent = `Chars: ${chars}`;
}

function detectLanguage() {
    const code = codeInput.value.trim();
    if (!code) return;
    
    const language = detectLanguageFromCode(code);
    if (language && language !== languageSelect.value) {
        languageSelect.value = language;
    }
}

function detectLanguageFromCode(code) {
    const patterns = {
        javascript: [
            /function\s+\w+\s*\(/,
            /const\s+\w+\s*=/,
            /let\s+\w+\s*=/,
            /var\s+\w+\s*=/,
            /=>\s*{?/,
            /console\.log/,
            /require\(/,
            /import\s+.*from/
        ],
        python: [
            /def\s+\w+\s*\(/,
            /import\s+\w+/,
            /from\s+\w+\s+import/,
            /if\s+__name__\s*==\s*['"]__main__['"]/,
            /print\s*\(/,
            /#.*$/,
            /:\s*$/
        ],
        java: [
            /public\s+class/,
            /public\s+static\s+void\s+main/,
            /System\.out\.print/,
            /import\s+java\./,
            /private\s+\w+/,
            /public\s+\w+/
        ],
        cpp: [
            /#include\s*<.*>/,
            /using\s+namespace/,
            /std::/,
            /cout\s*<</,
            /cin\s*>>/,
            /int\s+main\s*\(/
        ],
        csharp: [
            /using\s+System/,
            /namespace\s+\w+/,
            /public\s+class/,
            /Console\.WriteLine/,
            /var\s+\w+\s*=/
        ],
        php: [
            /<\?php/,
            /\$[a-zA-Z_][a-zA-Z0-9_]*/,
            /echo\s+/,
            /print\s+/,
            /function\s+\w+\s*\(/
        ],
        ruby: [
            /def\s+\w+/,
            /puts\s+/,
            /require\s+['"]/,
            /class\s+\w+/,
            /@\w+/
        ],
        go: [
            /package\s+\w+/,
            /func\s+\w+/,
            /import\s+\(/,
            /fmt\.Print/,
            /var\s+\w+\s+\w+/
        ],
        rust: [
            /fn\s+\w+/,
            /let\s+mut\s+\w+/,
            /println!/,
            /use\s+\w+/,
            /->\s*\w+/
        ],
        typescript: [
            /interface\s+\w+/,
            /type\s+\w+/,
            /:\s*\w+/,
            /import\s+.*from/,
            /export\s+/
        ]
    };
    
    for (const [lang, regexes] of Object.entries(patterns)) {
        if (regexes.some(regex => regex.test(code))) {
            return lang;
        }
    }
    
    return 'javascript'; // default
}

async function generateComments() {
    const code = codeInput.value.trim();
    if (!code) {
        alert('Please enter some code to analyze.');
        return;
    }
    
    const language = languageSelect.value;
    
    setLoadingState(true);
    
    try {
        const response = await fetch('/api/generate-comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code: code,
                language: language
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to generate comments');
        }
        
        const data = await response.json();
        currentData = data;
        displayResults(data);
        
    } catch (error) {
        console.error('Error:', error);
        alert(`Error: ${error.message}`);
    } finally {
        setLoadingState(false);
    }
}
function displayResults(data) {
    resultsSection.classList.remove('hidden');
    
    if (data.summary) {
        summaryText.textContent = data.summary;
        summary.classList.remove('hidden');
    }
    
    originalCodeContent.textContent = data.originalCode;
    Prism.highlightElement(originalCodeContent);
    
    displayExplanations(data.explanations);
    
    switchDisplayMode(currentDisplayMode);
}

function displayExplanations(explanations) {
    explanationsDisplay.innerHTML = '';
    
    explanations.forEach(item => {
        const explanationDiv = document.createElement('div');
        explanationDiv.className = 'explanation-item';
        
        explanationDiv.innerHTML = `
            <div class="line-number">Line ${item.lineNumber}</div>
            <div class="code-line">${escapeHtml(item.code)}</div>
            <div class="explanation-text">${escapeHtml(item.explanation)}</div>
        `;
        
        explanationsDisplay.appendChild(explanationDiv);
    });
}

function switchDisplayMode(mode) {
    currentDisplayMode = mode;
    
    if (mode === 'side-by-side') {
        sideBySideBtn.classList.add('active');
        lineByLineBtn.classList.remove('active');
        sideBySideView.classList.remove('hidden');
        lineByLineView.classList.add('hidden');
    } else {
        lineByLineBtn.classList.add('active');
        sideBySideBtn.classList.remove('active');
        sideBySideView.classList.add('hidden');
        lineByLineView.classList.remove('hidden');
        
        displayLineByLineView();
    }
}

function displayLineByLineView() {
    if (!currentData) return;
    
    lineByLineContent.innerHTML = '';
    
    currentData.explanations.forEach(item => {
        const lineDiv = document.createElement('div');
        lineDiv.className = 'line-item';
        
        lineDiv.innerHTML = `
            <div class="line-number-badge">${item.lineNumber}</div>
            <div class="line-content">
                <div class="line-code">${escapeHtml(item.code)}</div>
                <div class="line-explanation">${escapeHtml(item.explanation)}</div>
            </div>
        `;
        
        lineByLineContent.appendChild(lineDiv);
    });
}

async function copyToClipboard() {
    if (!currentData) return;
    
    let textToCopy = '';
    
    if (currentDisplayMode === 'side-by-side') {
        textToCopy = generateCommentedCode();
    } else {
        textToCopy = generateLineByLineText();
    }
    
    try {
        await navigator.clipboard.writeText(textToCopy);
        showNotification('Copied to clipboard!');
    } catch (error) {
        console.error('Failed to copy:', error);
        alert('Failed to copy to clipboard');
    }
}

function downloadFile() {
    if (!currentData) return;
    
    let content = '';
    const language = languageSelect.value;
    
    if (currentDisplayMode === 'side-by-side') {
        content = generateCommentedCode();
    } else {
        content = generateLineByLineText();
    }
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `commented-code.${getFileExtension(language)}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('File downloaded!');
}

function generateCommentedCode() {
    if (!currentData) return '';
    
    let result = '';
    currentData.explanations.forEach(item => {
        result += `// Line ${item.lineNumber}: ${item.explanation}\n`;
        result += `${item.code}\n\n`;
    });
    
    return result;
}

function generateLineByLineText() {
    if (!currentData) return '';
    
    let result = `Code Analysis Results\n`;
    result += `====================\n\n`;
    result += `Summary: ${currentData.summary}\n\n`;
    result += `Line-by-Line Analysis:\n`;
    result += `======================\n\n`;
    
    currentData.explanations.forEach(item => {
        result += `Line ${item.lineNumber}:\n`;
        result += `Code: ${item.code}\n`;
        result += `Explanation: ${item.explanation}\n\n`;
    });
    
    return result;
}

function getFileExtension(language) {
    const extensions = {
        javascript: 'js',
        typescript: 'ts',
        python: 'py',
        java: 'java',
        cpp: 'cpp',
        csharp: 'cs',
        php: 'php',
        ruby: 'rb',
        go: 'go',
        rust: 'rs',
        html: 'html',
        css: 'css',
        sql: 'sql'
    };
    
    return extensions[language] || 'txt';
}

function clearAll() {
    codeInput.value = '';
    resultsSection.classList.add('hidden');
    summary.classList.add('hidden');
    currentData = null;
    updateStats();
    codeInput.focus();
}

function setLoadingState(loading) {
    if (loading) {
        generateBtn.disabled = true;
        generateBtn.querySelector('.btn-text').classList.add('hidden');
        generateBtn.querySelector('.spinner').classList.remove('hidden');
        loadingOverlay.classList.remove('hidden');
    } else {
        generateBtn.disabled = false;
        generateBtn.querySelector('.btn-text').classList.remove('hidden');
        generateBtn.querySelector('.spinner').classList.add('hidden');
        loadingOverlay.classList.add('hidden');
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 1001;
        font-weight: 500;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

codeInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.max(300, this.scrollHeight) + 'px';
});
