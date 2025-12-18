# Environment Variables Setup

Create a `.env` file in the `server/` directory with the following variables:

```env
# Server Configuration
PORT=5000

# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/hear-me-out

# Groq API Key (Required for AI responses)
# Get your API key from: https://console.groq.com/
GROQ_API_KEY=your_groq_api_key_here

# Optional: Other AI Service Keys (if you want to switch services)
# OPENAI_API_KEY=your_openai_api_key_here
# GEMINI_API_KEY=your_gemini_api_key_here
```

## Steps to set up:

1. Create a `.env` file in the `server/` directory
2. Copy the template above into the file
3. Replace `your_groq_api_key_here` with your actual Groq API key
4. Update `MONGO_URI` if your MongoDB is running on a different host/port
5. Save the file

The server will automatically load these variables when it starts.
