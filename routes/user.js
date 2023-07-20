const express = require('express');

const router = express.Router();

const userController = require('../controllers/usercontrollers');
const expenseController = require('../controllers/expensecontrollers');

const authenthicatemiddleware = require('../middleware/auth');

router.post('/signup',userController.signup);

router.post('/login',userController.login);

router.get('/download',authenthicatemiddleware.authenticate,expenseController.downloadexpense);

router.get('/total-expense',authenthicatemiddleware.authenticate,userController.totalexpense);

module.exports = router;


