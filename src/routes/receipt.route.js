const express = require('express');
const receiptController = require('../controllers/receipt.controller');
const router = express.Router();

//* [GET] /receipt/of-user -> get all receipt of user
router.get('/of-user/:userId', receiptController.getReceiptOfUser);

//* [GET] /receipts/filter  -> filter list receipt
router.get('/filter', receiptController.filterReceipts);

//* [GET] /receipts/detail/:id      -> get detail a receipt
router.get('/detail/:id', receiptController.getDetailReceipt);

//* [POST] /receipts/create     -> create a receipt
router.post('/create', receiptController.createReceipt);

//* [PUT] /receipts/update/:id  -> update a receipt
router.put('/update/:id', receiptController.updateReceipt);

//* [DELETE] /receipts/deleted/:id  -> delete a receipt
router.delete('/delete/:id', receiptController.deleteReceipt);

module.exports = router;
