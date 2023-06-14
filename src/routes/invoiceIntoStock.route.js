const express = require('express');
const router = express.Router();
const invoiceIntoStockController = require('../controllers/invoiceIntoStock.controller');

//* [GET] /invoice-into-stocks/inventory?type=""    -> get product, medicine in stock
router.get('/inventory', invoiceIntoStockController.getMerchandiseInventory);

//* [GET] /invoice-into-stocks/filter-history -> Get invoice with paging group by date
router.get('/filter-history', invoiceIntoStockController.filterHistory);

//* [GET] /invoice-into-stocks/bydate?from=""&to=""
router.get('/by-date', invoiceIntoStockController.getInvoiceByDate);

router.get('/product-filter', invoiceIntoStockController.filterProduct);

//* [GET] /invoice-into-stocks/:id      -> Get detail invoice into stock
router.get('/:id', invoiceIntoStockController.getDetailInvoice);

//* [POST] /invoice-into-stocks/create      -> Create an invoice into stock
router.post('/create', invoiceIntoStockController.createInvoice);

//* [DELETE] /invoice-into-stocks/:id -> Delete an invoice into stock
router.delete('/delete/:id', invoiceIntoStockController.deleteInvoice);

//* [PUT] /invoice-into-stocks/:id  -> Update an invoice into stock
router.put('/update/:id', invoiceIntoStockController.editInvoice);

module.exports = router;

/*
    - lấy các hóa đơn theo khoảng ngày
    - lấy các hóa đơn sắp xếp tăng/ giảm
    - phân trang:
        - lenght
        - pageNum
*/
