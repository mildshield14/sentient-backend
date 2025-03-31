import express, { Request, Response } from "express";
import { UserModel } from "../db/users";


export default (router: express.Router) => {
  router.get("/recommendations", async (req: Request, res: Response) => {
    const {userId, mood = "happy"} = req.query;

    if (!userId) {
      return res.status(400).json({error: "Missing userId in query"});
    }

    const user = await UserModel.findById(userId);
    if (!user || !user.spotify?.accessToken) {
      return res.status(404).json({error: "User or user's Spotify tokens not found"});
    }

    const accessToken = user.spotify.accessToken;

    // Figure out your targetValence based on the mood
    let targetValence = 0.5;
    switch (mood.toString().toLowerCase()) {
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

    // Build request to Spotify's Recommendations endpoint
    const spotifyUrl = new URL("https://api.spotify.com/v1/recommendations");
    spotifyUrl.searchParams.set("seed_genres", "pop");
    spotifyUrl.searchParams.set("target_valence", targetValence.toString());
    spotifyUrl.searchParams.set("limit", "10");
    spotifyUrl.searchParams.set("market", "US");

    try {
      const response = await fetch(spotifyUrl.toString(), {
        headers: {Authorization: `Bearer ${accessToken}`},
      });
      if (!response.ok) {
        const bodyText = await response.text();
        throw new Error(`Spotify Rec Error: ${response.status} - ${bodyText}`);
      }
      const recommendations = await response.json();
      return res.json({recommendations});
    } catch (err: any) {
      console.error("Failed to fetch recommendations:", err);
      return res.status(500).json({error: err.message});
    }
  });
}