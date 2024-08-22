require('dotenv').config();
const asyncHandler = require('express-async-handler')
const axios = require('axios')

const redirectUri = process.env.SPOTIFY_REDIRECT_URI;
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

const login = asyncHandler(async (req, res) => {
    const scope = 'user-read-private user-read-email user-top-read playlist-read-private playlist-read-collaborative';
    const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scope)}&redirect_uri=${encodeURIComponent(redirectUri)}`
    res.redirect(authUrl);
})

const callback = asyncHandler(async (req, res) => {
    const code = req.query.code;
    const tokenUrl = 'https://accounts.spotify.com/api/token';

    try {
        const response = await axios.post(tokenUrl, null, {
            params: {
                code,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code',
            },
            headers: {
                'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const { access_token } = response.data;
        res.redirect(`${process.env.NUXT_FRONTEND_URL}?access_token=${access_token}`);
    } catch (error) {
        res.status(500).send('Error retrieving access token');
    }
});

module.exports = {
    login,
    callback
}