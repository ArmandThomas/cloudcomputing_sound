"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const homeSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: false
    },
    devices: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Device",
        }],
    users: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User",
        }],
});
const Home = (0, mongoose_1.model)("Home", homeSchema);
exports.default = Home;
