import { Document, model, Schema } from "mongoose";
import {TPrediction} from "./Prediction";

export type TDevice = {
    private_key: string;
    type: "micro_detector" | "normal_detector";
    predictions?: TPrediction[];
    last_time_stored?: Date;
}

export interface IDevice extends TDevice, Document {}

const deviceSchema: Schema = new Schema({
    last_time_stored: {
        type: Date,
        default: Date.now,
    },
    private_key: {
        type: String,
        required: true,
        unique: true,
    },
    type: {
        type: String,
        required: true,
    }
});

const Device = model("Device", deviceSchema);

export default Device;