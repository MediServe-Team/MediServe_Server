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

  filterProduct: async (req, res, next) => {
    try {
      const { search, categoryId } = req.query;
      const data = await invoiceIntoStockServices.filterProduct(search, categoryId);
      res.status(200).json({
        status: 200,
        message: 'filter product success',
        data,
      });
    } catch (err) {
      next(err);
    }
  },

  getDetailInvoice: async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await invoiceIntoStockServices.getInvoiceById(id);
      res.status(200).json({
        status: 200,
        message: 'get an invoice success',
        data,
      });
    } catch (err) {
      next(err);
    }
  },

  //!!! handle create invoice + create medicine, product into stock with reference: reuse services "create" of medicine, pproduct
  createInvoice: async (req, res, next) => {
    try {
      const {} = req.body;
      // const newInvoice = {}
      // handle create here
    } catch (err) {
      next(err);
    }
  },

  //!!! handle delete all reference before delete invoice
  deleteInvoice: async (req, res, next) => {
    try {
      const { id } = req.params;
      //   handle delete here
    } catch (err) {
      next(err);
    }
  },

  //!!! handle when delete item(medicine/product) of invoice then update invoice
  editInvoice: async (req, res, next) => {
    try {
      //   const { id } = req.params;
      //   const {} = req.body;
    } catch (err) {
      next(err);
    }
  },
};
