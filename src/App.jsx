import React, { useState } from 'react';
import './App.css';
import { generateLessonContent } from './services/geminiService';

function App() {
  const [topic, setTopic] = useState('');
  const [lesson, setLesson] = useState('');
  const [generatedContent, setGeneratedContent] = useState(null);

  const handleGenerate = async () => {
    try {
      const result = await generateLessonContent(topic, lesson);
      setGeneratedContent(result);
    } catch (error) {
      setGeneratedContent({ error: 'Failed to generate lesson content.' });
    }
  };

  const getLessonText = () => {
    if (
      generatedContent &&
      generatedContent.candidates &&
      generatedContent.candidates[0] &&
      generatedContent.candidates[0].content &&
      generatedContent.candidates[0].content.parts &&
      generatedContent.candidates[0].content.parts[0] &&
      generatedContent.candidates[0].content.parts[0].text
    ) {
      return generatedContent.candidates[0].content.parts[0].text;
    }
    if (generatedContent && generatedContent.error) {
      return generatedContent.error;
    }
    return '';
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>CourseGPT</h1>
        <div>
          <input
            type="text"
            placeholder="Enter topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter lesson"
            value={lesson}
            onChange={(e) => setLesson(e.target.value)}
          />
          <button onClick={handleGenerate}>Generate Lesson</button>
        </div>
        {generatedContent && (
          <div>
            <h2>Generated Content</h2>
            <div style={{ textAlign: 'left', background: '#fff', color: '#222', padding: '1em', borderRadius: '8px', maxWidth: 800, margin: '1em auto', whiteSpace: 'pre-wrap' }}>
              {getLessonText()}
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App; 