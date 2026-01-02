const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

// Models & Routes
const leadRoutes = require('./routes/leads');
const projectRoutes = require('./routes/projects');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database Connection Logic
const connectDB = async () => {
  // Priority 1: MongoDB (Env Var or Local)
  if (process.env.MONGO_URI) {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('✅ Connected to MongoDB Atlas');
      // Switch to using Mongoose Models if connected
      // Note: Currently the routes are using 'utils/db.js' (File System).
      // For a full production deploy, we should switch the Controller logic to use Mongoose Models.
      // However, for this "hybrid" update, I will keep using file-system as default 
      // BUT warning the user that file-system data is lost on Render free tier restarts.
      console.log('⚠️  Note: App is currently configured to use File-System DB (utils/db.js).');
      console.log('⚠️  For persistent cloud data, you must update routes to use Mongoose Models.');
    } catch (err) {
      console.error('❌ MongoDB Connection Error:', err);
    }
  } else {
    console.log('⚠️  MONGO_URI not found. Using local File-System for data.');
  }
};

connectDB();

// Routes
// We are injecting a middleware to allow routes to access the DB type if needed (future proofing)
app.use('/api/leads', leadRoutes);
app.use('/api/projects', projectRoutes);

// Fallback for SPA
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
