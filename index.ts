import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import router from "./src/router";
import 'dotenv/config';

const app = express();
app.use(
  cors({
    credentials: true,
  }),
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

// const server = http.createServer(app);
//
// server.listen(8080, () => {
//     console.log("Server running on localhost 8080")
// })

const PORT = 8080;

const MONGODB_URL = `mongodb+srv://admin1234:${process.env.MONG0PWD}@sentient-ui.lknck.mongodb.net/sentient?retryWrites=true&w=majority&appName=sentient-ui`;

mongoose
  .connect(MONGODB_URL, {})
  .then(() => {
    console.log("Connected to MongoDB");

    // Start the server only after the database connection is established
    app.use("/api", router());
    app.listen(PORT, () => {
      console.log(`Server running`);
    });
  })
  .catch((err: any) => {
    console.error("MongoDB Connection Error:", err);
  });

export default app;