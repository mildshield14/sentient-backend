import express, { Request, Response } from "express";
import SpotifyWebApi from "spotify-web-api-node";
import { UserModel } from "../db/users";


const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: "http://localhost:5173/callback",
});

export default (router:express.Router) => {
    router.post(
    "/spotifylogin",
    async (req: Request, res: Response) => {
      const { code, userId } = req.body;
      if (!code) {
        return res.status(400).json({ error: "Missing 'code' in request body" });
      }
      if (!userId) {
        return res.status(400).json({ error: "Missing 'localUserId' in request body" });
      }

      try {
        const data = await spotifyApi.authorizationCodeGrant(code);
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
      } catch (error) {
        console.error("Error during Spotify token exchange:", error);
        return res.status(400).json({ error: "Failed to exchange code for tokens" });
      }
})
}