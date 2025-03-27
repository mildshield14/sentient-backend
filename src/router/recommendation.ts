import express, { Request, Response } from "express";
import SpotifyWebApi from "spotify-web-api-node";
import { UserModel } from "../db/users";

// Utility function to check & refresh user token if needed
async function refreshUserToken(user: any) {
    const now = Date.now();
    const retrievedTime = new Date(user.spotify.tokenRetrievedAt).getTime();
    const elapsedSeconds = (now - retrievedTime) / 1000;

    if (elapsedSeconds >= user.spotify.expiresIn) {
        console.log("Token expired, refreshing...");
        const spotifyRefreshApi = new SpotifyWebApi({
            clientId: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        });
        try {
            const refreshData = await spotifyRefreshApi.refreshAccessToken(user.spotify.refreshToken);

            user.spotify.accessToken = refreshData.body.access_token;
            user.spotify.expiresIn = refreshData.body.expires_in;
            user.spotify.tokenRetrievedAt = new Date();

            if (refreshData.body.refresh_token) {
                user.spotify.refreshToken = refreshData.body.refresh_token;
            }

            await user.save();
            console.log("Token successfully refreshed.");
        } catch (err) {
            console.error("Error refreshing token:", err);
            throw err;
        }
    }
}

export default (router: express.Router) => {
    router.get("/recommendations", async (req: Request, res: Response) => {
        const userId = req.query.userId as string;
        const mood = (req.query.mood as string) || "";

        if (!userId) {
            return res.status(400).json({ error: "Missing userId query parameter" });
        }

        // Simple mood-to-valence mapping
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
                break;
        }

        try {
            const user = await UserModel.findById(userId);
            if (!user || !user.spotify) {
                return res.status(404).json({ error: "User not found or Spotify not linked" });
            }

            await refreshUserToken(user);

            const spotifyApi = new SpotifyWebApi({
                clientId: process.env.SPOTIFY_CLIENT_ID,
                clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
            });
            spotifyApi.setAccessToken(user.spotify.accessToken);

            const seedGenres = ["pop", "dance", "rock"]; // Ensure these are valid seed values
            const recommendationsParams = {
                seed_genres: seedGenres.join(","),
                target_valence: targetValence,
                limit: 10,
            };

            console.log("Requesting recommendations with parameters:", recommendationsParams);

            const recResponse = await spotifyApi.getRecommendations(recommendationsParams);

            return res.json(recResponse.body);
        } catch (error: any) {
            console.error("Error fetching user-based recommendations:", error);
            if (error.body) {
                console.error("Spotify API error body:", error.body);
            }
            return res.status(400).json({ error: "Failed to fetch recommendations" });
        }
    });
}