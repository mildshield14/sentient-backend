import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import router from "./src/router";
import 'dotenv/config';

const serverless = require('serverless-http');

const app = express();
app.use(
    cors({
        credentials: true,
    }),
);

app.use(compression());
// app.use(cookieParser());
app.use(bodyParser.json());

// const server = http.createServer(app);
//
// server.listen(8080, () => {
//     console.log("Server running on localhost 8080")
// })

const PORT = 8080;

const MONGODB_URL = `mongodb+srv://admin1234:${process.env.MONG0PWD}@sentient-ui.lknck.mongodb.net/sentient?retryWrites=true&w=majority&appName=sentient-ui`;

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URL);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("MongoDB Connection Error:", err);
        process.exit(1); // Exit if DB connection fails
    }
};

// Connect to database when Lambda starts
connectDB();

// module.exports.handler = serverless(app);
// export default app;
export const handler = serverless(app);
import express from "express";
import serverless from "serverless-http";

const app = express();

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

export const handler = serverless(app);