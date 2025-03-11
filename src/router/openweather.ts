import express from "express";
import axios from "axios";

export default (router:express.Router) => {
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
    axios
      .get(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}`,
      )
      .then((data: { data: any }) => {
        res.json(data.data);
          res.sendStatus(220);
      })
      .catch((err: any) => {
        console.error("Error during token exchange:", err);
        res.sendStatus(400);
      });
  });
};
