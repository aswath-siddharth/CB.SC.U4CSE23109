require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const axios = require('axios');

const LOG_URL = 'http://20.207.122.201/evaluation-service/logs';

const VALID_STACKS = ['backend', 'frontend'];
const VALID_LEVELS = ['debug', 'info', 'warn', 'error', 'fatal'];
const VALID_PACKAGES = [
  'cache', 'controller', 'cron_job', 'db', 'domain',
  'handler', 'repository', 'route', 'service',
  'api', 'component', 'hook', 'page', 'state', 'style',
  'auth', 'config', 'middleware', 'utils'
];

async function Log(stack, level, pkg, message) {
  if (!VALID_STACKS.includes(stack)) {
    return;
  }
  if (!VALID_LEVELS.includes(level)) {
    return;
  }
  if (!VALID_PACKAGES.includes(pkg)) {
    return;
  }

  try {
    await axios.post(
      LOG_URL,
      { stack, level, package: pkg, message },
      { headers: { Authorization: `Bearer ${process.env.ACCESS_TOKEN}` } }
    );
  } catch (err) {
    
  }
}

module.exports = { Log };
