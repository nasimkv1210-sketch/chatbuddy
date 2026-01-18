// Using OpenRouter API directly (fetch-based) for better browser compatibility

// Check API key configuration
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const isConfigured = !!apiKey && apiKey !== 'your_openai_api_key_here';

if (!isConfigured) {
  console.warn('⚠️ API key not configured. Please set VITE_OPENAI_API_KEY in your .env file.');
  console.warn('For OpenRouter: Get your API key from: https://openrouter.ai/keys');
  console.warn('For OpenAI: Get your API key from: https://platform.openai.com/api-keys');
}

  class AIService {
    async explainTopic(topic) {
      // Check if AI is configured
      if (!isConfigured) {
        throw new Error('OpenAI API key not configured. Please set VITE_OPENAI_API_KEY in your .env file. Get your API key from: https://platform.openai.com/api-keys');
      }

      console.log('🤖 AI Service: Making request for topic:', topic);
      console.log('🤖 AI Service: API key configured:', isConfigured);

      try {
        const prompt = `Explain the topic "${topic}" in simple, easy-to-understand terms for a student. Include:
      1. A clear definition
      2. Key concepts
      3. Real-world examples
      4. Why it's important to understand

      Keep the explanation concise but comprehensive, using simple language.`;

      console.log('📡 Calling OpenRouter API...');

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': window.location.origin,
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

      console.log('📡 Response status:', response.status);

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
      console.log('✅ Response received, length:', result.length);

      return result;
    } catch (error) {
      console.error('❌ Error explaining topic:', error);

      if (error.message.includes('quota') || error.message.includes('insufficient')) {
        throw new Error('API quota exceeded. You may need to upgrade your OpenRouter plan or wait for quota reset.');
      } else if (error.message.includes('rate limit') || error.message.includes('429')) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      } else if (error.message.includes('401') || error.message.includes('unauthorized')) {
        throw new Error('Invalid API key. Please check your API key in the .env file.');
      }

      throw new Error('Failed to explain the topic. Please check your internet connection and try again.');
    }
    }

    // Simple test method to check if API is working
    async testConnection() {
      console.log('🧪 Testing OpenRouter connection...');

      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'HTTP-Referer': window.location.origin,
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

        console.log('📡 Test Response status:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ Test API Error:', response.status, errorText);
          throw new Error(`API Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        const result = data.choices[0].message.content.trim();
        console.log('✅ OpenRouter test successful! Response:', result);
        return result;
      } catch (error) {
        console.error('❌ OpenRouter test failed:', error);
        console.error('❌ Error type:', error.constructor.name);
        console.error('❌ Error message:', error.message);
        throw error;
      }
    }

  async summarizeNotes(notes) {
    // Check if AI is configured
    if (!isConfigured) {
      throw new Error('API key not configured. Please set VITE_OPENAI_API_KEY in your .env file. For OpenRouter, you can get a key from: https://openrouter.ai/keys');
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
          'HTTP-Referer': window.location.origin,
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

      if (error.message.includes('quota') || error.message.includes('insufficient')) {
        throw new Error('API quota exceeded. You may need to upgrade your OpenRouter plan or wait for quota reset.');
      } else if (error.message.includes('rate limit') || error.message.includes('429')) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      }

      throw new Error('Failed to summarize the notes. Please check your internet connection and try again.');
    }
  }

  async generateQuiz(topic) {
    // Check if AI is configured
    if (!isConfigured) {
      throw new Error('API key not configured. Please set VITE_OPENAI_API_KEY in your .env file. For OpenRouter, you can get a key from: https://openrouter.ai/keys');
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
          'HTTP-Referer': window.location.origin,
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

      console.log('🤖 Raw quiz response:', quizText);

      // Parse the quiz response into structured format
      const questions = [];

      // Split by --- separators first, then fallback to double newlines
      let sections = quizText.split('---').filter(section => section.trim());
      if (sections.length <= 1) {
        sections = quizText.split('\n\n').filter(section => section.trim());
      }

      console.log('📋 Quiz sections found:', sections.length);
      console.log('📄 Raw quiz text:', quizText);

      for (let i = 0; i < Math.min(sections.length, 3); i++) {
        const section = sections[i].trim();
        const lines = section.split('\n').map(line => line.trim()).filter(line => line);

        let question = '';
        const options = [];
        let correctIndex = 0;

        console.log(`📝 Processing section ${i + 1}:`, section);

        for (const line of lines) {
          if (line.startsWith('Question:') || line.startsWith('Question ')) {
            question = line.replace(/Question:?\s*/, '').trim();
            console.log('❓ Found question:', question);
          } else if (line.match(/^[A-D]\)/) || line.match(/^[A-D]\./) || line.match(/^[A-D]\s*\)/)) {
            // Handle various formats: A), A., A )
            const cleanLine = line.replace(/^[A-D][\.\)]\s*/, '').trim();
            if (cleanLine) {
              options.push(cleanLine);
              console.log('🔤 Found option:', cleanLine);
            }
          } else if (line.startsWith('Correct:') || line.startsWith('Correct ')) {
            const correctText = line.replace(/Correct:?\s*/, '').trim();
            const correctLetter = correctText.charAt(0).toUpperCase();
            correctIndex = ['A', 'B', 'C', 'D'].indexOf(correctLetter);
            if (correctIndex === -1) correctIndex = 0; // Default to first option if parsing fails
            console.log('✅ Found correct answer:', correctLetter, 'index:', correctIndex);
          }
        }

        // If we found a question and at least 2 options, create the question
        if (question && options.length >= 2) {
          // Ensure we have exactly 4 options
          while (options.length < 4) {
            options.push(`Option ${String.fromCharCode(65 + options.length)}`); // A, B, C, D
          }
          options.splice(4); // Keep only first 4

          questions.push({
            question,
            options,
            correct: Math.max(0, correctIndex)
          });
          console.log('✅ Added question:', { question, options, correct: correctIndex });
        } else {
          console.log('❌ Question not added - missing data:', {
            hasQuestion: !!question,
            optionsLength: options.length,
            question,
            options
          });
        }
      }

      console.log('📊 Final questions array:', questions);

      // If no questions were parsed, return a fallback quiz
      if (questions.length === 0) {
        console.log('⚠️ No questions parsed, returning fallback quiz');
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

      if (error.message.includes('API key')) {
        throw new Error('OpenAI API key is invalid. Please check your .env file and ensure you have a valid API key from https://platform.openai.com/api-keys');
      }

      throw new Error('Failed to generate quiz. Please check your internet connection and try again.');
    }
  }

  async generateFlashcards(topic) {
    // Check if AI is configured
    if (!isConfigured) {
      throw new Error('API key not configured. Please set VITE_OPENAI_API_KEY in your .env file. For OpenRouter, you can get a key from: https://openrouter.ai/keys');
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
          'HTTP-Referer': window.location.origin,
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

      // Parse the flashcards response with improved logic
      const flashcards = [];

      // Try multiple parsing strategies
      const strategies = [
        // Strategy 1: Look for "Front:" and "Back:" patterns
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

        // Strategy 2: Look for numbered cards (1., 2., etc.)
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

        // Strategy 3: Split by double newlines and treat each block as a card
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

      // Try each strategy until one works
      for (const strategy of strategies) {
        flashcards.length = 0; // Reset array
        if (strategy(flashcardsText)) {
          break;
        }
      }

      // If all strategies failed, create basic fallback flashcards
      if (flashcards.length === 0) {
        flashcards.push(
          { front: `What is ${topic}?`, back: `${topic} is an important concept in the field of study.` },
          { front: `Key aspects of ${topic}`, back: `Understanding ${topic} involves learning its fundamental principles and applications.` },
          { front: `Why study ${topic}?`, back: `Studying ${topic} helps develop critical thinking and problem-solving skills.` },
          { front: `Applications of ${topic}`, back: `${topic} has practical applications in various real-world scenarios.` }
        );
      }

      return flashcards.slice(0, 4); // Return max 4 flashcards
    } catch (error) {
      console.error('Error generating flashcards:', error);

      if (error.message.includes('API key')) {
        throw new Error('OpenAI API key is invalid. Please check your .env file and ensure you have a valid API key from https://platform.openai.com/api-keys');
      }

      throw new Error('Failed to generate flashcards. Please check your internet connection and try again.');
    }
  }

  async askQuestion(question) {
    // Check if AI is configured
    if (!isConfigured) {
      throw new Error('API key not configured. Please set VITE_OPENAI_API_KEY in your .env file. For OpenRouter, you can get a key from: https://openrouter.ai/keys');
    }

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': window.location.origin,
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
}

export const aiService = new AIService();

// Export individual functions for convenience
export const explainTopic = (topic) => aiService.explainTopic(topic);
export const summarizeNotes = (notes) => aiService.summarizeNotes(notes);
export const generateQuiz = (topic) => aiService.generateQuiz(topic);
export const generateFlashcards = (topic) => aiService.generateFlashcards(topic);
export const askQuestion = (question) => aiService.askQuestion(question);
export const testConnection = () => aiService.testConnection();