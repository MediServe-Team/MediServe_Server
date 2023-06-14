const invoiceIntoStockServices = require('../services/invoiceIntoStock.services');

module.exports = {
  getMerchandiseInventory: async (req, res, next) => {
    try {
      const data = await invoiceIntoStockServices.getMerchandiseInventory();
      res.status(200).json({
        status: 200,
        message: 'get data inventory stock success',
        data,
      });
    } catch (err) {
      next(err);
    }
  },

  filterHistory: async (req, res, next) => {
    try {
      const { fromDate, toDate, sort, pageNumber, limit } = req.query;
      const data = await invoiceIntoStockServices.filterHistory(fromDate, toDate, sort, pageNumber, limit);
      res.status(200).json({
        status: 200,
        message: 'filter history invoice into stock success',
        data,
      });
    } catch (err) {
      next(err);
    }
  },

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
      const { staffId, totalImportPrice, totalSellPrice, note, listItem } = req.body;
      const newInvoice = { staffId, totalImportPrice, totalSellPrice, note };
      const listProducts = Array.isArray(listItem) ? listItem.filter((item) => item.isMedicine === false) : [];
      const listMedicines = Array.isArray(listItem) ? listItem.filter((item) => item.isMedicine === true) : [];
      const data = await invoiceIntoStockServices.createNewInvoice(newInvoice, listProducts, listMedicines);
      res.status(200).json({
        status: 200,
        message: 'create new invoice success',
        data,
      });
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
