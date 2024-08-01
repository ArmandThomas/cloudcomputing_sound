import express from "express";
import Prediction from "../models/Prediction";
import { Expo } from 'expo-server-sdk';
import Home, {THome} from "../models/Home";
import User, {TUser} from "../models/User";
import Device from "../models/Device";
import {TDeviceResponse} from "../types/device";

const router = express.Router();

router.post("/", async (request, response) => {

    const { prediction, device } = request.body;
    const date = new Date();

    try {

        // @ts-ignore
        const foundDevice = await Device.findOne().where('private_key').equals(device).exec() as TDeviceResponse;
        if (!foundDevice) {
            return response.status(404).send({ message: 'Device not found' });
        }

        await Device.findByIdAndUpdate(foundDevice._id, { last_time_stored: date })

        if (prediction === "background") {
            return response.status(200).send({ message: "Background noise detected" });
        }

        const predictionCreated = await Prediction.create({ prediction, device: foundDevice._id, date });

        const home = await Home.findOne().where('devices').in([foundDevice._id]).exec() as THome;

        if (home) {
            const users = home.users;
            if (!users) {
                return response.status(404).send({ message: 'No users found' });
            }

            const expo = new Expo({
                useFcmV1: true,
            });

            const tokens = [];

            for (const user of users) {
                const userDoc = await User.findById(user) as TUser;
                if (userDoc) {
                    const userTokens = [...new Set(userDoc.pushToken)];
                    tokens.push(userTokens);
                }
            }

            const finalTokens = tokens.flat();

            const messages = finalTokens.map((token) => ({
                to: token,
                title: `${home.name} as detected : ${prediction}`,
                body: `Your device ${device} detected ${prediction} at ${date}`,
                data: { withSomeData : 'data' },
            }));

            const chunks = expo.chunkPushNotifications(messages);

            for (const chunk of chunks) {
                try {
                    const receipts = await expo.sendPushNotificationsAsync(chunk);
                    console.log(receipts);
                } catch (error) {
                    console.error(error);
                }
            }
        }
        return response.status(200).send({ predictionCreated });
    }
    catch (e) {
        console.log(e)
        return response.status(500).send({ message: "Internal server error" });
    }


});

export default router;