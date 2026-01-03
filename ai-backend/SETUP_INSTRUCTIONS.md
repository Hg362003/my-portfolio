# Setup Instructions

## ✅ Step 1: Dependencies Installed
Dependencies have been installed successfully!

## 🔑 Step 2: Get Your API Keys

### Gemini API Key:
1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key

### ElevenLabs API Key:
1. Visit: https://elevenlabs.io/app/settings/api-keys
2. Sign in to your ElevenLabs account (or create one)
3. Generate a new API key
4. Copy the API key

## 📝 Step 3: Update .env File

Edit the `.env` file in the `ai-backend` folder and replace:
- `your_gemini_api_key_here` with your actual Gemini API key
- `your_elevenlabs_api_key_here` with your actual ElevenLabs API key

The file should look like:
```
GEMINI_API_KEY=AIzaSy...your_actual_key
ELEVENLABS_API_KEY=sk_...your_actual_key
PORT=3001
```

## 🚀 Step 4: Start the Backend Server

Once you've added your API keys, run:
```bash
cd ai-backend
npm start
```

The server will start on http://localhost:3001

## ⚠️ Important Notes

- The backend server must be running for the "Talk to Projects" feature to work
- Keep your API keys secure - never commit them to git
- The .env file is already in .gitignore for security




