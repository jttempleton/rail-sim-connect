import dotenv from "dotenv";
import { z } from "zod";

// Load .env file
dotenv.config();

// Define the schema for expected environment variables
const ConfigSchema = z.object({
    PORT: z.string().default("3000").transform(Number),
    RABBITMQ_URL: z.string().url(),
    RABBITMQ_QUEUE: z.string(),
    SIMRAIL_API_URL: z.string().url(),
    DISPATCHER_URL: z.string().url(),
    POLL_INTERVAL: z.string().default("3000").transform(Number), // Default to 3 seconds (3000 ms)
    CLEANUP_INTERVAL: z.string().default("60000").transform(Number), // Default to 1 minute (6,000 ms)
    INACTIVITY_THRESHOLD: z.string().default("600000").transform(Number), // Default to 10 minutes (600,000 ms)
});

// Parse and validate environment variables
const config = ConfigSchema.safeParse(process.env);

if (!config.success) {
    console.error("Invalid configuration:", config.error.format());
    process.exit(1); // Terminate the application if validation fails
}

// Export the validated environment variables
export default config.data;
