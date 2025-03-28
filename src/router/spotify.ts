import express, { Request, Response } from "express";
import SpotifyWebApi from "spotify-web-api-node";
import { UserModel } from "../db/users";

// Create a SpotifyWebApi instance specifically for authorization code flow
const spotifyAuthApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: "http://localhost:5173/callback",
});

export default (router: express.Router) => {router.post("/spotifylogin", async (req: Request, res: Response) => {
  const { code, userId } = req.body;
  if (!code) {
    return res.status(400).json({ error: "Missing 'code' in request body" });
  }
  if (!userId) {
    return res.status(400).json({ error: "Missing 'userId' in request body" });
  }

  try {
    const data = await spotifyAuthApi.authorizationCodeGrant(code);
    const { access_token, refresh_token, expires_in } = data.body;

    const tempApi = new SpotifyWebApi();
    tempApi.setAccessToken(access_token);
    const meResponse = await tempApi.getMe();
    const spotifyId = meResponse.body.id;

    const user = await UserModel.findById(userId);
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

      const mood = (req.query.mood as string) || "happy";

      let targetValence = 0.5;
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

      const url = new URL("https://api.spotify.com/v1/recommendations");
      url.searchParams.set("seed_genres", "pop");
      url.searchParams.set("target_valence", targetValence.toString());
      url.searchParams.set("limit", "10");
      url.searchParams.set("market", "US");

      console.log("Fetching recommendations from:", url.toString());

      const recResponse = await fetch(url.toString(), {
          headers: { Authorization: `Bearer ${access_token}` },
      });

      console.log("Rec response status:", recResponse.status);
      const recBodyText = await recResponse.clone().text();
      console.log("Rec response body:", recBodyText);

      if (!recResponse.ok) {
          throw new Error(`Failed to fetch recommendations: ${recResponse.status} ${recBodyText}`);
      }

      const recommendations = JSON.parse(recBodyText);

    return res.json({
      userId,
      spotifyId,
        recommendations,
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresIn: expires_in,
    });
  } catch (error: any) {
    console.error("Error during Spotify token exchange:", error);
    return res.status(400).json({ error: "Failed to exchange code for tokens" });
  }
});}