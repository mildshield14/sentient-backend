"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
exports.default = (router) => {
    router.post("/weather", (req, res) => {
        const code = req.body.code;
        console.log("Received weather code:", code);
        let lat = 45.5;
        let lon = 73.57;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                lat = position.coords.latitude;
                lon = position.coords.longitude;
            });
        }
        axios_1.default
            .get(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}`)
            .then((data) => {
            res.json(data.data);
            res.sendStatus(220);
        })
            .catch((err) => {
            console.error("Error during token exchange:", err);
            res.sendStatus(400);
        });
    });
};
//# sourceMappingURL=openweather.js.map