const express = require('express');
const router = express.Router();
const meController = require('../controllers/me.controller');
const { verifyAccessToken } = require('../helpers/jwt.service');

//* [GET] /me/profile   -> Get my profile
router.get('/profile', verifyAccessToken, meController.getProfile);

//! can use: OWNER USER, OWNER STAFF
//* [PUT] /me/update-info     -> Edit my profile
router.put('/update-info', verifyAccessToken, meController.updateInfo);

module.exports = router;
