const express = require('express');
const router = express.Router();
const invoiceIntoStockController = require('../controllers/invoiceIntoStock.controller');

//* -> Get invoice with paging group by date
//* [GET] /invoice-into-stocks/bydate?from=""&to=""
router.get('/by-date', invoiceIntoStockController.getInvoiceByDate);

//* -> Get detail invoice into stock

//* -> Create an invoice into stock

//* -> Delete an invoice into stock

//* -> Update an invoice into stock

module.exports = router;

/*
    - lấy các hóa đơn theo khoảng ngày
    - lấy các hóa đơn sắp xếp tăng/ giảm
    - phân trang:
        - lenght
        - pageNum
*/
