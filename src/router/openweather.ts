import express from "express";
import axios from "axios";

export default (router: express.Router) => {
  router.get("/weather", (req, res) => {
    const code = req.body.code;
    console.log("Received weather code:", code);

    const { lat = 45.5, lon = 73.57 } = req.query;

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}`,
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
