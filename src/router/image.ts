import express from "express";
import axios from "axios";

export default (router: express.Router) => {
    router.get("/image", async (_req, res) => {
      // const mood = req.query.mood || "happy";
      const apiKey = process.env.IMAGE_API_KEY;

      if (!apiKey) {
        return res.status(500).json({ error: "API key is missing" });
      }
      const options = {
        method: "GET",
        url: "https://api.unsplash.com/search/photos/",
        params: {
          query: "happy",
          page: "1",
          per_page: "1",
        },
        headers: {
          "Client-ID": process.env.IMAGE_API_KEY,
        },
      };

      try {
        const response = await axios.request(options);
        console.log(response.data);
        res.status(200).json(response.data);
      } catch (error) {
        console.error(error);
        res.sendStatus(400);
      }
    });
};