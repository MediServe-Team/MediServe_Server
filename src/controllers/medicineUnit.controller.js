const medicineUnitServices = require('../services/medicineUnit.services.js');

module.exports = {
  getAllUnitOfMedicine: async (req, res, next) => {
    try {
      const { type } = req.query;
      const checkType = ['import', 'sell'].includes(type) ? type : 'all';
      const data = await medicineUnitServices.getAllUnitOfMedicine(checkType);
      res.status(200).json({
        status: 200,
        message: 'get list of unit success',
        data,
      });
    } catch (err) {
      next(err);
    }
  },

  createNewMedicineUnit: async (req, res, next) => {
    try {
      const { type, unitName } = req.body;
      const newUnit = { type, unitName };
      const data = await medicineUnitServices.createNewMedicineUnit(newUnit);
      res.status(201).json({
        status: 201,
        message: 'create new unit of medicine success',
        data,
      });
    } catch (err) {
      next(err);
    }
  },

  deleteMedicineUnit: async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await medicineUnitServices.deleteMedicineUnitById(id);
      res.status(200).json({
        status: 200,
        message: 'delete an unit of medicine success',
        data,
      });
    } catch (err) {
      next(err);
    }
  },
};
