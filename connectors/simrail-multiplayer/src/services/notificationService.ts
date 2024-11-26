import axios from "axios";

export const notifyExternalApi = async (
    action: "start" | "stop",
    internalUserId: string
): Promise<void> => {
    try {
        await axios.post("https://external-api.example.com/notify", {
            action,
            userId: internalUserId,
        });
        console.log(`Notification sent: ${action} for user ${internalUserId}`);
    } catch (error) {
        console.error("Error notifying external API:", error);
    }
};
