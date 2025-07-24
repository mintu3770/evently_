const express = require('express');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/:eventId', auth, async (req, res) => {
  try {
    const existingRegistration = await Registration.findOne({
      user: req.user.id,
      event: req.params.eventId
    });

    if (existingRegistration) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    const registration = new Registration({
      user: req.user.id,
      event: req.params.eventId
    });

    await registration.save();
    res.status(201).json({ message: 'Successfully registered for event' });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed' });
  }
});

router.delete('/:eventId', auth, async (req, res) => {
  try {
    await Registration.findOneAndDelete({
      user: req.user.id,
      event: req.params.eventId
    });
    res.json({ message: 'Successfully unregistered from event' });
  } catch (error) {
    res.status(500).json({ message: 'Unregistration failed' });
  }
});

router.get('/user', auth, async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user.id })
      .populate('event')
      .sort({ createdAt: -1 });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch registrations' });
  }
});

module.exports = router;