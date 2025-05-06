import axios from 'axios';

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent';

if (!GEMINI_API_KEY) {
  console.error('REACT_APP_GEMINI_API_KEY is not defined in environment variables');
}

export const generateLessonContent = async (topic, lesson) => {
  try {
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
    return response.data;
  } catch (error) {
    console.error('Error generating lesson content:', error);
    throw error;
  }
}; 