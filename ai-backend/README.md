# AI Backend for Talk to Projects

This backend server provides AI-powered responses about portfolio projects using Google Gemini and ElevenLabs voice synthesis.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (copy from `.env.example`):
```bash
GEMINI_API_KEY=your_gemini_api_key_here
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
PORT=3001
```

3. Get API Keys:
   - **Gemini API Key**: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - **ElevenLabs API Key**: Get from [ElevenLabs Dashboard](https://elevenlabs.io/app/settings/api-keys)

4. Start the server:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

The server will run on `http://localhost:3001`

## API Endpoints

### POST /ask
Ask a question about projects.

**Request:**
```json
{
  "question": "Tell me about Projecto"
}
```

**Response:**
```json
{
  "answer": "Projecto is a comprehensive networking platform...",
  "audio": "/voice.mp3"
}
```

## Features

- Auto-detects which project the question refers to
- Uses Gemini AI for intelligent responses
- Generates voice output with ElevenLabs
- Returns both text and audio responses




