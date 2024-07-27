import express from "express";
import {authMiddleware} from "../middlewares/auth";

import Device from "../models/Device";

const router = express.Router();

router.use(authMiddleware);

router.post("/", async (request, response) => {

            const { type, private_key } = request.body;

            try {
                const deviceCreated = await Device.create({ type, private_key });
                return response.status(200).send({ deviceCreated });
            }
            catch (e) {
                return response.status(400).send({ message: "Device already exists" });
            }

});

export default router;