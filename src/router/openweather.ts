import express from "express";
import axios from "axios";

const cache = {
    data: null,
    timestamp: 0,
};

const fetchWeatherData = async (lat: number, lon: number) => {
    const response = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m&hourly=temperature_2m`
    );
    return response.data;
};

const cleanWeatherData = (data: any) => {
    const latestHours = data.hourly.time.slice(-5);
    const latestTemperatures = data.hourly.temperature_2m.slice(-5);
    return latestHours.map((time: string, index: number) => ({
        time,
        temperature: latestTemperatures[index],
    }));
};

export default (router: express.Router) => {
    router.get("/weather", async (req, res) => {
        const { lat = 45.5, lon = 73.57 } = req.query;

        const now = Date.now();
        if (!cache.data || now - cache.timestamp > 3600000) {
            try {
                const weatherData = await fetchWeatherData(lat, lon);
                cache.data = cleanWeatherData(weatherData);
                cache.timestamp = now;
            } catch (err) {
                console.error("Error fetching weather data:", err);
                return res.status(500).json({ error: "Failed to fetch weather data" });
            }
        }

        res.status(200).json(cache.data);
    });
};