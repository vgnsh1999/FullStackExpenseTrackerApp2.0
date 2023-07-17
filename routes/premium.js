const express = require('express');

const premiumFeatureController = require('../controllers/premiumfeaturecontrollers');

const authenticatemiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/showLeaderBoard', authenticatemiddleware.authenticate, premiumFeatureController.getUserLeaderBoard);

module.exports = router;