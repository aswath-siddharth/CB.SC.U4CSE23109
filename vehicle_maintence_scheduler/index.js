const express = require('express');
const { Log } = require('logging_middleware');

const app = express();
app.use(express.json());

Log('backend', 'info', 'middleware', 'vehicle_maintence_scheduler starting up');

app.get('/health', (req, res) => {
  Log('backend', 'debug', 'route', 'health check called');
  res.json({ status: 'ok' });
});

app.listen(3001, () => {
  console.log('vehicle_maintence_scheduler running on port 3001');
});
