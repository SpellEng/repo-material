const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

router.get('/authorize', authController.authorizeZoom);
router.get('/callback', authController.handleZoomCallback);
router.post('/refresh-token', authController.refreshToken);

module.exports = router;
