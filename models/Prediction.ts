import { Document, model, Schema } from "mongoose";
import {IDevice} from "./Device";

export type TPrediction = {
    prediction: string;
    device : IDevice;
    date : Date;
}

export interface IPrediction extends TPrediction, Document {}

const predictionSchema: Schema = new Schema({
    prediction: {
        type: String,
        required: true,
    },
    device: {
        type: Schema.Types.ObjectId,
        ref: "Device",
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const Prediction = model("Prediction", predictionSchema);

export default Prediction;