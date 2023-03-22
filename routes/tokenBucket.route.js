const express = require('express');
const router = express.Router();

// Middlewares
const takeRequestValidator = require('../middlewares/take.validator.js');

// Controllers
const TakeController = require('../controllers/tokenBucket.controller');

const tokenController = new TakeController();

router.get('/take', takeRequestValidator, (req, res) => {
    return tokenController.take(req, res);
});

module.exports = router;
