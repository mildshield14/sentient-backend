import express from 'express';
import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: 'http://localhost:5173/callback', // TODO: Change this to netlifyy domain
});

export default (router:express.Router) => {
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
}
