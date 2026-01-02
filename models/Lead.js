const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String, required: true },
  project: { type: String, required: true }, // The project they are interested in
  source: { type: String, default: 'Web Form' }, // Where the lead came from
  status: { 
    type: String, 
    enum: ['New', 'Contacted', 'Interested', 'Site Visit', 'Negotiation', 'Booked', 'Lost'], 
    default: 'New' 
  },
  assignedTo: { type: String, default: 'Unassigned' }, // Employee Name
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lead', LeadSchema);
