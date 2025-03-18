import express from "express";
import axios from "axios";

export default (router: express.Router) => {
  router.get("/weather", (req, res) => {
    const code = req.body.code;
    console.log("Received weather code:", code);

    const { lat = 45.5, lon = 73.57 } = req.query;
    axios
      .get(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m&hourly=temperature_2m`,
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
