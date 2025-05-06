const express = require('express');
const router = express.Router();
const Lesson = require('../models/Lesson');
const Module = require('../models/Module');
const { generateLessonContent } = require('../services/geminiService');

// Get all lessons
router.get('/', async (req, res) => {
  try {
    const lessons = await Lesson.find()
      .populate('module')
      .sort({ createdAt: -1 });
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching lessons' });
  }
});

// Generate lesson content
router.post('/generate', async (req, res) => {
  try {
    const { topic, lesson } = req.body;

    if (!topic || !lesson) {
      return res.status(400).json({ 
        message: 'Topic and lesson details are required' 
      });
    }

    console.log('Received lesson generation request:', { topic });
    const content = await generateLessonContent(topic, lesson);
    
    if (!content) {
      return res.status(500).json({ 
        message: 'Failed to generate lesson content' 
      });
    }

    res.json(content);
  } catch (err) {
    console.error('Lesson generation error:', err.message);
    res.status(500).json({ 
      message: err.message || 'Error generating lesson content',
      error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

// Create a new lesson
router.post('/', async (req, res) => {
  try {
    const {
      title,
      topic,
      prerequisites,
      difficulty,
      estimatedTime,
      content,
      moduleId
    } = req.body;

    // Verify module exists
    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    const lesson = new Lesson({
      title,
      topic,
      prerequisites,
      difficulty,
      estimatedTime,
      content,
      module: moduleId
    });

    await lesson.save();

    // Add lesson to module
    module.lessons.push(lesson._id);
    await module.save();

    res.status(201).json(lesson);
  } catch (err) {
    res.status(500).json({ message: 'Error creating lesson' });
  }
});

// Update a lesson
router.put('/:id', async (req, res) => {
  try {
    const {
      title,
      topic,
      prerequisites,
      difficulty,
      estimatedTime,
      content
    } = req.body;

    const lesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      {
        title,
        topic,
        prerequisites,
        difficulty,
        estimatedTime,
        content
      },
      { new: true }
    );

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    res.json(lesson);
  } catch (err) {
    res.status(500).json({ message: 'Error updating lesson' });
  }
});

// Delete a lesson
router.delete('/:id', async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndDelete(req.params.id);

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // Remove lesson from module
    await Module.updateOne(
      { _id: lesson.module },
      { $pull: { lessons: lesson._id } }
    );

    res.json({ message: 'Lesson deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting lesson' });
  }
});

module.exports = router; 