import axios from "axios";
import { TrainsApiResponse } from "../types/TrainsResponse";

export const pollApi = async (
    apiUrl: string
): Promise<TrainsApiResponse | null> => {
    try {
        const response = await axios.get(apiUrl);
        const data: TrainsApiResponse = response.data;

        return data;
    } catch (error) {
        console.error("Error polling API:", error);
        return null;
    }
};
