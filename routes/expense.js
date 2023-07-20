const express = require('express');
const userauthentication = require('../middleware/auth');

const router = express.Router();

const expenseController = require('../controllers/expensecontrollers');

router.post('/add-expense', userauthentication.authenticate, expenseController.addExpense);

//router.get('/get-expense?page=1&limit=10', userauthentication.authenticate, expenseController.getExpenseOnPage1);

router.get('/get-expense', userauthentication.authenticate, expenseController.getExpense);


router.delete('/delete-expense/:id', userauthentication.authenticate, expenseController.deleteExpense);

router.get('/download', userauthentication.authenticate, expenseController.download);

module.exports = router;