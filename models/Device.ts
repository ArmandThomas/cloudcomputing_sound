import { Document, model, Schema } from "mongoose";
import {TPrediction} from "./Prediction";

export type TDevice = {
    private_key: string;
    type: "micro_detector" | "normal_detector";
    predictions?: TPrediction[];
}

export interface IDevice extends TDevice, Document {}

const deviceSchema: Schema = new Schema({
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