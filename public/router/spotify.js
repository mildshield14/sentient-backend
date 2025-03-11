"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const spotify_web_api_node_1 = __importDefault(require("spotify-web-api-node"));
const spotifyApi = new spotify_web_api_node_1.default({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: 'http://localhost:5173/callback',
});
exports.default = (router) => {
    router.post('/spotifylogin', (req, res) => {
        const code = req.body.code;
        console.log('Received code:', req.body.code);
        spotifyApi.authorizationCodeGrant(code)
            .then(data => {
            res.json({
                accessToken: data.body.access_token,
                refreshToken: data.body.refresh_token,
                expiresIn: data.body.expires_in,
            });
        })
            .catch(err => {
            console.error('Error during token exchange:', err);
            res.sendStatus(400);
        });
    });
};
//# sourceMappingURL=spotify.js.map