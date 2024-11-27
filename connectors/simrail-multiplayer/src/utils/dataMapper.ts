import LocationMessage from "../types/LocationMessage";
import { TrainInfo } from "../types/TrainsResponse";

const dataMapper = (userId: string, data: TrainInfo): LocationMessage => {
    return {
        userId,
        latitude: data.TrainData.Latititute,
        longitude: data.TrainData.Longitute,
        speed: data.TrainData.Velocity,
    };
};

export default dataMapper;