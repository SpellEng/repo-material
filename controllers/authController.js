const axios = require('axios');
const qs = require('qs');
const config = require('../config/keys');

let zoomAccessToken = '';
let zoomRefreshToken = '';
const TOKEN_EXPIRY_TIME = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
let tokenExpiresAt = 0;

exports.authorizeZoom = (req, res) => {
    const zoomAuthURL = `https://zoom.us/oauth/authorize?response_type=code&client_id=${config.ZOOM_CLIENT_ID}&redirect_uri=${config.ZOOM_REDIRECT_URL}`;
    res.redirect(zoomAuthURL);
};

const generateTokenTokenFun = async (code) => {
    const response = await axios.post(
        config.ZOOM_TOKEN_URL,
        qs.stringify({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: config.ZOOM_REDIRECT_URL
        }),
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${Buffer.from(`${config.ZOOM_CLIENT_ID}:${config.ZOOM_CLIENT_SECRET}`).toString('base64')}`
            }
        }
    );

    zoomAccessToken = response.data.access_token;
    zoomRefreshToken = response.data.refresh_token;
    tokenExpiresAt = Date.now() + TOKEN_EXPIRY_TIME; // Set expiration time to 12 hours
}

exports.handleZoomCallback = async (req, res) => {
    const { code } = req.query;

    try {
        await generateTokenTokenFun(code);
        res.send('Authorization successful, you can now create meetings.');
    } catch (error) {
        console.error('Error getting tokens', error.response ? error.response.data : error.message);
        res.status(201).json({ message: 'Failed to get tokens' });
    }
};

const refreshToken = async () => {
    try {
        const response = await axios.post(
            config.ZOOM_TOKEN_URL,
            qs.stringify({
                grant_type: 'refresh_token',
                refresh_token: zoomRefreshToken
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Basic ${Buffer.from(`${config.ZOOM_CLIENT_ID}:${config.ZOOM_CLIENT_SECRET}`).toString('base64')}`
                }
            }
        );

        zoomAccessToken = response.data.access_token;
        zoomRefreshToken = response.data.refresh_token;
        tokenExpiresAt = Date.now() + TOKEN_EXPIRY_TIME; // Reset expiration time to 12 hours
    } catch (error) {
        console.error('Error refreshing token', error.response);
    }
};

const getZoomAccessTokenFun = async () => {
    // Check if the token is expired
    if (Date.now() > tokenExpiresAt) {
        await refreshToken();
    }
    return zoomAccessToken;
};

exports.getZoomAccessToken = async (req, res) => {
    const token = await getZoomAccessTokenFun();
    return token;
};
