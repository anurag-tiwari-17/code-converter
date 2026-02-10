# iOS ↔ Android Code Converter

A beautiful web application that converts code between iOS (Swift/Objective-C) and Android (Kotlin/Java) using OpenAI's GPT-4.

## Features

- 🎨 Premium, modern UI with smooth animations
- 🔄 Bidirectional conversion (iOS ↔ Android)
- 📁 Drag & drop file upload
- 📋 One-click copy to clipboard
- ⚡ Real-time conversion using GPT-4
- 📱 Fully responsive design

## Getting Started

### Option 1: Using Python (Recommended)

```bash
cd code-converter-agent
python -m SimpleHTTPServer 8000
```

Then open http://localhost:8000 in your browser.

### Option 2: Using Node.js http-server

```bash
cd code-converter-agent
npx http-server -p 8000
```

Then open http://localhost:8000 in your browser.

### Option 3: Direct File Open

Simply open `index.html` in your web browser. (Note: Some browsers may have CORS restrictions)

## How to Use

1. **Upload a File**: Click "Import iOS File" or "Import Android File" to select your code file
2. **Select Conversion Direction**: Click the dropdown next to "Convert to..." to choose conversion direction
3. **Convert**: The app will automatically convert the code using OpenAI's GPT-4
4. **Copy**: Click the copy button to copy the converted code to clipboard

## Supported File Types

- **iOS**: `.swift`, `.m`, `.h`
- **Android**: `.kt`, `.java`

## API Key

The OpenAI API key is already configured in `script.js`. If you need to use a different key, update the `OPENAI_API_KEY` constant in `script.js`.

## Technologies Used

- HTML5, CSS3, JavaScript (Vanilla)
- OpenAI GPT-4 API
- Inter Font (Google Fonts)
- Modern CSS features (Grid, Flexbox, Animations)

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari

## Security Note

⚠️ The API key is currently stored client-side for simplicity. For production use, implement a backend proxy to secure the API key.
