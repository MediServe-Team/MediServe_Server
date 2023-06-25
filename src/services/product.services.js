const { prisma } = require('../config/prisma.instance');
const createError = require('http-errors');

module.exports = {
  getProductByCategory: async (categoryId, pageNumber, limit, searchValue = '') => {
    try {
      if (!categoryId) {
        throw createError.ExpectationFailed('expected categoryId in request.');
      }
      let data;
      let totalRows;
      const skip = pageNumber && limit ? (Number(pageNumber) - 1) * Number(limit) : undefined;
      const searchCondition = [
        { productName: { contains: searchValue, mode: 'insensitive' } },
        { packingSpecification: { contains: searchValue, mode: 'insensitive' } },
      ];

      switch (categoryId) {
        case 'all':
          data = await prisma.product.findMany({
            where: {
              OR: [...searchCondition],
            },
            skip,
            take: Number(limit),
          });
          totalRows = await prisma.product.count({ where: { OR: [...searchCondition] } });
          break;

        default:
          data = await prisma.product.findMany({
            where: {
              category: { id: Number(categoryId) },
              OR: [...searchCondition],
            },
            skip,
            take: Number(limit),
          });
          totalRows = await prisma.product.count({
            where: { category: { id: Number(categoryId) }, OR: [...searchCondition] },
          });
          break;
      }

      return Promise.resolve({ products: data, totalPage: Math.ceil(totalRows / limit), currentpage: pageNumber });
    } catch (err) {
      throw err;
    }
  },

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
          const totalProducts = await prisma.product.count();
          resolve(totalProducts);
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
