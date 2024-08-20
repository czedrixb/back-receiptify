require('dotenv').config();
const asyncHandler = require('express-async-handler')
const axios = require('axios')

const login = asyncHandler(async (req, res) => {
    const scopes = 'user-read-private user-read-email playlist-read-private';
    const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${process.env.SPOTIFY_CLIENT_ID}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(process.env.SPOTIFY_REDIRECT_URI)}`;

    res.redirect(authUrl);
})

const callback = asyncHandler(async (req, res) => {
    const code = req.query.code;

    try {
        const response = await axios.post('https://accounts.spotify.com/api/token', new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
            client_id: process.env.SPOTIFY_CLIENT_ID,
            client_secret: process.env.SPOTIFY_CLIENT_SECRET,
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const { access_token, refresh_token } = response.data;

        req.session.accessToken = access_token;
        req.session.refreshToken = refresh_token;


        res.redirect('http://localhost:3000/receipt');
    } catch (error) {
        console.error('Error exchanging code for token:', error.response ? error.response.data : error.message);
        res.redirect('/');
    }
});



const receipt = asyncHandler(async (req, res) => {
    if (!req.session.accessToken) {
        return res.redirect('/login');
    }

    try {
        const userResponse = await axios.get('https://api.spotify.com/v1/me', {
            headers: {
                'Authorization': `Bearer ${req.session.accessToken}`,
            },
        });

        res.json(userResponse.data);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.redirect('/login');
    }
})

const refresh = asyncHandler(async (req, res) => {
    if (!req.session.refreshToken) {
        return res.redirect('/login');
    }

    try {
        const response = await axios.post('https://accounts.spotify.com/api/token', new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: req.session.refreshToken,
            client_id: process.env.SPOTIFY_CLIENT_ID,
            client_secret: process.env.SPOTIFY_CLIENT_SECRET,
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        req.session.accessToken = response.data.access_token;

        res.redirect('/profile');
    } catch (error) {
        console.error('Error refreshing token:', error);
        res.redirect('/login');
    }
})

module.exports = {
    login,
    callback,
    receipt,
    refresh
}