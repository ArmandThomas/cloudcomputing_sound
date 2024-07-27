import {TUserResponse} from "./user";

declare global {
    namespace Express {
        export interface Request {
            user?: TUserResponse
        }
    }
}