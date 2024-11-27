import express from "express";
import accountMap from "./models/accountMap";
import { pollApi } from "./services/apiService";
import {
    createUserQueue,
    publishMessage,
    setupRabbitMQ,
} from "./services/rabbitMQService";
import { notifyExternalApi } from "./services/notificationService";
import idRoutes from "./routes/idRoutes";
import config from "./config";
import dataMapper from "./utils/dataMapper";

const app = express();
const recordingAccounts = new Set<string>();

// Middleware
app.use(express.json());
app.use(idRoutes);

// Polling Logic
setInterval(async () => {
    // check if the account map is empty
    const monitoredAccounts = accountMap.getAllAccountIds();
    if (monitoredAccounts.length === 0) return;

    console.log("Monitored accounts:", monitoredAccounts);

    const data = await pollApi(config.SIMRAIL_API_URL);

    if (!data) return;

    const currentAccountIds = data.data.map(
        ({ TrainData }) => TrainData.ControlledBySteamID
    ); // Extract account IDs from the API response

    // Stop recording for users that are no longer monitored
    for (const accountId of [...recordingAccounts]) {
        if (!monitoredAccounts.includes(accountId)) {
            recordingAccounts.delete(accountId); // Remove from recording set
            console.log("Stopped recording for:", accountId);
        }
    }

    data.data.forEach(async (trainInfo) => {
        const steamID = trainInfo.TrainData.ControlledBySteamID;

        if (steamID === null) return;

        if (accountMap.hasAccount(steamID)) {
            accountMap.updateLastSeen(steamID);
            const internalUserId = accountMap.getInternalUserId(steamID);

            if (internalUserId === null) return;

            if (!recordingAccounts.has(steamID)) {
                // The user isn't already recording, so add it to the list, create a queue for them, and notify the external API
                recordingAccounts.add(steamID);
                await createUserQueue(internalUserId);
                // notifyExternalApi("start", internalUserId); // Notify external API with internalUserId
            }

            publishMessage(
                internalUserId,
                JSON.stringify(dataMapper(internalUserId, trainInfo))
            );
        }
    });

    // Stop recording for users no longer appear in the API response
    for (const accountId of [...recordingAccounts]) {
        if (!currentAccountIds.includes(accountId)) {
            recordingAccounts.delete(accountId); // Remove from recording set
            // Find the internalUserId for the accountId that disappeared
            const internalUserId = accountMap.getInternalUserId(accountId);
            console.log(
                "Stopped recording for internalUserId:",
                internalUserId,
                " as it no longer appears in the API response."
            );

            if (internalUserId) {
                // notifyExternalApi("stop", internalUserId); // Notify external API with internalUserId
            }
        }
    }
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
setupRabbitMQ();

// Start Server
app.listen(config.PORT, () => {
    console.log(`Server is running on http://localhost:${config.PORT}`);
});
