import express from "express";
import axios from "axios";

export default (router: express.Router) => {
    router.get("/weather", async (req, res) => {
        const { lat = 45.5, lon = 73.57 } = req.query;

        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}`
            );
            res.status(200).json(response.data);
        } catch (err) {
            console.error("Error during token exchange:", err);
            res.status(400).json({ error: "Failed to fetch weather data" });
        }
    });
};