const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent';

if (!GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY is not defined in environment variables');
  process.exit(1); // Exit if API key is not configured
}

const validateInput = (topic, lesson) => {
  if (!topic || typeof topic !== 'string') {
    throw new Error('Topic is required and must be a string');
  }
  if (!lesson || typeof lesson !== 'string') {
    throw new Error('Lesson details are required and must be a string');
  }
};

const generateLessonContent = async (topic, lesson) => {
  try {
    // Validate input
    validateInput(topic, lesson);

    console.log(`Generating lesson content for topic: ${topic}`);

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `Generate a lesson on ${topic} with the following details: ${lesson}. Include a title, description, learning outcomes, key concepts, and engaging activities.`
              }
            ]
          }
        ]
      }
    );

    if (!response.data) {
      throw new Error('No response data received from Gemini API');
    }

    console.log('Successfully generated lesson content');
    return response.data;
  } catch (error) {
    console.error('Error generating lesson content:', error.message);
    if (error.response) {
      console.error('API Response:', error.response.data);
    }
    throw new Error(`Failed to generate lesson content: ${error.message}`);
  }
};

module.exports = {
  generateLessonContent
}; 