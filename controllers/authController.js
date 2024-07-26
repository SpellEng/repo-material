const axios = require('axios');
const qs = require('qs');
const config = require('../config/keys');

let zoomAccessToken = '';
let zoomRefreshToken = '';

exports.authorizeZoom = (req, res) => {
    const zoomAuthURL = `https://zoom.us/oauth/authorize?response_type=code&client_id=${config.ZOOM_CLIENT_ID}&redirect_uri=${config.ZOOM_REDIRECT_URL}`;
    res.redirect(zoomAuthURL);
};

exports.handleZoomCallback = async (req, res) => {
    const { code } = req.query;

    try {
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

        res.send('Authorization successful, you can now create meetings.');
    } catch (error) {
        console.error('Error getting tokens', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Failed to get tokens' });
    }
};

exports.refreshToken = async (req, res) => {
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

        res.json({ accessToken: zoomAccessToken });
    } catch (error) {
        console.error('Error refreshing token', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Failed to refresh token' });
    }
};

exports.getZoomAccessToken = () => zoomAccessToken;
