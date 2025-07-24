const express = require('express');
const multer = require('multer');
const path = require('path');
const Event = require('../models/Event');
const auth = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

router.get('/', async (req, res) => {
  try {
    const events = await Event.find({}).populate('organizer', 'username').sort({ createdAt: -1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch events' });
  }
});

router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, description, date, time, location, category, price, capacity, tags, requireApproval } = req.body;
    
    const newEvent = new Event({
      title, description, date, time, location, category, price, capacity,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      requireApproval,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : '',
      organizer: req.user.id,
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create event' });
  }
});

module.exports = router;