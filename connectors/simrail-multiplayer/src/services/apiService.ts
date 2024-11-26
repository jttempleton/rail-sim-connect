import axios from "axios";
import { AccountMap } from "../models/accountMap";

export const pollApi = async (
    apiUrl: string,
    accountMap: AccountMap
): Promise<void> => {
    try {
        const response = await axios.get(apiUrl);
        const data: Array<{ accountId: string }> = response.data;

        if (!Array.isArray(data)) {
            throw new Error("API response is not an array");
        }

        const accountIds = accountMap.getAllAccountIds();
        data.forEach(({ accountId }) => {
            if (accountIds.includes(accountId)) {
                accountMap.updateLastSeen(accountId);
            }
        });
    } catch (error) {
        console.error("Error polling API:", error);
    }
};
