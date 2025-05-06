const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  topic: {
    type: String,
    required: true
  },
  prerequisites: {
    type: String,
    default: ''
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Easy'
  },
  estimatedTime: {
    type: String,
    default: ''
  },
  content: {
    title: String,
    description: String,
    outcomes: String,
    concepts: String,
    activities: String
  },
  module: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

lessonSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Lesson', lessonSchema); 