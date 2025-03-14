import express from "express";
import bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import router from "./src/router";
import 'dotenv/config';
import serverless from 'serverless-http';

const app = express();

// Allow requests from Netlify frontend
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://sentient-app.netlify.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.options("*", (req, res) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    res.sendStatus(204);
});

// Middleware
app.use(compression());
app.use(bodyParser.json());

// Initialize routes
app.use("/api", router());

// Database connection (outside the handler)
const MONGODB_URL = `mongodb+srv://admin1234:${process.env.MONG0PWD}@sentient-ui.lknck.mongodb.net/sentient?retryWrites=true&w=majority&appName=sentient-ui`;

mongoose
  .connect(MONGODB_URL, {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err: any) => {
    console.error("MongoDB Connection Error:", err);
  });

// // Serverless handler
// export const handler = serverless(app);
// Serverless handler
// export default serverless(app);
module.exports = app