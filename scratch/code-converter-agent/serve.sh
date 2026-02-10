#!/bin/bash

echo "Starting Code Converter Server..."
echo ""

# Try different server options
if command -v python3 &> /dev/null; then
    echo "Using Python 3 server on http://localhost:8000"
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "Using Python 2 server on http://localhost:8000"
    python -m SimpleHTTPServer 8000
elif command -v node &> /dev/null; then
    echo "Using Node.js server on http://localhost:8000"
    node server.js
else
    echo "Error: No suitable server found. Please install Python 3 or Node.js"
    exit 1
fi
