const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyAccessToken } = require('../helpers/jwt.service');

//! can use: OWNER USER, OWNER STAFF
//* [PUT] /me/update-info     -> Edit my profile
router.put('/update-info', verifyAccessToken, userController.updateInfo);

module.exports = router;
