"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const predictionSchema = new mongoose_1.Schema({
    data: {
        type: [Number],
        required: true,
    },
    prediction: {
        type: String,
        required: true,
    },
    device: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Device",
    },
});
const Prediction = (0, mongoose_1.model)("Prediction", predictionSchema);
exports.default = Prediction;
