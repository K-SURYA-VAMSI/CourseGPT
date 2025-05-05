import React, { useState } from 'react';
import './App.css';
import { generateLessonContent } from './services/geminiService';

function App() {
  const [topic, setTopic] = useState('');
  const [lesson, setLesson] = useState('');
  const [generatedContent, setGeneratedContent] = useState(null);

  // Lesson metadata state
  const [prerequisites, setPrerequisites] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [estimatedTime, setEstimatedTime] = useState('');

  // Module organization state
  const [modules, setModules] = useState([]);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [newModuleDesc, setNewModuleDesc] = useState('');
  const [selectedModuleIdx, setSelectedModuleIdx] = useState(null);

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

  // Module creation handlers
  const handleAddModule = () => {
    if (!newModuleTitle) return;
    setModules([
      ...modules,
      { title: newModuleTitle, description: newModuleDesc, lessons: [] }
    ]);
    setNewModuleTitle('');
    setNewModuleDesc('');
  };

  // Add generated lesson to selected module
  const handleAddLessonToModule = () => {
    if (selectedModuleIdx === null || !generatedContent) return;
    const lessonObj = {
      title: lesson,
      content: getLessonText(),
      topic: topic,
      prerequisites,
      difficulty,
      estimatedTime
    };
    const updatedModules = [...modules];
    updatedModules[selectedModuleIdx].lessons.push(lessonObj);
    setModules(updatedModules);
    setGeneratedContent(null);
    setLesson('');
    setTopic('');
    setPrerequisites('');
    setDifficulty('Easy');
    setEstimatedTime('');
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
          <input
            type="text"
            placeholder="Prerequisites (comma separated)"
            value={prerequisites}
            onChange={e => setPrerequisites(e.target.value)}
            style={{ marginLeft: 8 }}
          />
          <select
            value={difficulty}
            onChange={e => setDifficulty(e.target.value)}
            style={{ marginLeft: 8 }}
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <input
            type="text"
            placeholder="Estimated Time (e.g. 30 min)"
            value={estimatedTime}
            onChange={e => setEstimatedTime(e.target.value)}
            style={{ marginLeft: 8 }}
          />
          <button onClick={handleGenerate} style={{ marginLeft: 8 }}>Generate Lesson</button>
        </div>
        {generatedContent && (
          <div>
            <h2>Generated Content</h2>
            <div style={{ textAlign: 'left', background: '#fff', color: '#222', padding: '1em', borderRadius: '8px', maxWidth: 800, margin: '1em auto', whiteSpace: 'pre-wrap' }}>
              {getLessonText()}
            </div>
            <div style={{ marginTop: '1em' }}>
              <select value={selectedModuleIdx ?? ''} onChange={e => setSelectedModuleIdx(e.target.value === '' ? null : Number(e.target.value))}>
                <option value="">Select Module</option>
                {modules.map((mod, idx) => (
                  <option key={idx} value={idx}>{mod.title}</option>
                ))}
              </select>
              <button onClick={handleAddLessonToModule} disabled={selectedModuleIdx === null}>Add Lesson to Module</button>
            </div>
          </div>
        )}
        <div style={{ marginTop: '2em', width: '100%', maxWidth: 800, marginLeft: 'auto', marginRight: 'auto' }}>
          <h2>Modules</h2>
          <div style={{ marginBottom: '1em' }}>
            <input
              type="text"
              placeholder="Module Title"
              value={newModuleTitle}
              onChange={e => setNewModuleTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="Module Description"
              value={newModuleDesc}
              onChange={e => setNewModuleDesc(e.target.value)}
            />
            <button onClick={handleAddModule}>Add Module</button>
          </div>
          {modules.length === 0 && <p>No modules yet.</p>}
          {modules.map((mod, idx) => (
            <div key={idx} style={{ background: '#222', color: '#fff', borderRadius: 8, padding: 16, marginBottom: 16 }}>
              <h3>{mod.title}</h3>
              <p>{mod.description}</p>
              <h4>Lessons:</h4>
              {mod.lessons.length === 0 && <p>No lessons in this module.</p>}
              <ul>
                {mod.lessons.map((les, lidx) => (
                  <li key={lidx} style={{ marginBottom: 16 }}>
                    <strong>{les.title}</strong> ({les.topic})
                    <div style={{ fontSize: '0.95em', marginTop: 4, background: '#fff', color: '#222', borderRadius: 4, padding: 8, whiteSpace: 'pre-wrap' }}>{les.content}</div>
                    <div style={{ fontSize: '0.9em', marginTop: 4, color: '#ccc' }}>
                      <div><b>Prerequisites:</b> {les.prerequisites || 'None'}</div>
                      <div><b>Difficulty:</b> {les.difficulty}</div>
                      <div><b>Estimated Time:</b> {les.estimatedTime || 'N/A'}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App; 