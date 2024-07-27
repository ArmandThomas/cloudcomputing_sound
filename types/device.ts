import {TDevice} from "../models/Device";
import {TPrediction} from "../models/Prediction";

export interface TDeviceResponse extends TDevice {
    _id: string;
}

export interface DeviceWithPrediction extends TDeviceResponse {
    predictions: TPrediction[];
}