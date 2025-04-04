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
          client_id: process.env.IMAGE_API_KEY,
          query: "scenery",
          page: Math.floor(Math.random() * 200) + 1,
          per_page: "1",
        },
      };

      try {
        const response = await axios.request(options);
        console.log(response.data);

        const filteredData = response.data.results.map((item: any) => {
          let description = item.description || item.alt_description || "No description available";

          return {
            id: item.id,
            description: description,
            urls: item.urls.raw,
            author: item.user ? item.user.name :null,
            location: item.user ? item.user.location : null,
          };
        });

        res.status(200).json(filteredData);

      } catch (error) {
        console.error(error);
        res.sendStatus(400);
      }
    });
};