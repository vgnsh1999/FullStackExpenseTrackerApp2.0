const express = require('express');

const purchaseController = require('../controllers/purchasecontrollers');

const authenticatemiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/premiummembership', authenticatemiddleware.authenticate,purchaseController.purchasepremium);

router.post('/updatetransactionstatus-success', authenticatemiddleware.authenticate, purchaseController.updateTransactionStatusSuccess);

router.post('/updatetransactionstatus-fail', authenticatemiddleware.authenticate, purchaseController.updateTransactionStatusFail);

router.get('/getstatus',authenticatemiddleware.authenticate,purchaseController.getStatus);

module.exports = router;