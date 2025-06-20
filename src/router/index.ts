import express from "express";
import authentication from "./authentication";
import users from "./users";
import spotify from "./spotify";
import weather from "./openweather";
import notes from "./notes";
import quotes from "./quotes";
import image from "./image";
import recommend from "./recommendation";
import todos from "./todos";

const router = express.Router();

export default (): express.Router => {
  authentication(router);
  users(router);
  spotify(router);
  weather(router);
  notes(router);
  quotes(router);
  image(router);
  recommend(router);
  todos(router);
  return router;
};

// module.exports = () => {
//   return router;
// };