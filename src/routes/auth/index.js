const express = require('express');
const router = express.Router();
const authControllers = require('../../controllers/auth');
const { verifyAccessToken } = require('../../helpers/jwt.service');

router.post('/register', authControllers.register);

router.post('/login', authControllers.login);

router.delete('/logout', authControllers.logout);

router.post('/refreshToken', authControllers.refreshToken);

router.get('/user', verifyAccessToken, authControllers.getUser);

module.exports = router;
