import express from "express";
import {authMiddleware} from "../middlewares/auth";

import Prediction, {IPrediction} from "../models/Prediction";

const router = express.Router();

router.use(authMiddleware);

router.post("/", async (request, response) => {

    const { data, prediction, device } = request.body;

    try {
        const predictionCreated = await Prediction.create({ data, prediction, device });
        return response.status(200).send({ predictionCreated });
    }
    catch (e) {
        console.log(e)
        return response.status(500).send({ message: "Internal server error" });
    }


});


export default router;