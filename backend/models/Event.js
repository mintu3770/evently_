const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String },
  category: { type: String },
  price: { type: Number, default: 0 },
  capacity: { type: Number, default: 0 },
  tags: { type: [String] },
  imageUrl: { type: String },
  requireApproval: { type: Boolean, default: false },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);