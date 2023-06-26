const medicineUnitServices = require('../services/medicineUnit.services.js');

module.exports = {
  getAllUnit: async (req, res, next) => {
    try {
      const data = await medicineUnitServices.getAllUnit();
      res.status(200).json({
        status: 200,
        message: 'get list of unit success',
        data,
      });
    } catch (err) {
      next(err);
    }
  },

  createNewUnit: async (req, res, next) => {
    try {
      const { unitName } = req.body;
      const newUnit = { unitName };
      const data = await medicineUnitServices.createNewUnit(newUnit);
      res.status(201).json({
        status: 201,
        message: 'create new unit of medicine success',
        data,
      });
    } catch (err) {
      next(err);
    }
  },

  deleteUnit: async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await medicineUnitServices.deleteUnitById(id);
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
