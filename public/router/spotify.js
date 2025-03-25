"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const spotify_web_api_node_1 = __importDefault(require("spotify-web-api-node"));
const users_1 = require("../db/users");
const router = express_1.default.Router();
const spotifyApi = new spotify_web_api_node_1.default({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: "http://localhost:5173/callback",
});
router.post("/spotifylogin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code, userId } = req.body;
    if (!code) {
        return res.status(400).json({ error: "Missing 'code' in request body" });
    }
    if (!userId) {
        return res.status(400).json({ error: "Missing 'localUserId' in request body" });
    }
    try {
        const data = yield spotifyApi.authorizationCodeGrant(code);
        const { access_token, refresh_token, expires_in } = data.body;
        const tempApi = new spotify_web_api_node_1.default();
        tempApi.setAccessToken(access_token);
        const meResponse = yield tempApi.getMe();
        const spotifyId = meResponse.body.id;
        let user = yield users_1.UserModel.findById(userId);
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
        yield user.save();
        return res.json({
            userId: userId,
            spotifyId,
            accessToken: access_token,
            refreshToken: refresh_token,
            expiresIn: expires_in,
        });
    }
    catch (error) {
        console.error("Error during Spotify token exchange:", error);
        return res.status(400).json({ error: "Failed to exchange code for tokens" });
    }
}));
exports.default = router;
//# sourceMappingURL=spotify.js.map