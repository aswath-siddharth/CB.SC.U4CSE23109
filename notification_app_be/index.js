require('dotenv').config({ path: '../.env' });
const express = require('express');
const axios = require('axios');
const { Log } = require('logging_middleware');

const app = express();
app.use(express.json());

const NOTIF_API = 'http://20.207.122.201/evaluation-service/notifications';
const headers = () => ({ Authorization: `Bearer ${process.env.ACCESS_TOKEN}` });


const PRIORITY = { Placement: 3, Result: 2, Event: 1 };

Log('backend', 'info', 'middleware', 'notification_app_be starting up');


app.get('/notifications/priority', async (req, res) => {
  const n = parseInt(req.query.n) || 10;
  Log('backend', 'info', 'route', `GET /notifications/priority called with n=${n}`);

  try {
    const response = await axios.get(NOTIF_API, { headers: headers() });
    const notifications = response.data.notifications;

    Log('backend', 'debug', 'service', `Fetched ${notifications.length} notifications from API`);

    // Sort by priority desc, then by recency desc
    const sorted = notifications.sort((a, b) => {
      const pd = (PRIORITY[b.Type] || 0) - (PRIORITY[a.Type] || 0);
      if (pd !== 0) return pd;
      return new Date(b.Timestamp) - new Date(a.Timestamp);
    });

    const top = sorted.slice(0, n);
    Log('backend', 'info', 'route', `Returning top ${top.length} priority notifications`);
    res.json({ top });
  } catch (err) {
    Log('backend', 'error', 'handler', `Failed to fetch notifications: ${err.message}`);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

app.listen(3000, () => {
  Log('backend', 'info', 'handler', 'notification_app_be running on port 3000');
});
