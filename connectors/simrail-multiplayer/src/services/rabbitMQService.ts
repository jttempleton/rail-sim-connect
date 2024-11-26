import amqplib, { Connection, Channel } from "amqplib";

let channel: Channel | null = null;

export const setupRabbitMQ = async (queueName: string, url: string): Promise<void> => {
    try {
        const connection: Connection = await amqplib.connect(url);
        channel = await connection.createChannel();
        await channel.assertQueue(queueName, { durable: false });
        console.log("RabbitMQ connected");
    } catch (error) {
        console.error("Error setting up RabbitMQ:", error);
        throw error;
    }
};

export const sendToQueue = (queueName: string, message: object): void => {
    if (!channel) {
        throw new Error("RabbitMQ channel is not initialized.");
    }
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
};
