require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const planRoutes = require('./routes/planRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api', planRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'AI Study Plan Generator API is running 🚀' });
});

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Atlas connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
