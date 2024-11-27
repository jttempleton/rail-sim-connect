type TrainData = {
    ControlledBySteamID: string | null;
    InBorderStationArea: boolean;
    Latititute: number;
    Longitute: number;
    Velocity: number;
    SignalInFront: string;
    DistanceToSignalInFront: number;
    SignalInFrontSpeed: number;
    VDDelayedTimetableIndex: number;
};

type TrainInfo = {
    TrainNoLocal: string;
    TrainName: string;
    StartStation: string;
    EndStation: string;
    Vehicles: string[];
    ServerCode: string;
    TrainData: TrainData;
    id: string;
    Type: string;
};

type TrainsApiResponse = {
    result: boolean;
    data: TrainInfo[];
    count: number;
    description: string;
};

export { TrainsApiResponse, TrainData, TrainInfo };
