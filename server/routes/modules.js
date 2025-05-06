const express = require('express');
const router = express.Router();
const Module = require('../models/Module');

// Get all modules
router.get('/', async (req, res) => {
  try {
    const modules = await Module.find()
      .populate('lessons')
      .sort({ createdAt: -1 });
    res.json(modules);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching modules' });
  }
});

// Create a new module
router.post('/', async (req, res) => {
  try {
    const { title, description } = req.body;
    const module = new Module({
      title,
      description
    });
    await module.save();
    res.status(201).json(module);
  } catch (err) {
    res.status(500).json({ message: 'Error creating module' });
  }
});

// Update a module
router.put('/:id', async (req, res) => {
  try {
    const { title, description, lessons } = req.body;
    // Only update fields that are provided
    const updateFields = {};
    if (title !== undefined) updateFields.title = title;
    if (description !== undefined) updateFields.description = description;
    if (lessons !== undefined) updateFields.lessons = lessons;

    const module = await Module.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    ).populate('lessons');
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }
    res.json(module);
  } catch (err) {
    res.status(500).json({ message: 'Error updating module' });
  }
});

// Delete a module
router.delete('/:id', async (req, res) => {
  try {
    const module = await Module.findByIdAndDelete(req.params.id);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }
    res.json({ message: 'Module deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting module' });
  }
});

module.exports = router; 