const express = require('express');
const productController = require('../controllers/product.controller');
const router = express.Router();

//* [GET] /products/filter?searchValue=""
router.get('/filter', productController.filterProduct);

//* [GET] /products/by-category/:categoryId
router.get('/by-category/:categoryId', productController.getProductByCategory);

//* [GET] /products/paginate     -> get all product
router.get('/paginate', productController.getAllProduct);

//* [GET] /products/details/:id     -> get detail a product
router.get('/detail/:id', productController.getDetailProduct);

//* [POST] /products/create     -> create a product
router.post('/create', productController.createProduct);

//* [PUT] /products/update/:id     -> update a product
router.put('/update/:id', productController.updateProduct);

//* [DELETE] /products/delete/:id      -> delete a product
router.delete('/delete/:id', productController.deleteProduct);

module.exports = router;
