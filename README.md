# rail-sim-connect

## connectors / simrail-multiplayer
This is a **node.js** application which reads location data from the official SimRail API and forwards it to RabbitMQ.

It creates the necessary RabbitMQ queues if they don't already exist.
- `database_queue` to store all location messages, ultimately to be consumed by a database writing service
- `user_####_queue` dynamically created any time a new user is added to monitoring - holds exact copies of the messages, but only for that individual user - ultimately to be consumed by a service that streams it over a websocket to a web frontend.

It also creates necessary RabbitMQ exchanges if they don't already exist.
- `direct_exchange` receives messages from the `fanout_exchange` and directs them to the relevant `user_####_queue` based on the user ID
- `fanout_exchange` receives all messages from this connector and routes them to both the `database_queue` and the `direct_exchange`

It runs on port `3000` and has two API endpoints to add/remove users from monitoring
- `/add-account`
- `/remove-account`

When one or more users are being monitored, the app GETs the SimRail Trains API, searches for the user's Steam ID attached to any train, and sends a message to RabbitMQ with basic information about the current location of that train.
- latitude
- longitude
- speed