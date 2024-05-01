const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/backstageDB', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

// MongoDB Schema
const backstageSchema = new mongoose.Schema({
  name: String,
  description: String,
});

const BackstageModel = mongoose.model('Backstage', backstageSchema);

// Routes
app.get('/api/backstage', async (req, res) => {
  try {
    const data = await BackstageModel.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/backstage', async (req, res) => {
  const backstageData = req.body;
  const newBackstageData = new BackstageModel(backstageData);

  try {
    const savedData = await newBackstageData.save();
    res.status(201).json(savedData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Start Server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
