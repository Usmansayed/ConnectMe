#!/bin/bash
echo "Setting up ConnectMe..."
cd "$(dirname "$0")/.."

# Create required directories
mkdir -p data/sqlite
mkdir -p profiles/chatgpt
mkdir -p profiles/claude
mkdir -p profiles/gemini
mkdir -p logs

# Install dependencies
echo "Installing dependencies..."
npm install

echo "Setup complete! Run 'npm run dev' to start."
