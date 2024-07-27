import { connect } from "mongoose";
import * as process from "process";

const connectDB = async (uri : string) => {
    try {
        await connect(uri);
        console.log("MongoDB Connected...");
    } catch (err) {
        console.error(err.message);
        // Exit process with failure
        process.exit(1);
    }
};

export default connectDB;