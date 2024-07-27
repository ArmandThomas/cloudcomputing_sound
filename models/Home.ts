import { Document, model, Schema } from 'mongoose';
import { IDevice } from './Device';
import { IUser } from './User';

export type THome = {
    name: string;
    location: string;
    devices: IDevice[];
    users: IUser[];
}
export interface IHome extends THome, Document {}

const homeSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: false,
    },
    devices: [{
        type: Schema.Types.ObjectId,
        ref: "Device",
    }],
    users: [{
        type: Schema.Types.ObjectId,
        ref: "User",
    }],
});

const Home = model<IHome>('Home', homeSchema);

export default Home;
