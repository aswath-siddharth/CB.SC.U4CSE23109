require('dotenv').config({ path: '../.env' });
const express = require('express');
const axios = require('axios');
const { Log } = require('logging_middleware');

const app = express();
app.use(express.json());

const BASE = 'http://20.207.122.201/evaluation-service';
const headers = () => ({ Authorization: `Bearer ${process.env.ACCESS_TOKEN}` });

// 0/1 Knapsack 
function knapsack(tasks, capacity) {
  const n = tasks.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    const { Duration, Impact } = tasks[i - 1];
    for (let w = 0; w <= capacity; w++) {
      dp[i][w] = dp[i - 1][w];
      if (Duration <= w) {
        dp[i][w] = Math.max(dp[i][w], dp[i - 1][w - Duration] + Impact);
      }
    }
  }

  const selected = [];
  let w = capacity;
  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      selected.push(tasks[i - 1].TaskID);
      w -= tasks[i - 1].Duration;
    }
  }

  return { selected, totalImpact: dp[n][capacity], hoursUsed: capacity - w };
}

app.get('/schedule', async (req, res) => {
  Log('backend', 'info', 'route', 'GET /schedule - fetching depots and tasks');

  try {
    const [depotsRes, vehiclesRes] = await Promise.all([
      axios.get(`${BASE}/depots`, { headers: headers() }),
      axios.get(`${BASE}/vehicles`, { headers: headers() }),
    ]);

    const depots = depotsRes.data.depots;
    const tasks = vehiclesRes.data.vehicles;

    Log('backend', 'info', 'service', `Fetched ${depots.length} depots and ${tasks.length} tasks`);

    const schedule = depots.map(depot => {
      const result = knapsack(tasks, depot.MechanicHours);
      Log('backend', 'debug', 'domain', `Depot ${depot.ID}: scheduled ${result.selected.length} tasks, impact=${result.totalImpact}, hours=${result.hoursUsed}/${depot.MechanicHours}`);
      return {
        depotID: depot.ID,
        mechanicHours: depot.MechanicHours,
        hoursUsed: result.hoursUsed,
        totalImpact: result.totalImpact,
        scheduledTasks: result.selected,
      };
    });

    Log('backend', 'info', 'route', 'Schedule computed successfully');
    res.json({ schedule });
  } catch (err) {
    Log('backend', 'error', 'handler', `Failed to compute schedule: ${err.message}`);
    res.status(500).json({ error: 'Failed to compute schedule' });
  }
});

app.listen(3001, () => {
  Log('backend', 'info', 'handler', 'vehicle_maintence_scheduler running on port 3001');
});
