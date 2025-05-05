import axios from 'axios';

const GEMINI_API_KEY = 'AIzaSyDfTk52veSZ696lw1Hne0a4HD0oC1bq7BE'; 
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent';

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