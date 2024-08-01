import {DeviceWithPrediction, TDeviceResponse} from "./device";
import {TUserResponse} from "./user";

export interface PopulatedHome {
    _id: string;
    name: string;
    devices: DeviceWithPrediction[];
    users: TUserResponse[];
}