import express from "express";
import SpotifyWebApi from "spotify-web-api-node";
import { UserModel } from "../models/User";

const router = express.Router();

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: "http://localhost:5173/callback",
});

router.post("/spotifylogin", async (req, res) => {
  const code = req.body.code;
  if (!code) {
    return res.status(400).json({ error: "Missing 'code' in request body" });
  }

  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    const { access_token, refresh_token, expires_in } = data.body;

    const tempApi = new SpotifyWebApi();
    tempApi.setAccessToken(access_token);
    const meResponse = await tempApi.getMe();
    const spotifyId = meResponse.body.id;

    let user = await UserModel.findOne({ "spotify.id": spotifyId });

    if (!user) {
      user = new UserModel({
        email: `spotify_${spotifyId}@example.com`,
        spotify: {
          id: spotifyId,
          accessToken: access_token,
          refreshToken: refresh_token,
          expiresIn: expires_in,
          tokenRetrievedAt: new Date(),
        },
      });
    } else {
      user.spotify.accessToken = access_token;
      user.spotify.refreshToken = refresh_token;
      user.spotify.expiresIn = expires_in;
      user.spotify.tokenRetrievedAt = new Date();
    }

    await user.save();

    res.json({
      userId: spotifyId,
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresIn: expires_in,
    });
  } catch (error) {
    console.error("Error during Spotify token exchange:", error);
    res.status(400).json({ error: "Failed to exchange code for tokens" });
  }
});

export default router;
