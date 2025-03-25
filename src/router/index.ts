import express from "express";
import authentication from "./authentication";
import users from "./users";
import spotify from "./spotify";
import weather from "./openweather";
import notes from "./notes";
import quotes from "./quotes";
import image from "./image";

const router = express.Router();

export default (): express.Router => {
  authentication(router);
  users(router);
  router.use("/spotify", spotify);
  weather(router);
  notes(router);
  quotes(router);
  image(router);
  return router;
};

// module.exports = () => {
//   return router;
// };