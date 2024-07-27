import {TUser} from "../models/User";

export interface UserData {
    email: string;
    password: string;
}

export interface TUserResponse extends TUser {
    _id: string;
}
