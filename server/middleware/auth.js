// middleware/auth.js
require('dotenv').config();

const authenticateDevice = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey || apiKey !== process.env.DEVICE_API_KEY) {
    return res.status(403).json({ message: 'Forbidden: Invalid API key' });
  }

  next();
};

module.exports = authenticateDevice;
