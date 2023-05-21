const createError = require('http-errors');
const { prisma } = require('.././config/prisma.instance');

module.exports = {
  create: async (req, res, next) => {
    try {
      const { staffId, totalImportPrice, totalSellPrice } = req.body;

      const saveInvoice = { staffId, totalImportPrice, totalSellPrice };

      const data = await prisma.InvoiceIntoStock.create({ data: saveInvoice });

      res.status(201).json({
        status: 201,
        data,
      });
    } catch (err) {
      next(err);
    }
  },

  get: async (req, res, next) => {
    try {
      const data = await prisma.User.findUnique({
        where: {
          id: 'a92b0a4d-ff10-438b-9924-a0dd0a6ce2d7',
        },
        include: {
          invoiceIntoStocks: true,
        },
      });
      res.status(200).json({
        status: 200,
        data,
      });
    } catch (err) {
      next(err);
    }
  },
};
