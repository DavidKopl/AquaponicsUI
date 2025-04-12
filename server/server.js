const express = require('express');
const app = express();
require('dotenv').config();
const connectDB = require('./db'); // Importování připojení k databázi
const cors = require('cors');
const validateData = require('./middleware/validateData');
const authenticateDevice = require('./middleware/auth');
const Data = require('./model/dataModel'); // Importování modelu pro uložení dat
const Config = require('./model/configModel'); // Importování modelu pro uložení dat
const { calculateVPD, calculateLeafVPD, calculateRHForLeafVPD, calculateRHForVPD } = require('./controllers/VPDFunctions'); // Importování funkcí

// Middleware pro zpracování JSON požadavků
app.use(express.json());
app.use(cors());
// Připojení k MongoDB
connectDB();

const aggregateData = (data, interval) => {
  let aggregatedData = [];
  let currentInterval = Math.floor(data[0].timestamp / interval); // Zaokrouhlení na interval
  let tempSum = 0;
  let humiditySum = 0;
  let co2Sum = 0;
  let ecSum = 0;
  let phSum = 0;
  let doSum = 0;
  let count = 0;

  data.forEach((item) => {
    const intervalKey = Math.floor(item.timestamp / interval);

    if (intervalKey === currentInterval) {
      // Sčítáme hodnoty pro tento interval
      tempSum += item.temperature;
      humiditySum += item.humidity;
      co2Sum += item.co2;
      ecSum += item.ec;
      phSum += item.ph;
      doSum += item.do;
      count++;
    } else {
      // Přidáme průměr pro předchozí interval
      aggregatedData.push({
        timestamp: currentInterval * interval,
        temperature: count ? parseFloat((tempSum / count).toFixed(2)) : null,
        humidity: count ? parseFloat((humiditySum / count).toFixed(2)) : null,
        co2: count ? parseFloat((co2Sum / count).toFixed(0)) : null,
        ec: count ? parseFloat((ecSum / count).toFixed(2)) : null,
        ph: count ? parseFloat((phSum / count).toFixed(2)) : null,
        do: count ? parseFloat((doSum / count).toFixed(2)) : null,
      });
      // Přepneme na nový interval
      currentInterval = intervalKey;
      tempSum = item.temperature;
      humiditySum = item.humidity;
      co2Sum = item.co2;
      ecSum = item.ec;
      phSum = item.ph;
      doSum = item.do;
      count = 1;
    }
  });

  // Přidáme poslední interval
  if (count > 0) {
    aggregatedData.push({
      timestamp: currentInterval * interval,
      temperature: count ? parseFloat((tempSum / count).toFixed(2)) : null,
      humidity: count ? parseFloat((humiditySum / count).toFixed(2)) : null,
      co2: count ? parseFloat((co2Sum / count).toFixed(0)) : null,
      ec: count ? parseFloat((ecSum / count).toFixed(2)) : null,
      ph: count ? parseFloat((phSum / count).toFixed(2)) : null,
      do: count ? parseFloat((doSum / count).toFixed(2)) : null,
    });
  }

  return aggregatedData;
};

// Endpoint pro příjem/posílání dat do MongoDb
app.post('/data', authenticateDevice, validateData, (req, res) => {
  const { sensor_id, temperature, humidity, target_vpd, co2, ec, ph, do_value, adc_readings, relays, errors } = req.body;
  if (temperature && humidity && target_vpd) {
    const current_air_VPD = calculateVPD(temperature, humidity);
    const current_leaf_VPD = calculateLeafVPD(temperature, temperature - 2, humidity);
    const rh_for_leaf_VPD_Optimum = calculateRHForLeafVPD(temperature, target_vpd, temperature - 2);
    const rh_for_leaf_VPD_min = calculateRHForLeafVPD(temperature, target_vpd + 0.2, temperature - 2);
    const rh_for_leaf_VPD_max = calculateRHForLeafVPD(temperature, target_vpd - 0.2, temperature - 2);
    //TODO:Omezit cas jak casto posilam data do Monga
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
// app.get('/api/data', async (req, res) => {
//   try {
//     const data = await Data.find()
//       .sort({ timestamp: -1 }) // seřadí podle timestampu od nejnovějšího
//       .limit(1000); // omezení na 100 záznamů
//     res.json(data);
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     res.status(500).send('Error fetching data');
//   }
// });

app.get('/data/sensor_data', async (req, res) => {
  try {
    const rawData = await Data.find(); // Načteme všechna data z databáze
    const granularity = req.query.granularity || '10min'; // Default: minute
    let interval;

    switch (granularity) {
      case '10min':
        interval = 10 * 60 * 1000; // 10 minut
        break;
      case 'hour':
        interval = 60 * 60 * 1000; // 1 hodina
        break;
      case 'day':
        interval = 24 * 60 * 60 * 1000; // 1 den
        break;
      case 'week':
        interval = 7 * 24 * 60 * 60 * 1000; // 1 týden
        break;
      case 'month':
        interval = 30 * 24 * 60 * 60 * 1000; // 1 měsíc (přibližně 30 dní)
        break;
      case 'quarter':
        interval = 3 * 30 * 24 * 60 * 60 * 1000; // 1 čtvrtletí (přibližně 90 dní)
        break;
      default:
        interval = 10 * 60 * 1000; // Default: 10 minut
        break;
    }

    // Agregace dat za definovaný interval
    const aggregatedData = aggregateData(rawData, interval);

    // Přidáme VPD informace do každého záznamu
    const responseData = aggregatedData.map((item) => {
      // Získáme VPD hodnoty z uložených dat
      const { temperature, humidity, target_vpd, do_value } = item;
      const current_air_VPD = calculateVPD(temperature, humidity);
      const current_leaf_VPD = calculateLeafVPD(temperature, temperature - 2, humidity);
      const rh_for_leaf_VPD_Optimum = calculateRHForLeafVPD(temperature, target_vpd, temperature - 2);
      const rh_for_leaf_VPD_min = calculateRHForLeafVPD(temperature, target_vpd + 0.2, temperature - 2);
      const rh_for_leaf_VPD_max = calculateRHForLeafVPD(temperature, target_vpd - 0.2, temperature - 2);

      // Přidáme VPD hodnoty do každého záznamu
      return {
        ...item,
        vpd: {
          current_air_VPD,
          current_leaf_VPD,
          rh_for_leaf_VPD_Optimum,
          rh_for_leaf_VPD_min,
          rh_for_leaf_VPD_max,
        },
      };
    });

    // Vrátíme zpracovaná data s VPD
    res.json(responseData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
let config = {
  wifi_ssid: 'STARNET-NOVAKOVA',
  wifi_password: 'kubicek123',
  dht_pin: 4,
  config_update_time: 10,
  relay_pins: [10, 17, 27, 22],
  adc_threshold: 10,
  temp_hum_err: false,
  ec_err: false,
  ph_err: false,
  do_err: false,
  one_point_calibration: true,
  cal1_v: 195,
  cal1_t: 25,
  ecCalibration: false,
  phCalibration: false,
  doCalibration: false,
  ec_active: false,
  ph_active: false,
  do_active: false,
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
  timesleep: 180,
};
app.get('/config', (req, res) => {
  // TODO: brat data (ne staticky odtud ale )z DTB a posilat je do Pythonu
  res.json(config);
  res.status(200).json({ message: 'Ok' });
});

// Endpoint pro získání posledních dat
app.get('/data/latest-data', async (req, res) => {
  try {
    // Získání posledního záznamu z databáze
    const latestData = await Data.findOne().sort({ timestamp: -1 }).exec();

    if (!latestData) {
      return res.status(404).json({ message: 'No data found' });
    }
    // Vrácení posledního záznamu
    res.json(latestData);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(400).json({ message: 'Internal server error' });
  }
});

app.post('/update-calibration', (req, res) => {
  const { ecCalibration, phCalibration, doCalibration } = req.body;

  try {
    // Aktualizace kalibrace na základě vstupních dat
    if (ecCalibration !== undefined) config.ecCalibration = ecCalibration;
    if (phCalibration !== undefined) config.phCalibration = phCalibration;
    if (doCalibration !== undefined) config.doCalibration = doCalibration;

    // Odpověď pro úspěšné provedení
    res.status(200).json({ message: 'Calibration updated successfully' });
  } catch (err) {
    console.error('Error updating calibration:', err);
    res.status(500).json({ message: 'Failed to update calibration' });
  }
});

// Spuštění serveru
app.listen(process.env.PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${process.env.PORT}`);
});
