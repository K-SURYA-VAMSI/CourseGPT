import axios from 'axios';

// Use environment variable for API URL, fallback to localhost for development
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 seconds timeout for Gemini API calls
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    const message = error.response?.data?.message || 'An error occurred';
    console.error('API Error:', message);
    throw new Error(message);
  }
);

// Module API calls
export const getModules = async () => {
  const response = await api.get('/modules');
  return response.data;
};

export const createModule = async (moduleData) => {
  const response = await api.post('/modules', moduleData);
  return response.data;
};

export const updateModule = async (id, moduleData) => {
  const response = await api.put(`/modules/${id}`, moduleData);
  return response.data;
};

export const deleteModule = async (id) => {
  const response = await api.delete(`/modules/${id}`);
  return response.data;
};

// Lesson API calls
export const getLessons = async () => {
  const response = await api.get('/lessons');
  return response.data;
};

export const generateLessonContent = async (topic, lesson) => {
  if (!topic || !lesson) {
    throw new Error('Topic and lesson details are required');
  }
  
  const response = await api.post('/lessons/generate', { topic, lesson });
  return response.data;
};

export const createLesson = async (lessonData) => {
  const response = await api.post('/lessons', lessonData);
  return response.data;
};

export const updateLesson = async (id, lessonData) => {
  const response = await api.put(`/lessons/${id}`, lessonData);
  return response.data;
};

export const deleteLesson = async (id) => {
  const response = await api.delete(`/lessons/${id}`);
  return response.data;
}; 