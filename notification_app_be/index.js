const express = require('express');
const { Log } = require('logging_middleware');

const app = express();
app.use(express.json());

Log('backend', 'info', 'middleware', 'notification_app_be starting up');

app.get('/health', (req, res) => {
  Log('backend', 'debug', 'route', 'health check called');
  res.json({ status: 'ok' });
});

app.listen(3000, () => {
  console.log('notification_app_be running on port 3000');
});
