const { prisma } = require('../config/prisma.instance');
const createError = require('http-errors');

module.exports = {
  getInvoiceByDate: async (from, to, sort) => {
    try {
      if (!from || !to) return null;
      const order =
        sort && (sort.toLowerCase() === 'asc' || sort.toLowerCase() === 'desc') ? sort.toLowerCase() : 'desc';
      // get invoice
      let getTotalInvoiceByDate = () => {
        return new Promise(async (resolve, reject) => {
          const data = await prisma.invoiceIntoStock.findMany({
            where: {
              createdAt: {
                gte: new Date(from),
                lte: new Date(to),
              },
            },
            orderBy: { createdAt: order },
          });
          resolve(data);
        });
      };
      //   count total invoice
      let countTotalInvoice = () => {
        return new Promise(async (resolve, reject) => {
          const totalCount = await prisma.invoiceIntoStock.count({
            where: {
              createdAt: {
                gte: new Date(from),
                lte: new Date(to),
              },
            },
          });
          resolve(totalCount);
        });
      };
      const data = await Promise.all([getTotalInvoiceByDate(), countTotalInvoice()]);
      return Promise.resolve({ listInvoices: data[0], total: data[1] });
    } catch (err) {
      throw err;
    }
  },

  filterProduct: async (search, categoryId) => {
    try {
      if (!search || !categoryId) {
        throw createError.ExpectationFailed('expected "search" and "categoryId" in request!');
      }

      let getProduct = () => {
        return new Promise(async (resolve) => {
          const products = await prisma.product.findMany({
            where: {
              AND: [
                {
                  OR: [{ productName: { contains: search } }, { packingSpecification: { contains: search } }],
                },
                { categoryId: Number(categoryId) },
              ],
            },
          });
          resolve(products);
        });
      };

      let getMedicine = () =>
        new Promise(async (resolve) => {
          const medicines = await prisma.medicine.findMany({
            where: {
              AND: [
                {
                  OR: [{ medicineName: { contains: search } }, { packingSpecification: { contains: search } }],
                },
                { categoryId: Number(categoryId) },
              ],
            },
          });
          resolve(medicines);
        });

      const result = await Promise.all([getMedicine(), getProduct()]);
      const data = result[0].concat(result[1]);

      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },

  getInvoiceById: async (id) => {
    try {
      const data = await prisma.invoiceIntoStock.findUnique({
        where: { id: Number(id) },
      });
      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },
};
