import express from "express";
import {authMiddleware} from "../middlewares/auth";

import Home, {THome} from "../models/Home";
import Prediction, {IPrediction} from "../models/Prediction";
import {PopulatedHome} from "../types/home";


const router = express.Router();

router.use(authMiddleware);

router.get("/", async (request, response) => {
    try {
        const userHome = await Home.find({ users : request.user._id});
        return response.status(200).send(userHome);
    }
    catch (e) {
        console.log(e)
        return response.status(500).send({ message: "Internal server error" });
    }

});

router.post("/", async (request, response) => {

        const { name, address } = request.body;

        try {
            const homeCreated = await Home.create({ name, address, users: [request.user._id] });
            return response.status(200).send({ homeCreated });
        }
        catch (e) {
            return response.status(400).send({ message: "Home already exists" });
        }

});

router.post("/add_device", async (request, response) => {

        const { homeId, deviceId } = request.body;

        const homeFromDevice = await Home.find({ devices: deviceId }) as THome[];

        if (homeFromDevice.length > 0) {
            return response.status(400).send({ message: "Device already exists in a home" });
        }

        try {
            const home = await Home.findById(homeId) as THome;
            if (!home) {
                return response.status(400).send({ message: "Home not found" });
            }

            await Home.findByIdAndUpdate(homeId, { devices: [...home.devices, deviceId] });

            return response.status(200).send({ message: "Device added to home" });
        }
        catch (e) {
            console.log(e)
            return response.status(500).send({ message: "Internal server error" });
        }

});

router.get("/:homeId", async (request, response) => {

    const { homeId } = request.params;

    try {
        const home =
            await Home
                .findById(homeId)
                .populate({
                    path: "devices"
                })
                .populate("users") as PopulatedHome;

        if (!home) {
            return response.status(400).send({ message: "Home not found" });
        }

        const listPredictions = [];

        for (const device of home.devices) {
            const predictions = await Prediction.find({ device: device._id }) as IPrediction[];
            listPredictions.push(...predictions);
        }
        return response.status(200).send(
            {
                home,
                predictions: listPredictions
            }
        );
    } catch (e) {
        console.log(e)
        return response.status(500).send({ message: "Internal server error" });
    }
});

export default router;