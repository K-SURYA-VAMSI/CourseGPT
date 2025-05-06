require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const moduleRoutes = require('./routes/modules');
const lessonRoutes = require('./routes/lessons');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/coursegpt')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/modules', moduleRoutes);
app.use('/api/lessons', lessonRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 