const express = require('express');

const router = express.Router();

const forgotController = require('../controllers/forgotcontrollers');

router.use('/forgotpassword',forgotController.forgotpassword);

router.get('/updatepassword/:resetpasswordid', forgotController.updatepassword);

router.get('/resetpassword/:id', forgotController.resetpassword);

module.exports = router;