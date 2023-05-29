const prescriptionServices = require('../services/prescription.services');

module.exports = {
  getaAllPrescription: async (req, res, next) => {
    try {
      const data = await prescriptionServices.getAllPrescription();
      res.status(200).json({
        status: 200,
        message: 'get all prescription success',
        data,
      });
    } catch (err) {
      next(err);
    }
  },

  getDetailPrescription: async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await prescriptionServices.getPresciptionById(id);
      res.status(200).json({
        status: 200,
        message: 'get a prescription success',
        data,
      });
    } catch (err) {
      next(err);
    }
  },

  //!!! handle create with medicine_guide and calc total price
  createPrescription: async (req, res, next) => {
    try {
      const newPrescription = ({ staffId, receiptId, diagnose, isDose, totalPrice, note } = req.body);
      const data = await prescriptionServices.createNewPrescription(newPrescription);
      res.status(201).json({
        status: 201,
        message: 'create new prescription success',
        data,
      });
    } catch (err) {
      next(err);
    }
  },

  //!!! hanlde update with medicine_guide and reCalc total price
  updatePrescription: async (req, res, next) => {
    try {
      const { id } = req.params;
      const newPrescription = ({ diagnose, note } = req.body);
      const data = await prescriptionServices.updatePrescription(id, newPrescription);
      res.status(200).json({
        status: 200,
        message: 'update a prescription success',
        data,
      });
    } catch (err) {
      next(err);
    }
  },

  //!!! handle delete all reference
  deletePrescription: async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await prescriptionServices.deletePrescription(id);
      res.status(200).json({
        status: 200,
        message: 'Delete a prescription success',
        data,
      });
    } catch (err) {
      next(err);
    }
  },
};
