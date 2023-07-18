const receiptServices = require('../services/receipt.services');

module.exports = {
  getReceiptOfUser: async (req, res, next) => {
    try {
      const { userId } = req.params;
      const data = await receiptServices.getReceiptOfUser(userId);
      res.status(200).json({
        status: 200,
        message: 'get all receipt of user success',
        data,
      });
    } catch (err) {
      next(err);
    }
  },

  filterReceipts: async (req, res, next) => {
    try {
      const { staffName, customerName, fromDate, toDate, sort, pageNumber, limit } = req.query;
      const data = await receiptServices.getAllReceiptWithCondition(
        staffName,
        customerName,
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

  createReceipt: async (req, res, next) => {
    try {
      const {
        staffId,
        customerId,
        totalPayment,
        givenByCustomer,
        note,
        guest,
        products,
        medicines,
        // prescriptionAvailbles,
        newPrescriptions,
      } = req.body;

      const newReceipt = {
        staffId,
        totalPayment,
        givenByCustomer,
        note,
      };

      const data = await receiptServices.createReceipt(
        newReceipt,
        guest,
        customerId,
        products,
        medicines,
        // prescriptionAvailbles,
        newPrescriptions,
      );
      res.status(201).json({
        status: 201,
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
