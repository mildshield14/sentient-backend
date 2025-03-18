import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const cache = {
    data: null,
    timestamp: 0,
};

const fetchWeatherData = async (lat: number, lon: number) => {
    const response = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,weather_code`
    );
    return response.data;
};

const fetchLocationName = async (lat: number, lon: number) => {
    const response = await axios.get(
        `https://geocode.maps.co/reverse?lat=${lat}&lon=${lon}&api-key=${process.env.MAPS_API_KEY}`
    );
    return response.data.address.city;
};

const cleanWeatherData = (data: any, locationName: string) => {
    const latestHours = data.hourly.time.slice(-5).map((time: string, index: number) => ({
        time: new Date(time).toLocaleTimeString("en-US", { hour: "numeric", hour12: true }),
        temperature: Math.round(data.hourly.temperature_2m[index]),
        weatherCode: data.hourly.weathercode[index],
    }));

    return {
        location: locationName,
        current: {
            temperature: Math.round(data.current_weather.temperature),
            feels_like: Math.round(data.current_weather.temperature),
            weatherCode: data.current_weather.weathercode,
        },
        hourly: latestHours,
    };
};

export default (router: express.Router) => {
    router.get("/weather", async (req, res) => {
        const { lat = 45.5, lon = 73.57 } = req.query;

        const now = Date.now();
        if (!cache.data || now - cache.timestamp > 3600000) {
            try {
                const weatherData = await fetchWeatherData(lat, lon);
                const locationName = await fetchLocationName(lat, lon);
                cache.data = cleanWeatherData(weatherData, locationName);
                cache.timestamp = now;
            } catch (err) {
                console.error("Error fetching weather data:", err);
                return res.status(500).json({ error: "Failed to fetch weather data" });
            }
        }

        res.status(200).json(cache.data);
    });
};