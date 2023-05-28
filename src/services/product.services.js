const { prisma } = require('../config/prisma.instance');
const createError = require('http-errors');

module.exports = {
  getAllProduct: async (pageNumber, limit) => {
    try {
      if (!pageNumber || !limit) {
        throw createError.ExpectationFailed('Expected "pageNumber" and "limit" in request');
      }
      const skip = (Number(pageNumber) - 1) * Number(limit);
      let getProducts = () => {
        return new Promise(async (resolve) => {
          const products = await prisma.product.findMany({ skip: Number(skip), take: Number(limit) });
          resolve(products);
        });
      };
      let countTotalProduct = () => {
        return new Promise(async (resolve) => {
          const totalProducs = await prisma.product.count();
          resolve(totalProducs);
        });
      };
      const data = await Promise.all([getProducts(), countTotalProduct()]);

      return Promise.resolve({ products: data[0], currentPage: pageNumber, totalPage: Math.ceil(data[1] / limit) });
    } catch (err) {
      throw err;
    }
  },

  getProductById: async (id) => {
    try {
      const data = await prisma.product.findUnique({ where: { id: Number(id) } });
      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },

  createProduct: async (newProduct) => {
    try {
      const data = await prisma.product.create({ data: newProduct });
      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },

  updateProductById: async (id, newProduct) => {
    try {
      const data = await prisma.product.update({ data: newProduct, where: { id: Number(id) } });
      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },
};
