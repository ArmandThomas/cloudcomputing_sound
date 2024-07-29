import express from "express";
import {authMiddleware} from "../middlewares/auth";

import Prediction, {IPrediction} from "../models/Prediction";
import wavEncoder from 'wav-encoder';


const router = express.Router();

router.post("/", authMiddleware, async (request, response) => {

    const { data, prediction, device, date } = request.body;

    try {
        const predictionCreated = await Prediction.create({ data, prediction, device, date });
        return response.status(200).send({ predictionCreated });
    }
    catch (e) {
        console.log(e)
        return response.status(500).send({ message: "Internal server error" });
    }


});

router.get('/getaudio/:predictionId', async (request, response) => {
    const { predictionId } = request.params;

    try {
        const prediction = await Prediction.findById(predictionId) as IPrediction;

        if (!prediction) {
            return response.status(404).send({ message: 'Prediction not found' });
        }

        const sampleRate = 4000; // Assure-toi que le taux d'échantillonnage est approprié pour tes données
        const audioData = prediction.data;

        // Convertir les données en un tableau de nombres flottants
        const float32Array = new Float32Array(audioData);

        // Créer un objet audio pour encoder en WAV
        const audioBuffer = {
            sampleRate,
            channelData: [float32Array]
        };

        // Encoder en WAV
        const wavBuffer = await wavEncoder.encode(audioBuffer);

        // Envoyer la réponse avec le fichier WAV
        response.writeHead(200, {
            'Content-Type': 'audio/wav',
            'Content-Length': wavBuffer.byteLength
        });

        response.end(Buffer.from(wavBuffer));
    } catch (error) {
        console.error('Error generating audio:', error);
        response.status(500).send({ message: 'Internal Server Error' });
    }
});

export default router;