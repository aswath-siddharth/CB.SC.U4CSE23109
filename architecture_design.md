# Architecture Overview

A simple overview of how the apps in this repo work together.

## How it works

- **Vehicle Scheduler (`/vehicle_maintence_scheduler`)**: A simple Express app. When you hit `/schedule`, it fetches depot and vehicle data from the evaluation server, runs a 0/1 Knapsack algorithm to maximize impact within the allowed hours, and returns the schedule. No database is used.
- **Notification App (`/notification_app_be`)**: Another Express app. When you hit `/notifications/priority`, it fetches all notifications from the evaluation server, sorts them locally based on priority (Placement > Result > Event) and time, and returns the top ones.
- **Logging Middleware (`/logging_middleware`)**: Since we aren't allowed to use `console.log`, this custom module handles all logging. Both apps import this and use it to send logs directly to the evaluation server's `/logs` endpoint.

## Auth
There are no login routes. The apps use a `.env` file containing the `ACCESS_TOKEN` to authenticate outgoing requests to the evaluation server.


