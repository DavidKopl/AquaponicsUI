const express = require('express');
const app = express();
const connectDB = require('./db'); // Importování připojení k databázi
const validateData = require('./middleware/validateData');
const Data = require('./model/dataModel'); // Importování modelu pro uložení dat
const { calculateVPD, calculateLeafVPD, calculateRHForLeafVPD, calculateRHForVPD } = require('./controllers/VPDFunctions'); // Importování funkcí
const port = 3000;

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
    target_vpd: 0.6,
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
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});
