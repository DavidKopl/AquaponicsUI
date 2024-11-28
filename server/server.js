const express = require('express');
const app = express();
const port = 3000;

// Middleware pro zpracování JSON požadavků
app.use(express.json());

// Endpoint pro příjem dat
app.post('/data', (req, res) => {
  console.log('Received data:', req.body);
  res.status(200).send('Data received');
});

// Spuštění serveru
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});
