import React, { useState } from 'react';
import './App.css';
import { generateLessonContent } from './services/geminiService';


function parseLessonSections(text) {
  // Simple regex-based parsing for demonstration
  const titleMatch = text.match(/^#+\s*(.*)/m);
  const descriptionMatch = text.match(/\*\*Description:\*\*([\s\S]*?)\*\*Learning Outcomes:\*\*/m);
  const outcomesMatch = text.match(/\*\*Learning Outcomes:\*\*([\s\S]*?)\*\*Key Concepts:\*\*/m);
  const conceptsMatch = text.match(/\*\*Key Concepts:\*\*([\s\S]*?)\*\*Engaging Activities:\*\*/m);
  const activitiesMatch = text.match(/\*\*Engaging Activities:\*\*([\s\S]*)/m);

  return {
    title: titleMatch ? titleMatch[1].trim() : '',
    description: descriptionMatch ? descriptionMatch[1].trim() : '',
    outcomes: outcomesMatch ? outcomesMatch[1].trim() : '',
    concepts: conceptsMatch ? conceptsMatch[1].trim() : '',
    activities: activitiesMatch ? activitiesMatch[1].trim() : '',
  };
}

function App() {
  const [topic, setTopic] = useState('');
  const [lesson, setLesson] = useState('');
  const [generatedContent, setGeneratedContent] = useState(null);

  // Section states
  const [sectionTitle, setSectionTitle] = useState('');
  const [sectionDescription, setSectionDescription] = useState('');
  const [sectionOutcomes, setSectionOutcomes] = useState('');
  const [sectionConcepts, setSectionConcepts] = useState('');
  const [sectionActivities, setSectionActivities] = useState('');
  const [loadingSection, setLoadingSection] = useState('');

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
      const text = getLessonText(result);
      const sections = parseLessonSections(text);
      setSectionTitle(sections.title);
      setSectionDescription(sections.description);
      setSectionOutcomes(sections.outcomes);
      setSectionConcepts(sections.concepts);
      setSectionActivities(sections.activities);
    } catch (error) {
      if (error.response && error.response.status === 429) {
        alert('You have reached the request limit for the Gemini API. Please wait and try again later.');
      } else {
        alert('Failed to generate lesson content.');
      }
      setGeneratedContent({ error: 'Failed to generate lesson content.' });
      setSectionTitle('');
      setSectionDescription('');
      setSectionOutcomes('');
      setSectionConcepts('');
      setSectionActivities('');
    }
  };

  // Accepts an optional content object (for use in handleGenerate)
  const getLessonText = (content = generatedContent) => {
    if (
      content &&
      content.candidates &&
      content.candidates[0] &&
      content.candidates[0].content &&
      content.candidates[0].content.parts &&
      content.candidates[0].content.parts[0] &&
      content.candidates[0].content.parts[0].text
    ) {
      return content.candidates[0].content.parts[0].text;
    }
    if (content && content.error) {
      return content.error;
    }
    return '';
  };

  // Section-specific regeneration
  const regenerateSection = async (section) => {
    setLoadingSection(section);
    let prompt = '';
    switch (section) {
      case 'title':
        prompt = `Return only a single, short lesson title for the topic: ${topic} and lesson: ${lesson}. No heading, no quotes, no extra text, no summary, no newlines.`;
        break;
      case 'description':
        prompt = `Generate ONLY a detailed lesson description for the topic: ${topic} and lesson: ${lesson}. Return only a single paragraph description, no title, no heading, no list, no summary.`;
        break;
      case 'outcomes':
        prompt = `List ONLY well-crafted learning outcomes for a lesson on ${topic} (${lesson}). Return only the list of outcomes as bullet points, no title, no introduction, no summary.`;
        break;
      case 'concepts':
        prompt = `Return only a bullet list of the key concepts and terminology for a lesson on ${topic} (${lesson}). No title, no introduction, no summary, no extra text, no newlines before the first bullet.`;
        break;
      case 'activities':
        prompt = `Return only a bullet list of engaging learning activities and examples for a lesson on ${topic} (${lesson}). No title, no introduction, no summary, no extra text, no newlines before the first bullet.`;
        break;
      default:
        break;
    }
    try {
      const result = await generateLessonContent(topic, prompt);
      const text = getLessonText(result).trim();
      // Helper to extract first bullet/numbered list
      const extractFirstList = (str) => {
        const lines = str.split('\n');
        const listLines = [];
        let inList = false;
        for (let line of lines) {
          if (/^\s*([*-]|\d+\.)\s+/.test(line)) {
            listLines.push(line);
            inList = true;
          } else if (inList && line.trim() === '') {
            break;
          } else if (inList) {
            break;
          }
        }
        return listLines.length > 0 ? listLines.join('\n') : str;
      };
      // Loosened fallback checks
      if (section === 'title') {
        if (text && text.split('\n').length === 1 && text.length > 2) setSectionTitle(text);
        else alert('Regenerated title does not look like a single-line title. Please try again.');
      }
      if (section === 'description') {
        if (text && text.length > 10) setSectionDescription(text.split('\n\n')[0]);
        else alert('Regenerated description does not look like a description. Please try again.');
      }
      if (section === 'outcomes') {
        const list = extractFirstList(text);
        if (list.match(/^[*-]|\d+\./m)) setSectionOutcomes(list);
        else alert('Regenerated outcomes do not look like a list. Please try again.');
      }
      if (section === 'concepts') {
        const list = extractFirstList(text);
        if (list.match(/^[*-]|\d+\./m)) setSectionConcepts(list);
        else alert('Regenerated key concepts do not look like a list. Please try again.');
      }
      if (section === 'activities') {
        const list = extractFirstList(text);
        if (list.match(/^[*-]|\d+\./m)) setSectionActivities(list);
        else alert('Regenerated activities do not look like a list. Please try again.');
      }
    } catch (error) {
      if (error.response && error.response.status === 429) {
        alert('You have reached the request limit for the Gemini API. Please wait and try again later.');
      } else {
        alert('Failed to regenerate section.');
      }
    } finally {
      setLoadingSection('');
    }
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

  // Add edited lesson to selected module
  const handleAddLessonToModule = () => {
    if (selectedModuleIdx === null) return;
    const lessonObj = {
      title: lesson,
      topic: topic,
      prerequisites,
      difficulty,
      estimatedTime,
      // Combine all sections for the lesson content
      content: `# ${sectionTitle}\n\n**Description:** ${sectionDescription}\n\n**Learning Outcomes:**\n${sectionOutcomes}\n\n**Key Concepts:**\n${sectionConcepts}\n\n**Engaging Activities:**\n${sectionActivities}`
    };
    const updatedModules = [...modules];
    updatedModules[selectedModuleIdx].lessons.push(lessonObj);
    setModules(updatedModules);
    setGeneratedContent(null);
    setSectionTitle('');
    setSectionDescription('');
    setSectionOutcomes('');
    setSectionConcepts('');
    setSectionActivities('');
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
            <div style={{ width: '100%', maxWidth: 800, margin: '1em auto', background: '#fff', color: '#222', borderRadius: 8, padding: 16 }}>
              <div style={{ marginBottom: 12 }}>
                <label><b>Title:</b></label>
                <textarea value={sectionTitle} onChange={e => setSectionTitle(e.target.value)} rows={2} style={{ width: '80%', borderRadius: 4, padding: 6, fontSize: 16 }} />
                <button onClick={() => regenerateSection('title')} disabled={loadingSection==='title'} style={{ marginLeft: 8 }}>{loadingSection==='title' ? 'Regenerating...' : 'Regenerate'}</button>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label><b>Description:</b></label>
                <textarea value={sectionDescription} onChange={e => setSectionDescription(e.target.value)} rows={3} style={{ width: '80%', borderRadius: 4, padding: 6, fontSize: 16 }} />
                <button onClick={() => regenerateSection('description')} disabled={loadingSection==='description'} style={{ marginLeft: 8 }}>{loadingSection==='description' ? 'Regenerating...' : 'Regenerate'}</button>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label><b>Learning Outcomes:</b></label>
                <textarea value={sectionOutcomes} onChange={e => setSectionOutcomes(e.target.value)} rows={4} style={{ width: '80%', borderRadius: 4, padding: 6, fontSize: 16 }} />
                <button onClick={() => regenerateSection('outcomes')} disabled={loadingSection==='outcomes'} style={{ marginLeft: 8 }}>{loadingSection==='outcomes' ? 'Regenerating...' : 'Regenerate'}</button>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label><b>Key Concepts:</b></label>
                <textarea value={sectionConcepts} onChange={e => setSectionConcepts(e.target.value)} rows={4} style={{ width: '80%', borderRadius: 4, padding: 6, fontSize: 16 }} />
                <button onClick={() => regenerateSection('concepts')} disabled={loadingSection==='concepts'} style={{ marginLeft: 8 }}>{loadingSection==='concepts' ? 'Regenerating...' : 'Regenerate'}</button>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label><b>Engaging Activities:</b></label>
                <textarea value={sectionActivities} onChange={e => setSectionActivities(e.target.value)} rows={4} style={{ width: '80%', borderRadius: 4, padding: 6, fontSize: 16 }} />
                <button onClick={() => regenerateSection('activities')} disabled={loadingSection==='activities'} style={{ marginLeft: 8 }}>{loadingSection==='activities' ? 'Regenerating...' : 'Regenerate'}</button>
              </div>
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