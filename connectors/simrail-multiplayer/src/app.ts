import express from "express";
import { AccountMap } from "./models/accountMap";
import { pollApi } from "./services/apiService";
import { setupRabbitMQ } from "./services/rabbitMQService";
import { notifyExternalApi } from "./services/notificationService";
import idRoutes from "./routes/idRoutes";
import config from "./config";

const app = express();
const accountMap = new AccountMap();

// Middleware
app.use(express.json());

app.use(idRoutes);

// Polling Logic
setInterval(async () => {
    await pollApi(config.SIMRAIL_API_URL, accountMap);
}, config.POLL_INTERVAL);

// Cleanup Logic
setInterval(() => {
    const now = Date.now();
    accountMap.getAllAccountIds().forEach((accountId) => {
        const lastSeen = accountMap.getLastSeen(accountId);
        if (lastSeen && now - lastSeen > config.INACTIVITY_THRESHOLD) {
            const internalUserId = accountMap.getInternalUserId(accountId);
            accountMap.removeAccount(accountId);
            if (internalUserId) notifyExternalApi("stop", internalUserId);
        }
    });
}, config.CLEANUP_INTERVAL);

// RabbitMQ Setup
setupRabbitMQ(config.RABBITMQ_QUEUE, config.RABBITMQ_URL);

// Start Server
app.listen(config.PORT, () => {
    console.log(`Server is running on http://localhost:${config.PORT}`);
});
