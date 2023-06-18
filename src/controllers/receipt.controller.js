const receiptServices = require('../services/receipt.services');

module.exports = {
  filterReceipts: async (req, res, next) => {
    try {
      const { staffId, customerId, fromDate, toDate, sort, pageNumber, limit } = req.query;
      const data = await receiptServices.getAllReceiptWithCondition(
        staffId,
        customerId,
        fromDate,
        toDate,
        sort,
        pageNumber,
        limit,
      );
      res.status(200).json({
        status: 200,
        message: 'filter receipt success',
        data,
      });
    } catch (err) {
      next(err);
    }
  },

  getDetailReceipt: async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await receiptServices.getReceiptById(id);
      res.status(200).json({
        status: 200,
        message: 'get detail receipt success',
        data,
      });
    } catch (err) {
      next(err);
    }
  },

  //!!! handle create receipt: from data about "receipt detail", "prescription"
  createReceipt: async (req, res, next) => {
    try {
      const newReceipt = ({ staffId, customerId, totalPayment, givenByCustomer, note } = req.body);
      const data = await receiptServices.createReceipt(newReceipt);
      res.status(201).json({
        status: 200,
        message: 'create new receipt success',
        data,
      });
    } catch (err) {
      next(err);
    }
  },

  updateReceipt: async (req, res, next) => {
    try {
      //!!! handle update receipt: from data about "receipt detail", "prescription"
    } catch (err) {
      next(err);
    }
  },

  deleteReceipt: async (req, res, next) => {
    try {
      //!!! handle delete with reference
    } catch (err) {
      next(err);
    }
  },
};
