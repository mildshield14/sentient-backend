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
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&current=apparent_temperature&hourly=temperature_2m,weather_code`,
    );
    return response.data;
};

const fetchLocationName = async (lat: number, lon: number) => {
    const response = await axios.get(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
    );
    return {
        city: response.data.city || response.data.locality || response.data.principalSubdivision,
        principalSubdivisionCode: response.data.principalSubdivisionCode,
    };
};

const cleanWeatherData = (data: any, location: { city: string, principalSubdivisionCode: string }) => {
    const currentTime = new Date(data.current_weather.time).getHours();
    const latestHours = data.hourly.time
        .map((time: string, index: number) => ({
            time: new Date(time).toLocaleTimeString("en-US", {
                hour: "numeric",
                hour12: true,
            }),
            temperature: Math.round(data.hourly.temperature_2m[index]),
            weatherCode: data.hourly.weather_code[index],
        }))
        // .filter((hour: any) => new Date(hour.time).getHours() > currentTime)
        .slice(0, 5);
    
    const country = location.principalSubdivisionCode.split("-")[0];
    const state = location.principalSubdivisionCode.split("-")[1];

    return {
        location: location.city,
       country: country,
        state: state,
        current: {
            temperature: Math.round(data.current_weather.temperature),
            weatherCode: data.current_weather.weathercode,
        },
        hourly: latestHours,
    };
};

export default (router: express.Router) => {
    router.get("/weather", async (req, res) => {
        const lat = parseFloat(req.query.lat as string) || 45.5;
        const lon = parseFloat(req.query.lon as string) || -73.57;

        const now = Date.now();
        if (!cache.data || now - cache.timestamp > 3600000) {
            try {
                const weatherData = await fetchWeatherData(lat, lon);
                const location = await fetchLocationName(lat, lon);
                cache.data = cleanWeatherData(weatherData, location);
                cache.timestamp = now;
            } catch (err) {
                console.error("Error fetching weather data:", err);
                return res.status(500).json({ error: "Failed to fetch weather data" });
            }
        }

        res.status(200).json(cache.data);
    });
};