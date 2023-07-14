const { prisma } = require('../config/prisma.instance');
const createError = require('http-errors');
const { storeImg, removeImg } = require('../helpers/cloudinary');

module.exports = {
  fiterProduct: async (searchValue) => {
    try {
      let data = await prisma.productIntoStock.findMany({
        where: {
          product: {
            productName: { contains: searchValue, mode: 'insensitive' },
          },
        },
        include: {
          product: {
            select: { id: true, productName: true, sellUnit: true, packingSpecification: true },
          },
        },
      });

      data = data.filter((product) => product.inputQuantity - product.soldQuantity > 0);
      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },

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

  createProduct: async (newData) => {
    try {
      const { productImage, barCode, ...rest } = newData;
      const imgStore = await Promise.all([
        new Promise(async (resolve) => {
          const imgURL = await storeImg(productImage);
          resolve(imgURL);
        }),
        new Promise(async (resolve) => {
          const imgURL = await storeImg(barCode);
          resolve(imgURL);
        }),
      ]);

      const newProduct = { ...rest, productImage: imgStore[0].url, barCode: imgStore[1].url };
      const returnData = await prisma.product.create({
        data: newProduct,
      });

      return Promise.resolve(returnData);
    } catch (err) {
      throw err;
    }
  },

  updateProductById: async (id, newProduct) => {
    try {
      const { barCode, productImage } = newProduct;

      //* check barcode and productImg in product before update
      const productBefore = await prisma.product.findFirst({
        where: { id: Number(id) },
        select: { barCode: true, productImage: true },
      });

      //* update store barcode
      if (barCode) {
        if (barCode !== productBefore.barCode) {
          if (productBefore.barCode) {
            try {
              removeImg(productBefore.barCode);
            } catch (err) {
              return;
            }
          }
          const imgURL = await storeImg(barCode);
          newProduct.barCode = imgURL.url;
        }
      }

      //* update store product Img
      if (productImage) {
        if (productImage !== productBefore.productImage) {
          if (productBefore.productImage) {
            try {
              removeImg(productBefore.productImage);
            } catch (err) {
              return;
            }
          }
          const imgURL = await storeImg(productImage);
          newProduct.productImage = imgURL.url;
        }
      }

      //* update product
      const data = await prisma.product.update({ data: newProduct, where: { id: Number(id) } });
      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },

  deleteProducById: async (id) => {
    try {
      // remove image from cloud
      (async () => {
        const product = await prisma.product.findFirst({
          where: { id: Number(id) },
          select: { productImage: true, barCode: true },
        });
        if (product?.productImage) {
          try {
            removeImg(product.productImage);
          } catch (err) {
            return;
          }
        }
        if (product?.barCode) {
          try {
            removeImg(product.barCode);
          } catch (err) {
            return;
          }
        }
      })();
      // delete product
      const data = await prisma.product.delete({ where: { id: Number(id) } });
      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },
};
