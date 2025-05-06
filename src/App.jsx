import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './App.css';
import {
  getModules,
  createModule,
  updateModule,
  deleteModule,
  getLessons,
  generateLessonContent,
  createLesson,
  updateLesson,
  deleteLesson
} from './services/api';

function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <span className="navbar-logo-title">
          <img src="/logo.png" alt="CourseGPT Logo" className="navbar-logo" />
          <span className="navbar-title">CourseGPT</span>
        </span>
        <div className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/modules">Modules</Link>
        </div>
      </div>
    </nav>
  );
}

function parseLessonSections(text) {
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

function HomePage({
  topic, setTopic, lesson, setLesson, prerequisites, setPrerequisites, difficulty, setDifficulty, estimatedTime, setEstimatedTime,
  generatedContent, setGeneratedContent, sectionTitle, setSectionTitle, sectionDescription, setSectionDescription, sectionOutcomes, setSectionOutcomes, sectionConcepts, setSectionConcepts, sectionActivities, setSectionActivities, loadingSection, setLoadingSection,
  modules, setModules, selectedModuleIdx, setSelectedModuleIdx, handleGenerate, regenerateSection, handleAddLessonToModule
}) {
  return (
    <div className="App">
      <header className="App-header">
        <form className="form-container" onSubmit={e => { e.preventDefault(); handleGenerate(); }}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="topic">Topic</label>
              <input id="topic" type="text" placeholder="Enter topic" value={topic} onChange={e => setTopic(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="lesson">Lesson</label>
              <input id="lesson" type="text" placeholder="Enter lesson" value={lesson} onChange={e => setLesson(e.target.value)} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="prerequisites">Prerequisites</label>
              <input id="prerequisites" type="text" placeholder="Prerequisites (comma separated)" value={prerequisites} onChange={e => setPrerequisites(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="difficulty">Difficulty</label>
              <select id="difficulty" value={difficulty} onChange={e => setDifficulty(e.target.value)}>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="estimatedTime">Estimated Time</label>
              <input id="estimatedTime" type="text" placeholder="Estimated Time (e.g. 30 min)" value={estimatedTime} onChange={e => setEstimatedTime(e.target.value)} />
            </div>
          </div>
          <div className="form-row" style={{ justifyContent: 'flex-end' }}>
            <button className="button" type="submit">Generate Lesson</button>
          </div>
        </form>
        {generatedContent && (
          <div>
            <h2>Generated Content</h2>
            <div style={{ width: '100%', maxWidth: 800, margin: '1em auto', background: '#fff', color: '#222', borderRadius: 8, padding: 16 }}>
              <div style={{ marginBottom: 12 }}>
                <label><b>Title:</b></label>
                <ReactQuill value={sectionTitle} onChange={setSectionTitle} theme="snow" style={{ marginBottom: 12, background: '#fff' }} modules={{ toolbar: [[{ 'header': [1, 2, false] }], ['bold', 'italic', 'underline'], [{ 'list': 'ordered'}, { 'list': 'bullet' }], ['clean']] }} />
                <button className="secondary-button" onClick={() => regenerateSection('title')} disabled={loadingSection==='title'}>{loadingSection==='title' ? 'Regenerating...' : 'Regenerate'}</button>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label><b>Description:</b></label>
                <ReactQuill value={sectionDescription} onChange={setSectionDescription} theme="snow" style={{ marginBottom: 12, background: '#fff' }} modules={{ toolbar: [[{ 'header': [1, 2, false] }], ['bold', 'italic', 'underline'], [{ 'list': 'ordered'}, { 'list': 'bullet' }], ['clean']] }} />
                <button className="secondary-button" onClick={() => regenerateSection('description')} disabled={loadingSection==='description'}>{loadingSection==='description' ? 'Regenerating...' : 'Regenerate'}</button>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label><b>Learning Outcomes:</b></label>
                <ReactQuill value={sectionOutcomes} onChange={setSectionOutcomes} theme="snow" style={{ marginBottom: 12, background: '#fff' }} modules={{ toolbar: [[{ 'header': [1, 2, false] }], ['bold', 'italic', 'underline'], [{ 'list': 'ordered'}, { 'list': 'bullet' }], ['clean']] }} />
                <button className="secondary-button" onClick={() => regenerateSection('outcomes')} disabled={loadingSection==='outcomes'}>{loadingSection==='outcomes' ? 'Regenerating...' : 'Regenerate'}</button>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label><b>Key Concepts:</b></label>
                <ReactQuill value={sectionConcepts} onChange={setSectionConcepts} theme="snow" style={{ marginBottom: 12, background: '#fff' }} modules={{ toolbar: [[{ 'header': [1, 2, false] }], ['bold', 'italic', 'underline'], [{ 'list': 'ordered'}, { 'list': 'bullet' }], ['clean']] }} />
                <button className="secondary-button" onClick={() => regenerateSection('concepts')} disabled={loadingSection==='concepts'}>{loadingSection==='concepts' ? 'Regenerating...' : 'Regenerate'}</button>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label><b>Engaging Activities:</b></label>
                <ReactQuill value={sectionActivities} onChange={setSectionActivities} theme="snow" style={{ marginBottom: 12, background: '#fff' }} modules={{ toolbar: [[{ 'header': [1, 2, false] }], ['bold', 'italic', 'underline'], [{ 'list': 'ordered'}, { 'list': 'bullet' }], ['clean']] }} />
                <button className="secondary-button" onClick={() => regenerateSection('activities')} disabled={loadingSection==='activities'}>{loadingSection==='activities' ? 'Regenerating...' : 'Regenerate'}</button>
              </div>
            </div>
            <div className="select-row">
              <select className="select" value={selectedModuleIdx ?? ''} onChange={e => setSelectedModuleIdx(e.target.value === '' ? null : Number(e.target.value))}>
                <option value="">Select Module</option>
                {modules.map((mod, idx) => (
                  <option key={idx} value={idx}>{mod.title}</option>
                ))}
              </select>
              <button className="button" onClick={handleAddLessonToModule} disabled={selectedModuleIdx === null}>Add Lesson to Module</button>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

function ModulesPage({ modules, setModules, newModuleTitle, setNewModuleTitle, newModuleDesc, setNewModuleDesc, handleAddModule, suggestLessonOrder }) {
  const [selectedModuleIdx, setSelectedModuleIdx] = React.useState('all');
  const [selectedLessonIdx, setSelectedLessonIdx] = React.useState('all');

  const selectedModule = selectedModuleIdx !== 'all' ? modules[selectedModuleIdx] : null;
  const lessons = selectedModule ? selectedModule.lessons : [];

  return (
    <div className="App">
      <header className="App-header">
        <h2>Modules</h2>
        <form className="form-container" onSubmit={e => { e.preventDefault(); handleAddModule(); }}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="moduleTitle">Module Title</label>
              <input id="moduleTitle" type="text" placeholder="Module Title" value={newModuleTitle} onChange={e => setNewModuleTitle(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="moduleDesc">Module Description</label>
              <input id="moduleDesc" type="text" placeholder="Module Description" value={newModuleDesc} onChange={e => setNewModuleDesc(e.target.value)} />
            </div>
            <div className="form-group" style={{ alignSelf: 'flex-end' }}>
              <button className="button" type="submit">Add Module</button>
            </div>
          </div>
        </form>
        {modules.length === 0 && <p>No modules yet.</p>}
        {modules.length > 0 && (
          <div className="select-row" style={{ marginBottom: 24 }}>
            <select className="select" value={selectedModuleIdx} onChange={e => { setSelectedModuleIdx(e.target.value); setSelectedLessonIdx('all'); }}>
              <option value="all">Show All</option>
              {modules.map((mod, idx) => (
                <option key={idx} value={idx}>{mod.title}</option>
              ))}
            </select>
            {selectedModule && lessons.length > 0 && (
              <select className="select" value={selectedLessonIdx} onChange={e => setSelectedLessonIdx(e.target.value)}>
                <option value="all">Show All Lessons</option>
                {lessons.map((les, lidx) => (
                  <option key={lidx} value={lidx}>{les.title}</option>
                ))}
              </select>
            )}
          </div>
        )}
        {(modules.length > 0 && selectedModuleIdx !== 'all') ? (
          selectedLessonIdx !== 'all' ? (
            <LessonCard les={lessons[selectedLessonIdx]} />
          ) : (
            <ModuleCard mod={selectedModule} idx={selectedModuleIdx} suggestLessonOrder={suggestLessonOrder} />
          )
        ) : (
          modules.map((mod, idx) => (
            <ModuleCard key={idx} mod={mod} idx={idx} suggestLessonOrder={suggestLessonOrder} />
          ))
        )}
      </header>
    </div>
  );
}

function ModuleCard({ mod, idx, suggestLessonOrder }) {
  return (
    <div style={{ background: '#222', color: '#fff', borderRadius: 8, padding: 16, marginBottom: 16 }}>
      <h3>{mod.title}</h3>
      <p>{mod.description}</p>
      <button className="secondary-button" onClick={() => suggestLessonOrder(idx)} style={{ marginBottom: 8 }}>Suggest Lesson Order</button>
      <h4>Lessons:</h4>
      {mod.lessons.length === 0 && <p>No lessons in this module.</p>}
      <ul>
        {mod.lessons.map((les, lidx) => {
          console.log('ModuleCard lesson:', les);
          return (
            <li key={lidx} style={{ marginBottom: 16 }}>
              <strong>{les.title}</strong> ({les.topic})
              <div style={{ fontSize: '0.95em', marginTop: 4, background: '#fff', color: '#222', borderRadius: 4, padding: 8 }}>
                <div><b>Title:</b> <span dangerouslySetInnerHTML={{ __html: les.content?.title || '' }} /></div>
                <div><b>Description:</b> <span dangerouslySetInnerHTML={{ __html: les.content?.description || '' }} /></div>
                <div><b>Learning Outcomes:</b> <span dangerouslySetInnerHTML={{ __html: les.content?.outcomes || '' }} /></div>
                <div><b>Key Concepts:</b> <span dangerouslySetInnerHTML={{ __html: les.content?.concepts || '' }} /></div>
                <div><b>Engaging Activities:</b> <span dangerouslySetInnerHTML={{ __html: les.content?.activities || '' }} /></div>
              </div>
              <div style={{ fontSize: '0.9em', marginTop: 4, color: '#ccc' }}>
                <div><b>Prerequisites:</b> {les.prerequisites || 'None'}</div>
                <div><b>Difficulty:</b> {les.difficulty}</div>
                <div><b>Estimated Time:</b> {les.estimatedTime || 'N/A'}</div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function LessonCard({ les }) {
  if (!les) return null;
  console.log('LessonCard data:', les);
  return (
    <div style={{ background: '#222', color: '#fff', borderRadius: 8, padding: 16, marginBottom: 16 }}>
      <strong>{les.title}</strong> ({les.topic})
      <div style={{ fontSize: '0.95em', marginTop: 4, background: '#fff', color: '#222', borderRadius: 4, padding: 8 }}>
        <div><b>Title:</b> <span dangerouslySetInnerHTML={{ __html: les.content?.title || '' }} /></div>
        <div><b>Description:</b> <span dangerouslySetInnerHTML={{ __html: les.content?.description || '' }} /></div>
        <div><b>Learning Outcomes:</b> <span dangerouslySetInnerHTML={{ __html: les.content?.outcomes || '' }} /></div>
        <div><b>Key Concepts:</b> <span dangerouslySetInnerHTML={{ __html: les.content?.concepts || '' }} /></div>
        <div><b>Engaging Activities:</b> <span dangerouslySetInnerHTML={{ __html: les.content?.activities || '' }} /></div>
      </div>
      <div style={{ fontSize: '0.9em', marginTop: 4, color: '#ccc' }}>
        <div><b>Prerequisites:</b> {les.prerequisites || 'None'}</div>
        <div><b>Difficulty:</b> {les.difficulty}</div>
        <div><b>Estimated Time:</b> {les.estimatedTime || 'N/A'}</div>
      </div>
    </div>
  );
}

function App() {
  // Shared state
  const [topic, setTopic] = useState('');
  const [lesson, setLesson] = useState('');
  const [generatedContent, setGeneratedContent] = useState(null);
  const [sectionTitle, setSectionTitle] = useState('');
  const [sectionDescription, setSectionDescription] = useState('');
  const [sectionOutcomes, setSectionOutcomes] = useState('');
  const [sectionConcepts, setSectionConcepts] = useState('');
  const [sectionActivities, setSectionActivities] = useState('');
  const [loadingSection, setLoadingSection] = useState('');
  const [prerequisites, setPrerequisites] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [modules, setModules] = useState([]);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [newModuleDesc, setNewModuleDesc] = useState('');
  const [selectedModuleIdx, setSelectedModuleIdx] = useState(null);

  // Load modules on component mount
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const data = await getModules();
        setModules(data);
      } catch (error) {
        console.error('Error fetching modules:', error);
      }
    };
    fetchModules();
  }, []);

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

  const regenerateSection = async (section) => {
    setLoadingSection(section);
    let prompt = '';
    switch (section) {
      case 'title':
        prompt = `Give only a single, short lesson title for the topic: ${topic} and lesson: ${lesson}. No heading, no quotes, no extra text, no summary, no newlines.`;
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

  const handleAddModule = async () => {
    if (!newModuleTitle) return;
    try {
      const module = await createModule({
        title: newModuleTitle,
        description: newModuleDesc
      });
      setModules([...modules, module]);
      setNewModuleTitle('');
      setNewModuleDesc('');
    } catch (error) {
      alert('Failed to create module.');
    }
  };

  const handleAddLessonToModule = async () => {
    if (selectedModuleIdx === null) return;
    try {
      const lessonData = {
        title: lesson,
        topic: topic,
        prerequisites,
        difficulty,
        estimatedTime,
        content: {
          title: sectionTitle,
          description: sectionDescription,
          outcomes: sectionOutcomes,
          concepts: sectionConcepts,
          activities: sectionActivities
        },
        moduleId: modules[selectedModuleIdx]._id
      };
      console.log('Creating lesson with data:', lessonData);
      const newLesson = await createLesson(lessonData);
      const updatedModules = [...modules];
      updatedModules[selectedModuleIdx].lessons.push(newLesson);
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
    } catch (error) {
      alert('Failed to add lesson to module.');
    }
  };

  const suggestLessonOrder = async (moduleIdx) => {
    const module = modules[moduleIdx];
    if (!module || !module.lessons) return;
    
    const lessons = [...module.lessons].filter(lesson => lesson && lesson.title); // Filter out invalid lessons
    if (lessons.length === 0) return;

    const lessonTitles = lessons.map(l => l.title.trim().toLowerCase());
    const sorted = [];
    const added = new Set();
    
    while (lessons.length) {
      let addedThisRound = false;
      // Collect all lessons whose prerequisites are satisfied
      const toAdd = [];
      for (let i = 0; i < lessons.length; i++) {
        const l = lessons[i];
        if (!l || !l.title) continue; // Skip invalid lessons
        
        const prereqs = (l.prerequisites || '').split(',').map(p => p.trim().toLowerCase()).filter(Boolean);
        if (prereqs.length === 0 || prereqs.every(p => added.has(p) || !lessonTitles.includes(p))) {
          toAdd.push(i);
        }
      }
      
      if (toAdd.length === 0) {
        // Circular or missing prerequisites, add the rest
        sorted.push(...lessons.filter(l => l && l.title));
        break;
      }
      
      // Add all eligible lessons this round
      for (let j = toAdd.length - 1; j >= 0; j--) {
        const idx = toAdd[j];
        const l = lessons[idx];
        if (!l || !l.title) continue; // Skip invalid lessons
        
        sorted.push(l);
        added.add(l.title.trim().toLowerCase());
        lessons.splice(idx, 1);
        addedThisRound = true;
      }
      
      if (!addedThisRound) break;
    }
    
    try {
      const updatedModule = await updateModule(module._id, {
        ...module,
        lessons: sorted.map(l => l._id)
      });
      const updatedModules = [...modules];
      updatedModules[moduleIdx] = updatedModule;
      setModules(updatedModules);
    } catch (error) {
      console.error('Failed to update lesson order:', error);
      alert('Failed to update lesson order.');
    }
  };

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={
          <HomePage
            topic={topic} setTopic={setTopic}
            lesson={lesson} setLesson={setLesson}
            prerequisites={prerequisites} setPrerequisites={setPrerequisites}
            difficulty={difficulty} setDifficulty={setDifficulty}
            estimatedTime={estimatedTime} setEstimatedTime={setEstimatedTime}
            generatedContent={generatedContent} setGeneratedContent={setGeneratedContent}
            sectionTitle={sectionTitle} setSectionTitle={setSectionTitle}
            sectionDescription={sectionDescription} setSectionDescription={setSectionDescription}
            sectionOutcomes={sectionOutcomes} setSectionOutcomes={setSectionOutcomes}
            sectionConcepts={sectionConcepts} setSectionConcepts={setSectionConcepts}
            sectionActivities={sectionActivities} setSectionActivities={setSectionActivities}
            loadingSection={loadingSection} setLoadingSection={setLoadingSection}
            modules={modules} setModules={setModules}
            selectedModuleIdx={selectedModuleIdx} setSelectedModuleIdx={setSelectedModuleIdx}
            handleGenerate={handleGenerate}
            regenerateSection={regenerateSection}
            handleAddLessonToModule={handleAddLessonToModule}
          />
        } />
        <Route path="/modules" element={
          <ModulesPage
            modules={modules} setModules={setModules}
            newModuleTitle={newModuleTitle} setNewModuleTitle={setNewModuleTitle}
            newModuleDesc={newModuleDesc} setNewModuleDesc={setNewModuleDesc}
            handleAddModule={handleAddModule}
            suggestLessonOrder={suggestLessonOrder}
          />
        } />
      </Routes>
    </Router>
  );
}

export default App; 