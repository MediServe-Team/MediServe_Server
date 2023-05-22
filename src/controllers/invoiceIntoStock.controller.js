const invoiceIntoStockServices = require('../services/invoiceIntoStock.services');

module.exports = {
  getInvoiceByDate: async (req, res, next) => {
    try {
      const { from, to, sort } = req.query;
      const data = await invoiceIntoStockServices.getInvoiceByDate(from, to, sort);
      res.status(200).json({
        status: 200,
        message: `get total invoice from ${from} to ${to} success`,
        data,
      });
    } catch (err) {
      next(err);
    }
  },
};
