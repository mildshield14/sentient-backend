import express, { Request, Response } from "express";
import { Buffer } from "buffer";

export default (router: express.Router) => {
  router.get("/recommendations", async (req: Request, res: Response) => {
    try {
      const clientId = process.env.SPOTIFY_CLIENT_ID;
      const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

      if (!clientId || !clientSecret) {
        return res
            .status(500)
            .json({error: "Spotify client ID/secret not configured."});
      }

      const authString = Buffer.from(`${clientId}:${clientSecret}`).toString(
          "base64",
      );
      const tokenResponse = await fetch(
          "https://accounts.spotify.com/api/token",
          {
            method: "POST",
            headers: {
              Authorization: `Basic ${authString}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              grant_type: "client_credentials",
            }),
          },
      );

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        throw new Error(
            `Failed to fetch client token: ${tokenResponse.status} ${errorText}`,
        );
      }

      const tokenData = await tokenResponse.json();
      const appToken = tokenData.access_token;

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

      const recResponse = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${appToken}`,
        },
      });

      if (!recResponse.ok) {
        const errorText = await recResponse.text();
        throw new Error(
            `Failed to fetch recommendations: ${recResponse.status} ${errorText}`,
        );
      }

      const recommendations = await recResponse.json();

      res.json({
        mood,
        recommendations,
      });
    } catch (err: any) {
      console.error("Error in /recommendations (client creds):", err);
      res.status(500).json({error: err.message});
    }
  });
}