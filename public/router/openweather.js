"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cache = {
    data: null,
    timestamp: 0,
};
const fetchWeatherData = (lat, lon) => __awaiter(void 0, void 0, void 0, function* () {
    const weatherResponse = yield axios_1.default.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,weather_code`);
    const feelLikeResponse = yield axios_1.default.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=apparent_temperature`);
    return {
        weatherData: weatherResponse.data,
        feelLikeData: feelLikeResponse.data
    };
});
const fetchLocationName = (lat, lon) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.get(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
    return {
        city: response.data.city || response.data.locality || response.data.principalSubdivision,
        principalSubdivisionCode: response.data.principalSubdivisionCode,
    };
});
const cleanWeatherData = (data, location) => {
    const currentTime = new Date(data.weatherData.current_weather.time).getHours();
    const latestHours = data.weatherData.hourly.time
        .map((time, index) => ({
        time: new Date(time).toLocaleTimeString("en-US", {
            hour: "numeric",
            hour12: true,
        }),
        temperature: Math.round(data.weatherData.hourly.temperature_2m[index]),
        weatherCode: data.weatherData.hourly.weather_code[index],
    }))
        .slice(0, 5);
    const country = location.principalSubdivisionCode.split("-")[0];
    const state = location.principalSubdivisionCode.split("-")[1];
    return {
        location: location.city,
        country: country,
        state: state,
        current: {
            temperature: Math.round(data.weatherData.current_weather.temperature),
            weatherCode: data.weatherData.current_weather.weathercode,
            feelsLike: Math.round(data.feelLikeData.current.apparent_temperature)
        },
        hourly: latestHours,
    };
};
exports.default = (router) => {
    router.get("/weather", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const lat = parseFloat(req.query.lat) || 45.5;
        const lon = parseFloat(req.query.lon) || -73.57;
        const now = Date.now();
        if (!cache.data || now - cache.timestamp > 3600000) {
            try {
                const weatherData = yield fetchWeatherData(lat, lon);
                const location = yield fetchLocationName(lat, lon);
                cache.data = cleanWeatherData(weatherData, location);
                cache.timestamp = now;
            }
            catch (err) {
                console.error("Error fetching weather data:", err);
                return res.status(500).json({ error: "Failed to fetch weather data" });
            }
        }
        res.status(200).json(cache.data);
    }));
};
//# sourceMappingURL=openweather.js.map