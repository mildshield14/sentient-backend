import express from "express";
import authentication from "./authentication";
import users from "./users";
import spotify from "./spotify";
import weather from "./openweather";
import notes from "./notes";
import quotes from "./quotes";

const router = express.Router();

export default (): express.Router => {
  authentication(router);
  users(router);
  spotify(router)
  weather(router);
  notes(router);
  quotes(router);
  return router;
};