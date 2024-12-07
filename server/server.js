const express = require('express');
const app = express();
require('dotenv').config();
const connectDB = require('./db'); // Importování připojení k databázi
const validateData = require('./middleware/validateData');
const Data = require('./model/dataModel'); // Importování modelu pro uložení dat
const { calculateVPD, calculateLeafVPD, calculateRHForLeafVPD, calculateRHForVPD } = require('./controllers/VPDFunctions'); // Importování funkcí

// Middleware pro zpracování JSON požadavků
app.use(express.json());

// Připojení k MongoDB
connectDB();

// Endpoint pro příjem dat
app.post('/data', validateData, (req, res) => {
  const { sensor_id, temperature, humidity, target_vpd, co2, ec, ph, do_value, adc_readings, relays, errors } = req.body;
  if (temperature && humidity && target_vpd) {
    const current_air_VPD = calculateVPD(temperature, humidity);
    const current_leaf_VPD = calculateLeafVPD(temperature, temperature - 2, humidity);
    const rh_for_leaf_VPD_Optimum = calculateRHForLeafVPD(temperature, target_vpd, temperature - 2);
    const rh_for_leaf_VPD_min = calculateRHForLeafVPD(temperature, target_vpd + 0.2, temperature - 2);
    const rh_for_leaf_VPD_max = calculateRHForLeafVPD(temperature, target_vpd - 0.2, temperature - 2);

    const newData = new Data({
      sensor_id,
      temperature,
      humidity,
      co2,
      ec,
      ph,
      do: do_value,
      vpd: { current_air_VPD: current_air_VPD, current_leaf_VPD: current_leaf_VPD, rh_for_leaf_VPD_Optimum: rh_for_leaf_VPD_Optimum, rh_for_leaf_VPD_min: rh_for_leaf_VPD_min, rh_for_leaf_VPD_max: rh_for_leaf_VPD_max },
      target_vpd,
      adc_readings,
      relays,
      sensor_errors: errors,
    });
    // Uložení dat do databáze
    newData
      .save()
      .then(() => {
        console.log('Data saved:', newData);
        res.status(200).send('Data received and valid!');
      })
      .catch((err) => {
        console.error('Error saving data:', err);
        res.status(500).send('Failed to save data');
      });
  } else {
    res.status(400).send('Missing required fields');
  }
});
app.get('/config', (req, res) => {
  const config = {
    dht_pin: 4,
    config_update_time: 600,
    relay_pins: [10, 17, 27, 22],
    adc_threshold: 10,
    // last_temperature: 25,
    // last_humidity: 50,
    temp_hum_err: false,
    ec_err: false,
    ph_err: false,
    do_err: false,
    one_point_calibration: true,
    cal1_v: 195,
    cal1_t: 25,
    do_table: [14460, 14220, 13820, 13440, 13090, 12740, 12420, 12110, 11810, 11530, 11260, 11010, 10770, 10530, 10300, 10080, 9860, 9660, 9460, 9270, 9080, 8900, 8730, 8570, 8410, 8250, 8110, 7960, 7820, 7690, 7560, 7430, 7300, 7180, 7070, 6950, 6840, 6730, 6630, 6530, 6410],
    max_humidity: 90,
    max_humidity_gap: 10,
    max_temperature: 30,
    max_temperature_gap: 10,
    min_temperature: 15,
    min_temperature_gap: 10,
    min_co: 600,
    min_co_gap: 200,
    target_vpd: 1.2,
    co2_min: 600,
    co2_max: 800,
    temp_min: 15,
    temp_max: 30,
    humidity_min: 50,
    humidity_max: 90,
  };
  res.json(config);
});
// Spuštění serveru
app.listen(process.env.PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${process.env.PORT}`);
});