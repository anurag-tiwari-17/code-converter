// Configuration
const GEMINI_API_KEY = 'AIzaSyDXSd9kYHKIGEKCcFpGPSe7b_imYc15qJU';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// State
let currentMode = 'android'; // 'android' or 'ios'
let uploadedFile = null;
let convertedCode = '';

// DOM Elements
const importBtn = document.getElementById('importBtn');
const fileInput = document.getElementById('fileInput');
const importLabel = document.getElementById('import-label');
const filenameDisplay = document.getElementById('filenameDisplay');
const filename = document.getElementById('filename');
const fileExt = document.getElementById('fileExt');
const convertBtn = document.getElementById('convertBtn');
const convertLabel = document.getElementById('convert-label');
const dropdownMenu = document.getElementById('dropdownMenu');
const codeOutput = document.getElementById('codeOutput');
const copyBtn = document.getElementById('copyBtn');
const loadingOverlay = document.getElementById('loadingOverlay');
const appTitle = document.getElementById('app-title');

// Event Listeners
importBtn.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', handleFileUpload);

convertBtn.addEventListener('click', () => {
    dropdownMenu.classList.toggle('active');
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!convertBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.classList.remove('active');
    }
});

// Dropdown item selection
document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', async (e) => {
        const mode = e.target.dataset.mode;
        currentMode = mode;
        updateUIForMode(mode);
        dropdownMenu.classList.remove('active');

        // If file is already uploaded, convert it
        if (uploadedFile) {
            await convertCode();
        }
    });
});

copyBtn.addEventListener('click', copyToClipboard);

// Functions
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    uploadedFile = file;

    // Update filename display
    const name = file.name.split('.').slice(0, -1).join('.');
    const ext = '.' + file.name.split('.').pop();
    filename.textContent = name;
    fileExt.textContent = ext;

    // Detect file type and set initial mode
    if (ext === '.swift' || ext === '.m' || ext === '.h') {
        currentMode = 'android';
        updateUIForMode('android');
    } else if (ext === '.kt' || ext === '.java') {
        currentMode = 'ios';
        updateUIForMode('ios');
    }

    // Clear previous output
    codeOutput.innerHTML = '<div class="placeholder-text"><p>Click "Convert" to start conversion</p></div>';
}

function updateUIForMode(mode) {
    if (mode === 'android') {
        appTitle.textContent = 'iOS to Android Converter';
        importLabel.textContent = 'Import iOS File';
        convertLabel.textContent = 'Convert to Android';
    } else {
        appTitle.textContent = 'Android to iOS Converter';
        importLabel.textContent = 'Import Android File';
        convertLabel.textContent = 'Convert to iOS';
    }
}

async function convertCode() {
    if (!uploadedFile) {
        alert('Please upload a file first');
        return;
    }

    // Show loading
    loadingOverlay.classList.add('active');

    try {
        // Read file content
        const fileContent = await readFileContent(uploadedFile);

        // Prepare the prompt
        const targetLanguage = currentMode === 'android' ? 'Kotlin/Java for Android' : 'Swift for iOS';
        const sourceLanguage = currentMode === 'android' ? 'iOS (Swift/Objective-C)' : 'Android (Kotlin/Java)';

        const prompt = `You are an expert mobile developer specializing in cross-platform code conversion. 
        
Convert the following ${sourceLanguage} code to ${targetLanguage}. 

IMPORTANT: Convert ALL functions, methods, and complete code structure. Do not truncate or omit any parts.
        
Preserve the functionality and structure as much as possible. Add comments where necessary to explain platform-specific differences.

Source code:
\`\`\`
${fileContent}
\`\`\`

Please provide the COMPLETE converted code with all functions and methods included. Do not add any additional explanation before or after the code.`;

        console.log('Sending request to Gemini API...');

        // Call Gemini API
        const response = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.3,
                    maxOutputTokens: 8000  // Increased from 2000 to 8000 for complete conversions
                }
            })
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            // Get detailed error message from API
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.error?.message || response.statusText;
            console.error('API Error Details:', errorData);
            throw new Error(`API Error (${response.status}): ${errorMessage}`);
        }

        const data = await response.json();
        console.log('Conversion successful!');

        convertedCode = data.candidates[0].content.parts[0].text;

        // Display the converted code
        displayCode(convertedCode);

    } catch (error) {
        console.error('Conversion error:', error);

        // Provide detailed error messages based on error type
        let userMessage = '❌ Error converting code';
        let detailMessage = error.message;

        if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
            userMessage = '❌ Network Error';
            detailMessage = `Unable to connect to the Gemini API. This could be due to:
            
• Network connectivity issues - Check your internet connection
• CORS policy - The browser is blocking the request
• Firewall or proxy settings blocking the API
• Invalid API endpoint

💡 Try these solutions:
1. Check your internet connection
2. Verify the API key is correct in script.js (line 2)
3. Try using a different network
4. Check browser console (F12) for detailed error messages
5. Ensure you're accessing via http://localhost:8000 (not file://)`;
        } else if (error.message.includes('API Error (403)')) {
            userMessage = '❌ API Key Error';
            detailMessage = 'Invalid or unauthorized API key. Please check your Gemini API key in script.js';
        } else if (error.message.includes('API Error (429)')) {
            userMessage = '❌ Rate Limit Exceeded';
            detailMessage = 'You have exceeded the API rate limit. Please wait a few minutes and try again.';
        }

        codeOutput.innerHTML = `<div class="placeholder-text" style="color: #ef4444;">
            <p>${userMessage}</p>
            <p class="placeholder-hint" style="white-space: pre-line; text-align: left; padding: 10px; font-size: 12px;">${detailMessage}</p>
        </div>`;
    } finally {
        loadingOverlay.classList.remove('active');
    }
}

function readFileContent(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsText(file);
    });
}

function displayCode(code) {
    codeOutput.classList.add('has-content');
    codeOutput.textContent = code;

    // Remove placeholder
    const placeholder = codeOutput.querySelector('.placeholder-text');
    if (placeholder) {
        placeholder.remove();
    }
}

function copyToClipboard() {
    if (!convertedCode) {
        alert('No code to copy');
        return;
    }

    navigator.clipboard.writeText(convertedCode).then(() => {
        // Visual feedback
        const originalHTML = copyBtn.innerHTML;
        copyBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 10L8 13L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;

        setTimeout(() => {
            copyBtn.innerHTML = originalHTML;
        }, 2000);
    }).catch(err => {
        console.error('Copy failed:', err);
        alert('Failed to copy to clipboard');
    });
}
