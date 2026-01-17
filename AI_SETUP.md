# AI Integration Setup Guide 🤖

## Overview
ChatBuddy now includes real AI-powered study assistance using OpenAI's GPT-3.5 Turbo. This guide will help you set up and use the AI features.

## Prerequisites
- Node.js installed
- OpenAI API account and API key

## Setup Steps

### 1. Install Dependencies
The OpenAI package is already installed in the project.

### 2. Get OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the API key (starts with `sk-`)

### 3. Environment Configuration
Create a `.env` file in the root directory of your project:

```bash
# OpenAI API Configuration
VITE_OPENAI_API_KEY=sk-your-actual-api-key-here
```

**Important:**
- Replace `sk-your-actual-api-key-here` with your real API key
- Never commit the `.env` file to version control
- The `.env` file is already in `.gitignore`

### 4. Test the Setup
1. Start the development server: `npm run dev`
2. Navigate to the Student Dashboard
3. Try any AI feature (explain topic, summarize notes, etc.)
4. Check browser console for any API errors

## AI Features

### 1. Topic Explanation 🤔
- **Input**: Any topic or concept
- **Output**: Simple explanation with examples
- **Use case**: Understanding complex subjects

### 2. Note Summarization 📝
- **Input**: Study notes or text content
- **Output**: Structured summary with key points
- **Use case**: Quick review of study materials

### 3. Quiz Generation 🧠
- **Input**: Topic name
- **Output**: Multiple-choice questions with answers
- **Use case**: Self-testing and assessment

### 4. Flashcard Creation 📇
- **Input**: Subject or topic
- **Output**: Q&A flashcards
- **Use case**: Spaced repetition learning

## API Usage & Costs

### Model Used
- **GPT-3.5 Turbo**: Fast and cost-effective
- **Context**: 4,096 tokens (approximately 3,000 words)

### Cost Estimate
- **Per request**: ~$0.001 - $0.003
- **Monthly usage**: Depends on frequency of AI interactions
- **Free credits**: OpenAI provides $5 in free credits for new accounts

### Rate Limits
- **Requests per minute**: 3 (can be increased with paid plans)
- **Tokens per minute**: 40,000
- **Requests per day**: No strict limit

## Troubleshooting

### Common Issues

#### 1. "API Key Invalid" Error
- Check if API key is correctly set in `.env` file
- Ensure no extra spaces or characters
- Verify API key hasn't expired

#### 2. "Rate Limit Exceeded"
- Wait a minute before trying again
- Consider upgrading OpenAI plan for higher limits

#### 3. "Network Error"
- Check internet connection
- Ensure OpenAI API is not down (check status.openai.com)

#### 4. Empty Responses
- Try simplifying your input
- Check if the topic is too complex
- Ensure input is in English

### Error Messages
The app includes user-friendly error handling. If AI features don't work, check:
1. Browser console for detailed error messages
2. Network tab for API request failures
3. `.env` file configuration

## Security Notes

### API Key Safety
- API keys are stored client-side for demo purposes
- **Production**: Move API calls to backend server
- **Never**: Commit API keys to version control
- **Monitor**: API usage and costs regularly

### Best Practices
- Use environment variables for all secrets
- Implement request throttling if needed
- Add user authentication before AI features
- Cache responses to reduce API calls

## Advanced Configuration

### Custom AI Prompts
Modify prompts in `src/services/aiService.js` to:
- Change explanation style
- Adjust quiz difficulty
- Customize summary format

### Alternative AI Providers
The code is structured to easily swap AI providers:
- Google Gemini API
- Anthropic Claude
- Local AI models

### Rate Limiting
Add client-side rate limiting:
```javascript
// Example implementation
const rateLimiter = {
  requests: [],
  limit: 3,
  windowMs: 60000, // 1 minute

  canMakeRequest() {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    return this.requests.length < this.limit;
  },

  recordRequest() {
    this.requests.push(Date.now());
  }
};
```

## Support

For AI integration issues:
1. Check this guide first
2. Review OpenAI documentation
3. Test API key independently
4. Check project console logs

## Next Steps

After setup, you can:
- Customize AI prompts for your needs
- Add more AI features (essay grading, code explanation, etc.)
- Implement user authentication
- Add usage analytics
- Integrate with learning management systems