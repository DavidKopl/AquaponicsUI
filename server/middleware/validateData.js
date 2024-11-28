module.exports = (req, res, next) => {
  const { sensor_id, temperature, humidity } = req.body;

  if (!sensor_id || typeof sensor_id !== 'string') {
    return res.status(400).send("Invalid 'sensor_id'");
  }
  if (typeof temperature !== 'number' || temperature < -50 || temperature > 100) {
    return res.status(400).send("Invalid 'temperature'");
  }
  if (typeof humidity !== 'number' || humidity < 0 || humidity > 100) {
    return res.status(400).send("Invalid 'humidity'");
  }

  next(); // Validace úspěšná, pokračuje k dalšímu middleware nebo endpointu
};
