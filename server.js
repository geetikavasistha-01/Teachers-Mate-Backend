require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/departments', require('./routes/departmentRoutes'))
app.use('/api/courses', require('./routes/courseRoutes'))
app.use('/api/students', require('./routes/studentRoutes'))
app.use('/api/attendance', require('./routes/attendanceRoutes'))

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'SAMS+ Backend Server is running' });
});

// Start server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
