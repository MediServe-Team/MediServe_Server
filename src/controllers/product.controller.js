const productServices = require('../services/product.services');

module.exports = {
  getAllProduct: async (req, res, next) => {
    try {
      const { pageNumber, limit } = req.query;
      const data = await productServices.getAllProduct(pageNumber, limit);
      res.status(200).json({
        status: 200,
        message: 'get product with pagination success',
        data,
      });
    } catch (err) {
      next(err);
    }
  },

  getDetailProduct: async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await productServices.getProductById(id);
      res.status(200).json({
        status: 200,
        message: 'get detail product success',
        data,
      });
    } catch (err) {
      next(err);
    }
  },

  createProduct: async (req, res, next) => {
    try {
      const newProduct = ({
        categoryId,
        productName,
        registrationNumber,
        dosageForm,
        productContent,
        chemicalName,
        chemicalCode,
        packingSpecification,
        barCode,
        sellUnit,
        inputUnit,
        productFunction,
        productImage,
        note,
      } = req.body);
      const data = await productServices.createProduct(newProduct);
      res.status(201).json({
        status: 201,
        message: 'create new product success',
        data,
      });
    } catch (err) {
      next(err);
    }
  },

  updateProduct: async (req, res, next) => {
    try {
      const { id } = req.params;
      const newProduct = ({
        categoryId,
        productName,
        registrationNumber,
        dosageForm,
        productContent,
        chemicalName,
        chemicalCode,
        packingSpecification,
        barCode,
        sellUnit,
        inputUnit,
        productFunction,
        productImage,
        note,
      } = req.body);
      const data = await productServices.updateProductById(id, newProduct);
      res.status(200).json({
        status: 200,
        message: 'update a product success',
        data,
      });
    } catch (err) {
      next(err);
    }
  },

  deleteProduct: async (req, res, next) => {
    try {
      const { id } = req.params;
      //!!! handle delete all reference before delete this product
    } catch (err) {
      next(err);
    }
  },
};