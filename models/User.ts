import { Document, model, Schema } from "mongoose";

export type TUser = {
    email: string;
    password: string;
    avatar: string;
    pushToken: string[];
};

export interface IUser extends TUser, Document {}

const userSchema: Schema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    pushToken: {
        type: [String],
    },
});

const User = model("User", userSchema);

export default User;