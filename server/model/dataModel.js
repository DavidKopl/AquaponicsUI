const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  sensor_id: String,
  temperature: Number,
  humidity: Number,
  timestamp: { type: Date, default: Date.now },
});

const Data = mongoose.model('Data', dataSchema);

module.exports = Data;
