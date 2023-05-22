const express = require('express');
const router = express.Router();
const invoiceIntoStockController = require('../controllers/invoiceIntoStock.controller');
const invoiceIntoStockServices = require('../services/invoiceIntoStock.services');

//* -> Get invoice with paging group by date
//* [GET] /invoice-into-stocks/bydate?from=""&to=""
router.get('/by-date', invoiceIntoStockController.getInvoiceByDate);

//* [GET] /invoice-into-stocks/:id      -> Get detail invoice into stock
router.get('/:id', invoiceIntoStockController.getDetailInvoice);

//* [POST] /invoice-into-stocks/create      -> Create an invoice into stock
router.post('/create', invoiceIntoStockController.createInvoice);

//* [DELETE] /invoice-into-stocks/:id -> Delete an invoice into stock
router.delete('/:id', invoiceIntoStockController.deleteInvoice);

//* [PUT] /invoice-into-stocks/:id  -> Update an invoice into stock
router.put('/id', invoiceIntoStockController.editInvoice);

module.exports = router;

/*
    - lấy các hóa đơn theo khoảng ngày
    - lấy các hóa đơn sắp xếp tăng/ giảm
    - phân trang:
        - lenght
        - pageNum
*/
