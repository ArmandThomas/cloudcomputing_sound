"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const deviceSchema = new mongoose_1.Schema({
    mac: {
        type: String,
        required: true,
    },
    private_key: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    }
});
const Device = (0, mongoose_1.model)("Device", deviceSchema);
exports.default = Device;
