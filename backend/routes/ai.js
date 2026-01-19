const express = require('express');
const mongoose = require('mongoose');
const { authenticateToken, inMemoryUsers } = require('./auth');
const User = require('../models/User');

const router = express.Router();

// Check if MongoDB is connected
const isMongoConnected = () => {
  return mongoose.connection.readyState === 1;
};

// Helper function for API calls with timeout
async function makeApiCall(url, options) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please check your internet connection.');
    }

    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      throw new Error('Unable to connect to OpenRouter API. Please check your internet connection.');
    }

    throw error;
  }
}

// Function to check API key configuration (called when routes are used)
function getApiKey() {
  // Try environment variable first, then fallback to reading from .env file
  let apiKey = process.env.OPENAI_API_KEY;

  // If not found in environment, try to read from .env file directly
  if (!apiKey) {
    try {
      const fs = require('fs');
      const path = require('path');
      const envPath = path.resolve(__dirname, '../.env');

      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        const lines = envContent.split('\n');

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed && !trimmed.startsWith('#')) {
            const [key, ...valueParts] = trimmed.split('=');
            if (key && valueParts.length > 0) {
              const cleanKey = key.trim().replace(/\u0000/g, ''); // Remove null bytes from UTF-16
              const value = valueParts.join('=').trim().replace(/\u0000/g, ''); // Remove null bytes
              if (cleanKey === 'OPENAI_API_KEY') {
                apiKey = value;
                break;
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to read API key from .env file:', error.message);
    }
  }

  const isConfigured = apiKey && apiKey !== 'your_openai_api_key_here' && (apiKey.startsWith('sk-') || apiKey.startsWith('sk-or-v1-'));

  if (!isConfigured) {
    console.warn('⚠️ API key not configured. Please set OPENAI_API_KEY in your .env file.');
  }

  return { apiKey, isConfigured };
}

// AI Service class (moved from frontend)
class AIService {
  async explainTopic(topic) {
    const { apiKey, isConfigured } = getApiKey();
    if (!isConfigured) {
      throw new Error('OpenAI API key not configured. Please set OPENAI_API_KEY in your .env file.');
    }

    console.log('🤖 AI Service: Making request for topic:', topic);

    try {
      const prompt = `Explain the topic "${topic}" in simple, easy-to-understand terms for a student. Include:
      1. A clear definition
      2. Key concepts
      3. Real-world examples
      4. Why it's important to understand

      Keep the explanation concise but comprehensive, using simple language.`;

      const response = await makeApiCall('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:5173',
          'X-Title': 'ChatBuddy - AI Study Assistant',
        },
        body: JSON.stringify({
          model: "microsoft/wizardlm-2-8x22b",
          messages: [
            {
              role: "system",
              content: "You are an expert educator who explains complex topics in simple, engaging ways. Use analogies and real-world examples to make learning fun and memorable."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          max_tokens: 800,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);

        if (errorText.includes('quota') || errorText.includes('insufficient')) {
          throw new Error('API quota exceeded. You may need to add credits at https://openrouter.ai/credits');
        } else if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait a moment and try again.');
        } else if (response.status === 401) {
          throw new Error('Invalid API key. Please check your API key in the .env file.');
        } else {
          throw new Error(`API Error: ${response.status} - ${errorText}`);
        }
      }

      const data = await response.json();
      const result = data.choices[0].message.content.trim();

      console.log('✅ OpenRouter API call successful');
      return result;
    } catch (error) {
      console.error('❌ Error explaining topic:', error);
      throw error;
    }
  }

  async summarizeNotes(notes) {
    const { apiKey, isConfigured } = getApiKey();
    if (!isConfigured) {
      throw new Error('API key not configured. Please set OPENAI_API_KEY in your .env file.');
    }

    try {
      const prompt = `Please summarize the following study notes. Create a well-structured summary that includes:

**Key Points:**
- Main concepts and ideas

**Important Details:**
- Critical facts, formulas, or processes

**Study Tips:**
- How to remember or apply this information

Keep the summary concise but comprehensive. Use bullet points and clear headings.

Notes to summarize:
${notes}`;

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:5173',
          'X-Title': 'ChatBuddy - AI Study Assistant',
        },
        body: JSON.stringify({
          model: "microsoft/wizardlm-2-8x22b",
          messages: [
            {
              role: "system",
              content: "You are a study skills expert who creates clear, organized summaries that help students learn and retain information effectively."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          max_tokens: 600,
          temperature: 0.5
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error summarizing notes:', error);
      throw error;
    }
  }

  async generateQuiz(topic) {
    const { apiKey, isConfigured } = getApiKey();
    if (!isConfigured) {
      throw new Error('API key not configured. Please set OPENAI_API_KEY in your .env file.');
    }

    try {
      const prompt = `Create a 3-question multiple-choice quiz about "${topic}". Each question should test understanding of key concepts.

REQUIRED FORMAT (follow exactly):
Question: [question text here]
A) [first option]
B) [second option]
C) [third option]
D) [fourth option]
Correct: [A, B, C, or D]

---

Separate each question with ---
Make questions educational and appropriately challenging. Ensure only one correct answer per question.`;

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:5173',
          'X-Title': 'ChatBuddy - AI Study Assistant',
        },
        body: JSON.stringify({
          model: "microsoft/wizardlm-2-8x22b",
          messages: [
            {
              role: "system",
              content: "You are an expert quiz creator who makes educational, challenging questions that test true understanding rather than memorization."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          max_tokens: 800,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const quizText = data.choices[0].message.content.trim();

      // Parse the quiz response into structured format (same logic as frontend)
      const questions = [];
      let sections = quizText.split('---').filter(section => section.trim());
      if (sections.length <= 1) {
        sections = quizText.split('\n\n').filter(section => section.trim());
      }

      for (let i = 0; i < Math.min(sections.length, 3); i++) {
        const section = sections[i].trim();
        const lines = section.split('\n').map(line => line.trim()).filter(line => line);

        let question = '';
        const options = [];
        let correctIndex = 0;

        for (const line of lines) {
          if (line.startsWith('Question:') || line.startsWith('Question ')) {
            question = line.replace(/Question:?\s*/, '').trim();
          } else if (line.match(/^[A-D]\)/) || line.match(/^[A-D]\./) || line.match(/^[A-D]\s*\)/)) {
            const cleanLine = line.replace(/^[A-D][\.\)]\s*/, '').trim();
            if (cleanLine) {
              options.push(cleanLine);
            }
          } else if (line.startsWith('Correct:') || line.startsWith('Correct ')) {
            const correctText = line.replace(/Correct:?\s*/, '').trim();
            const correctLetter = correctText.charAt(0).toUpperCase();
            correctIndex = ['A', 'B', 'C', 'D'].indexOf(correctLetter);
            if (correctIndex === -1) correctIndex = 0;
          }
        }

        if (question && options.length >= 2) {
          while (options.length < 4) {
            options.push(`Option ${String.fromCharCode(65 + options.length)}`);
          }
          options.splice(4);

          questions.push({
            question,
            options,
            correct: Math.max(0, correctIndex)
          });
        }
      }

      // Fallback quiz if parsing failed
      if (questions.length === 0) {
        return [
          {
            question: `What is the fundamental principle of ${topic}?`,
            options: [
              "Basic understanding of core concepts",
              "Advanced theoretical knowledge",
              "Practical application skills",
              "Memorization of facts"
            ],
            correct: 0
          },
          {
            question: `How does ${topic} relate to real-world applications?`,
            options: [
              "No practical applications",
              "Limited to academic settings",
              "Used in various real-world scenarios",
              "Only theoretical concepts"
            ],
            correct: 2
          },
          {
            question: `What are the key components of studying ${topic}?`,
            options: [
              "Single approach only",
              "Multiple learning methods",
              "No specific components",
              "Random study techniques"
            ],
            correct: 1
          }
        ];
      }

      return questions;
    } catch (error) {
      console.error('Error generating quiz:', error);
      throw error;
    }
  }

  async generateFlashcards(topic) {
    const { apiKey, isConfigured } = getApiKey();
    if (!isConfigured) {
      throw new Error('API key not configured. Please set OPENAI_API_KEY in your .env file.');
    }

    try {
      const prompt = `Create exactly 4 educational flashcards about "${topic}". Each flashcard must have:

Front: A clear question or key concept
Back: A comprehensive but concise answer or explanation

Focus on the most important concepts, definitions, and applications related to ${topic}. Make the flashcards progressively more challenging from basic to advanced.

IMPORTANT: Format your response EXACTLY like this:

Front: What is the basic definition of ${topic}?
Back: [Provide a clear, concise definition]

Front: What are the key components of ${topic}?
Back: [List and briefly explain the main components]

Front: How does ${topic} work in practice?
Back: [Explain practical applications and examples]

Front: What are advanced concepts in ${topic}?
Back: [Cover more complex ideas and applications]

Do not use "Card 1:", "Card 2:", etc. Just use "Front:" and "Back:" for each flashcard pair.`;

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:5173',
          'X-Title': 'ChatBuddy - AI Study Assistant',
        },
        body: JSON.stringify({
          model: "microsoft/wizardlm-2-8x22b",
          messages: [
            {
              role: "system",
              content: "You are an expert at creating educational flashcards that help students learn and retain information effectively. Focus on clarity, accuracy, and progressive difficulty."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          max_tokens: 600,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const flashcardsText = data.choices[0].message.content.trim();

      // Parse flashcards (same logic as frontend)
      const flashcards = [];

      const strategies = [
        (text) => {
          const frontBackMatches = text.match(/Front:\s*(.+?)\s*Back:\s*(.+?)(?=Front:|$)/gs);
          if (frontBackMatches) {
            frontBackMatches.forEach(match => {
              const frontMatch = match.match(/Front:\s*(.+?)\s*Back:/s);
              const backMatch = match.match(/Back:\s*(.+?)(?=Front:|$)/s);
              if (frontMatch && backMatch) {
                flashcards.push({
                  front: frontMatch[1].trim(),
                  back: backMatch[1].trim()
                });
              }
            });
          }
          return flashcards.length > 0;
        },
        (text) => {
          const numberedMatches = text.match(/(\d+)\.\s*(.+?)\s*(?:\n|$)(.+?)(?=\d+\.|$)/gs);
          if (numberedMatches) {
            numberedMatches.forEach(match => {
              const parts = match.split('\n').filter(line => line.trim());
              if (parts.length >= 2) {
                const question = parts[0].replace(/^\d+\.\s*/, '').trim();
                const answer = parts.slice(1).join(' ').trim();
                flashcards.push({ front: question, back: answer });
              }
            });
          }
          return flashcards.length > 0;
        },
        (text) => {
          const blocks = text.split('\n\n').filter(block => block.trim().length > 10);
          blocks.forEach(block => {
            const lines = block.split('\n').filter(line => line.trim());
            if (lines.length >= 2) {
              const front = lines[0].trim();
              const back = lines.slice(1).join(' ').trim();
              flashcards.push({ front, back });
            }
          });
          return flashcards.length > 0;
        }
      ];

      for (const strategy of strategies) {
        flashcards.length = 0;
        if (strategy(flashcardsText)) {
          break;
        }
      }

      if (flashcards.length === 0) {
        flashcards.push(
          { front: `What is ${topic}?`, back: `${topic} is an important concept in the field of study.` },
          { front: `Key aspects of ${topic}`, back: `Understanding ${topic} involves learning its fundamental principles and applications.` },
          { front: `Why study ${topic}?`, back: `Studying ${topic} helps develop critical thinking and problem-solving skills.` },
          { front: `Applications of ${topic}`, back: `${topic} has practical applications in various real-world scenarios.` }
        );
      }

      return flashcards.slice(0, 4);
    } catch (error) {
      console.error('Error generating flashcards:', error);
      throw error;
    }
  }

  async askQuestion(question) {
    const { apiKey, isConfigured } = getApiKey();
    if (!isConfigured) {
      throw new Error('API key not configured. Please set OPENAI_API_KEY in your .env file.');
    }

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:5173',
          'X-Title': 'ChatBuddy - AI Study Assistant',
        },
        body: JSON.stringify({
          model: "microsoft/wizardlm-2-8x22b",
          messages: [
            {
              role: "system",
              content: "You are a helpful AI study assistant. Provide clear, accurate answers to student questions about any academic topic. Be encouraging and supportive in your responses."
            },
            {
              role: "user",
              content: question
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error answering question:', error);
      throw new Error('Failed to answer the question. Please try again.');
    }
  }

  async testConnection() {
    const { apiKey, isConfigured } = getApiKey();
    if (!isConfigured) {
      throw new Error('API key not configured.');
    }

    console.log('🧪 Testing OpenRouter API connection...');

    try {
      // First, test basic connectivity
      console.log('📡 Testing basic fetch to OpenRouter...');
      const testResponse = await makeApiCall('https://openrouter.ai/api/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      if (!testResponse.ok) {
        console.error('❌ Basic connectivity test failed:', testResponse.status, testResponse.statusText);
        throw new Error(`API connectivity test failed: ${testResponse.status}`);
      }

      console.log('✅ Basic connectivity test passed');

      const response = await makeApiCall('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:5173',
          'X-Title': 'ChatBuddy - AI Study Assistant',
        },
        body: JSON.stringify({
          model: "microsoft/wizardlm-2-8x22b",
          messages: [
            {
              role: "user",
              content: "Say 'Hello, AI is working!' and nothing else."
            }
          ],
          max_tokens: 50,
          temperature: 0.1
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const result = data.choices[0].message.content.trim();
      return result;
    } catch (error) {
      console.error('❌ AI test failed:', error);

      if (error.name === 'AbortError') {
        console.error('❌ Request timed out after 30 seconds');
        throw new Error('Request timed out. Please check your internet connection.');
      }

      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        console.error('❌ Network connectivity issue');
        throw new Error('Unable to connect to OpenRouter API. Please check your internet connection.');
      }

      console.error('❌ Error type:', error.constructor.name);
      console.error('❌ Error message:', error.message);
      throw new Error(`AI service error: ${error.message}`);
    }
  }
}

const aiService = new AIService();

// AI Routes with authentication and activity tracking
router.post('/explain-topic', authenticateToken, async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const result = await aiService.explainTopic(topic);

    // Record activity (only if MongoDB is connected)
    if (isMongoConnected()) {
      const user = await User.findById(req.user.userId);
      if (user) {
        await user.recordAIInteraction('explain', topic);
      }
    }

    res.json({ result });
  } catch (error) {
    console.error('Explain topic error:', error);
    res.status(500).json({ error: error.message || 'Failed to explain topic' });
  }
});

router.post('/summarize-notes', authenticateToken, async (req, res) => {
  try {
    const { notes } = req.body;
    if (!notes) {
      return res.status(400).json({ error: 'Notes are required' });
    }

    const result = await aiService.summarizeNotes(notes);

    // Record activity (only if MongoDB is connected)
    if (isMongoConnected()) {
      const user = await User.findById(req.user.userId);
      if (user) {
        await user.recordAIInteraction('summarize');
      }
    }

    res.json({ result });
  } catch (error) {
    console.error('Summarize notes error:', error);
    res.status(500).json({ error: error.message || 'Failed to summarize notes' });
  }
});

router.post('/generate-quiz', authenticateToken, async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const questions = await aiService.generateQuiz(topic);

    // Record activity (only if MongoDB is connected)
    if (isMongoConnected()) {
      const user = await User.findById(req.user.userId);
      if (user) {
        await user.recordAIInteraction('quiz', topic);
      }
    }

    res.json({ questions });
  } catch (error) {
    console.error('Generate quiz error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate quiz' });
  }
});

router.post('/generate-flashcards', authenticateToken, async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const flashcards = await aiService.generateFlashcards(topic);

    // Record activity (only if MongoDB is connected)
    if (isMongoConnected()) {
      const user = await User.findById(req.user.userId);
      if (user) {
        await user.recordAIInteraction('flashcards', topic);
      }
    }

    res.json({ flashcards });
  } catch (error) {
    console.error('Generate flashcards error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate flashcards' });
  }
});

router.post('/ask-question', authenticateToken, async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const answer = await aiService.askQuestion(question);

    // Record activity (only if MongoDB is connected)
    if (isMongoConnected()) {
      const user = await User.findById(req.user.userId);
      if (user) {
        await user.recordAIInteraction('question');
      }
    }

    res.json({ answer });
  } catch (error) {
    console.error('Ask question error:', error);
    res.status(500).json({ error: error.message || 'Failed to answer question' });
  }
});

router.get('/test-connection', authenticateToken, async (req, res) => {
  try {
    const result = await aiService.testConnection();
    res.json({ result, status: 'AI service is working' });
  } catch (error) {
    console.error('Test connection error:', error);
    res.status(500).json({ error: error.message || 'AI service test failed' });
  }
});

// Export a function that returns the router when called
// This ensures environment variables are loaded before the router is created
module.exports = function() {
  return router;
};