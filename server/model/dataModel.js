const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  sensor_id: String,
  timestamp: { type: Date, default: Date.now },
  temperature: Number,
  humidity: Number,
  vpd: {
    current_air_VPD: { type: Number, default: null },
    current_leaf_VPD: { type: Number, default: null },
    rh_for_leaf_VPD_Optimum: { type: Number, default: null },
    rh_for_leaf_VPD_min: { type: Number, default: null },
    rh_for_leaf_VPD_max: { type: Number, default: null },
  },
  target_vpd: Number,
  co2: { type: Number, default: null },
  ec: { type: Number, default: null },
  ph: { type: Number, default: null },
  do: { type: Number, default: null },
  adc_readings: {
    adc0_EC: { type: Number, default: null },
    adc1_Ph: { type: Number, default: null },
    adc2_DO: { type: Number, default: null },
  },
  relays: {
    relay1_hum_minus: { type: Boolean, default: false },
    relay2_temp_minus: { type: Boolean, default: false },
    relay3_temp_plus: { type: Boolean, default: false },
    relay4_co2_plus: { type: Boolean, default: false },
  },
  sensor_errors: {
    temp_hum_err: { type: Boolean, default: false },
    EC_error: { type: Boolean, default: false },
    Ph_error: { type: Boolean, default: false },
    DO_error: { type: Boolean, default: false },
  },
});

const Data = mongoose.model('Data', dataSchema, 'sensor_data');

module.exports = Data;
