import express from "express";
import bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import router from "./src/router";
import 'dotenv/config';

const app = express();

app.use(bodyParser.json());

// Allow requests from Netlify frontend
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://sentient-app.netlify.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Authorization"],
    credentials: true
}));

// Middleware
app.use(compression());


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

module.exports = app