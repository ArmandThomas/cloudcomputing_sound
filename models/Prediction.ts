import { Document, model, Schema } from "mongoose";
import {IDevice} from "./Device";

export type TPrediction = {
    data : number[];
    prediction: string;
    device : IDevice;
}

export interface IPrediction extends TPrediction, Document {}

const predictionSchema: Schema = new Schema({
    data: {
        type: [Number],
        required: true,
    },
    prediction: {
        type: String,
        required: true,
    },
    device: {
        type: Schema.Types.ObjectId,
        ref: "Device",
    },
});

const Prediction = model("Prediction", predictionSchema);

export default Prediction;