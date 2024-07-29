import express, { Response } from "express";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();


import { UserData, TUserResponse } from "../types/user";
import * as process from "process";
import User from "../models/User";
import {getJwtSecret} from "../utils/jsonwebtoken";
import {authMiddleware} from "../middlewares/auth";

const router = express.Router();

const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

router.post('/save_notification_token', authMiddleware,async (request, response) => {

    const userId = request.user._id;
    const { token } = request.body;

    try {
        // @ts-ignore
        await User.findByIdAndUpdate(userId, {notification_token: token}, {});
    }
    catch (e) {
        return response.status(500).send({ message: "Internal server error" });
    }

});

router.get('/me', authMiddleware, async (request, response) => {

        const userId = request.user._id;

        try {
            // @ts-ignore
            const user = await User.findById(userId) as TUserResponse;
            return response.status(200).send(user);
        }
        catch (e) {
            return response.status(500).send({ message: "Internal server error" });
        }
});

router.post('/register', async (request: { body : UserData }, response: Response) => {

    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const { email, password } = request.body;

    if (!regexPassword.test(password)) {
        return response.status(400).send({ message: "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character" });
    }
    if (!regexEmail.test(email)) {
        return response.status(400).send({ message: "Invalid email" });
    }

    try {
        const passwordHashed = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));
        try {
            await User.create({ email, password: passwordHashed });
            return response.status(200).send({ message: "User registered successfully" });
        }
        catch (e) {
            return response.status(400).send({ message: "User already exists" });
        }
    } catch (e) {
        console.log(e)
        return response.status(500).send({ message: "Internal server error" });
    }

});

router.post('/login', async (request: { body : UserData }, response: Response) => {

        const { email, password } = request.body;

        const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

        if (!regexEmail.test(email)) {
            return response.status(400).send({ message: "Invalid email" });
        }

        try {
            const user = await User.findOne({
                email
            }) as TUserResponse;

            if (!user) {
                return response.status(400).send({ message: "Invalid email or password" });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return response.status(400).send({ message: "Invalid email or password" });
            }

            try {
                const jwt = getJwtSecret(user._id);
                return response.status(200).send({ jwt });
            }
            catch (e) {
                return response.status(500).send({ message: "Internal server error" });
            }

        }
        catch (e) {
            console.log(e)
            return response.status(500).send({ message: "Internal server error" });
        }
});



export default router;