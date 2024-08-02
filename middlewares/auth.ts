import { Request, Response, NextFunction } from 'express';
import {getUserFromJwt} from "../utils/jsonwebtoken";

export const authMiddleware = async (request: Request, response: Response, next: NextFunction) => {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return response.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    try {
        let user;
        try {
            user = await getUserFromJwt(token);
        } catch (e) {
            return response.status(401).json({ message: 'Unauthorized' });
        }

        if (!user) {
            return response.status(401).json({ message: 'Unauthorized' });
        }
        request.user = user;
        next();
    } catch (e) {
        console.log(e)
        return response.status(500).json({ message: 'Internal server error' });
    }
}