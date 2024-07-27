import dotenv from "dotenv";
import * as process from "process";
import jwt from 'jsonwebtoken';
import User from "../models/User";
import {TUserResponse, UserData} from "../types/user";

dotenv.config();

export const jwtSecret = process.env.JWT_SECRET as string;

export const getJwtSecret = (idUser : string) => {
    if (!idUser) {
        return;
    }
    const payload = { id : idUser };
    const options = { expiresIn: '30d' };
    return jwt.sign(payload, jwtSecret, options);
}

export const verifyJwt = (token: string) => {
    return jwt.verify(token, jwtSecret);
}

export const getUserFromJwt = async (token: string) => {
    const decoded = verifyJwt(token) as { id: string };
    const user = await User.findById(decoded.id) as TUserResponse;
    return user;
}