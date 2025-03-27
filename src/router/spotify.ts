import express, { Request, Response } from "express";
import SpotifyWebApi from "spotify-web-api-node";
import { UserModel } from "../db/users";

// Spotify instance configured for login (authorization code flow)
const spotifyAuthApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: "http://localhost:5173/callback",
});

// Spotify instance configured for recommendations (client credentials flow)
const spotifyClient = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

export default (router: express.Router) => {
  router.get("/recommendations", async (req: Request, res: Response) => {
    const mood = req.query.mood as string;
    if (!mood) {
      return res.status(400).json({ error: "Missing mood query parameter" });
    }

    let targetValence: number;
    switch (mood.toLowerCase()) {
      case "happy":
        targetValence = 0.8;
        break;
      case "sad":
        targetValence = 0.3;
        break;
      case "energetic":
        targetValence = 0.9;
        break;
      case "chill":
        targetValence = 0.5;
        break;
      default:
        targetValence = 0.5;
    }

    const seed_genres = ["pop"];

    try {
      // Obtain an application access token via client credentials grant
      const tokenData = await spotifyClient.clientCredentialsGrant();
      spotifyClient.setAccessToken(tokenData.body.access_token);

      // Fetch recommendations from Spotify API
      const recommendations = await spotifyClient.getRecommendations({
        seed_genres,
        target_valence: targetValence,
        limit: 10,
      });

      return res.json(recommendations.body);
    } catch (error: any) {
      console.error("Error fetching recommendations:", error);
      if (error.body) console.error("Spotify API error body:", error.body);
      return res.status(400).json({ error: "Failed to fetch recommendations" });
    }
  });

  router.post("/spotifylogin", async (req: Request, res: Response) => {
    const { code, userId } = req.body;
    if (!code) {
      return res.status(400).json({ error: "Missing 'code' in request body" });
    }
    if (!userId) {
      return res.status(400).json({ error: "Missing 'localUserId' in request body" });
    }

    try {
      const data = await spotifyAuthApi.authorizationCodeGrant(code);
      const { access_token, refresh_token, expires_in } = data.body;

      const tempApi = new SpotifyWebApi();
      tempApi.setAccessToken(access_token);
      const meResponse = await tempApi.getMe();
      const spotifyId = meResponse.body.id;

      let user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "Local user not found" });
      }

      user.spotify = {
        id: spotifyId,
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresIn: expires_in,
        tokenRetrievedAt: new Date(),
      };

      await user.save();

      return res.json({
        userId: userId,
        spotifyId,
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresIn: expires_in,
      });
    } catch (error: any) {
      console.error("Error during Spotify token exchange:", error);
      return res.status(400).json({ error: "Failed to exchange code for tokens" });
    }
  });
};