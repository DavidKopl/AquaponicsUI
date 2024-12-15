const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
  sensor_id: { type: String, required: true },
  dht_pin: { type: Number, default: 4 },
  config_update_time: { type: Number, default: 600 },
  relay_pins: { type: [Number], default: [10, 17, 27, 22] },
  adc_threshold: { type: Number, default: 10 },
  temp_hum_err: { type: Boolean, default: false },
  ec_err: { type: Boolean, default: false },
  ph_err: { type: Boolean, default: false },
  do_err: { type: Boolean, default: false },
  one_point_calibration: { type: Boolean, default: true },
  cal1_v: { type: Number, default: 195 },
  cal1_t: { type: Number, default: 25 },
  do_table: {
    type: [Number],
    default: [14460, 14220, 13820, 13440, 13090, 12740, 12420, 12110, 11810, 11530, 11260, 11010, 10770, 10530, 10300, 10080, 9860, 9660, 9460, 9270, 9080, 8900, 8730, 8570, 8410, 8250, 8110, 7960, 7820, 7690, 7560, 7430, 7300, 7180, 7070, 6950, 6840, 6730, 6630, 6530, 6410],
  },
  max_humidity: { type: Number, default: 90 },
  max_humidity_gap: { type: Number, default: 10 },
  max_temperature: { type: Number, default: 30 },
  max_temperature_gap: { type: Number, default: 10 },
  min_temperature: { type: Number, default: 15 },
  min_temperature_gap: { type: Number, default: 10 },
  min_co: { type: Number, default: 600 },
  min_co_gap: { type: Number, default: 200 },
  target_vpd: { type: Number, default: 1.2 },
  co2_min: { type: Number, default: 600 },
  co2_max: { type: Number, default: 800 },
  temp_min: { type: Number, default: 15 },
  temp_max: { type: Number, default: 30 },
  humidity_min: { type: Number, default: 50 },
  humidity_max: { type: Number, default: 90 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Config', configSchema, 'config');
