const express = require('express');

const router = express.Router();

const userController = require('../controllers/usercontrollers');

router.post('/signup',userController.addUser);

router.post('/login',userController.loginUser);

module.exports = router;


