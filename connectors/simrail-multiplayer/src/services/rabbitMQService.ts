import amqp from "amqplib";
import config from "../config";

const FANOUT_EXCHANGE = "fanout_exchange";
const DIRECT_EXCHANGE = "direct_exchange";

async function setupRabbitMQ() {
    const connection = await amqp.connect(config.RABBITMQ_URL);
    const channel = await connection.createChannel();

    // Declare the fanout exchange for broadcasting
    await channel.assertExchange(FANOUT_EXCHANGE, "fanout", { durable: true });

    // Declare the database queue and bind it to the fanout exchange
    const DATABASE_QUEUE = "database_queue";
    await channel.assertQueue(DATABASE_QUEUE, { durable: true });
    await channel.bindQueue(DATABASE_QUEUE, FANOUT_EXCHANGE, "");

    console.log(`Bound ${DATABASE_QUEUE} to ${FANOUT_EXCHANGE}`);

    // Declare the direct exchange for user-specific routing
    await channel.assertExchange(DIRECT_EXCHANGE, "direct", { durable: true });

    // Bind the direct exchange to the fanout exchange
    await channel.bindExchange(DIRECT_EXCHANGE, FANOUT_EXCHANGE, "");

    console.log(`Bound ${DIRECT_EXCHANGE} to ${FANOUT_EXCHANGE}`);

    return { connection, channel };
}

async function createUserQueue(userId: string) {
    const connection = await amqp.connect(config.RABBITMQ_URL);
    const channel = await connection.createChannel();

    const userQueue = `user_${userId}_queue`;

    // Declare the user-specific queue
    await channel.assertQueue(userQueue, {
        exclusive: false,
        durable: false,
        arguments: {
            "x-message-ttl": config.RABBITMQ_USER_MESSAGE_TTL, // Messages expire after 10 seconds
            "x-expires": config.RABBITMQ_USER_QUEUE_EXPIRES, // Queue expires after 10 minutes of inactivity
        },
    });

    // Bind the user-specific queue to the direct exchange with a routing key
    await channel.bindQueue(userQueue, DIRECT_EXCHANGE, userId);

    console.log(
        `Bound ${userQueue} to ${DIRECT_EXCHANGE} with routing key '${userId}'`
    );

    return { connection, channel };
}

async function publishMessage(userId: string, message: string) {
    const connection = await amqp.connect(config.RABBITMQ_URL);
    const channel = await connection.createChannel();

    try {
        // Publish to the fanout exchange
        channel.publish(FANOUT_EXCHANGE, userId, Buffer.from(message));
        console.log(`Published to fanout exchange: ${message}`);
    } catch (error) {
        console.error("Error publishing message:", error);
    } finally {
        setTimeout(() => connection.close(), 500); // Allow time for message delivery
    }
}

export { publishMessage, setupRabbitMQ, createUserQueue };
