const express = require('express');
const router = express.Router();
const testControllers = require('../controllers/test.controller');

router.get('/get', testControllers.get);

router.post('/create', testControllers.create);

module.exports = router;
