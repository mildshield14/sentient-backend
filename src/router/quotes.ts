import express from "express";
import axios from "axios";

export default (router: express.Router) => {
    router.get("/quote", async (_req, res) => {
      // const mood = req.query.mood || "happy";

      const options = {
        method: "GET",
        url: "https://quotes15.p.rapidapi.com/quotes/random/",
        params: {
          language_code: "en",
        },
        headers: {
          "x-rapidapi-key": process.env.RAPID_API_QUOTE_KEY,
          "x-rapidapi-host": "quotes15.p.rapidapi.com",
        },
      };
      console.log(process.env.RAPID_API_QUOTE_KEY);

      try {
        const response = await axios.request(options);
        console.log(response.data);

        const filteredData = response.data.results.map((item: any) => ({
         content: item.content,
          originator: item.originator,
        }));

        res.status(200).json(filteredData);
      } catch (error) {
        console.error(error);
        res.sendStatus(400);
      }
    });
};