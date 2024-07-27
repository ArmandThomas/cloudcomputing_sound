import express, { Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";

import connectDB from "./config/database";
import * as process from "process";
import userRouter from "./routes/user";
import homeRouter from "./routes/home";
import deviceRouter from "./routes/device";
import predictionRouter from "./routes/prediction";

dotenv.config();

connectDB(process.env.MONGODB_URI);

// configures dotenv to work in your application

const app = express();

app.use(bodyParser.json());

const PORT = process.env.PORT;

app.get("/", (request: Request, response: Response) => {
    response.status(200).send("Hello World");
});

app.use("/user", userRouter);
app.use("/home", homeRouter);
app.use("/device", deviceRouter);
app.use("/prediction", predictionRouter);

app.listen(PORT, () => {
    console.log("Server running at PORT: ", PORT);
}).on("error", (error) => {
    // gracefully handle error
    throw new Error(error.message);
});