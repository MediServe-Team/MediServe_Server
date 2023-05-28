const medicineServices = require('../services/medicine.services');

module.exports = {
  getDetailMedicine: async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await medicineServices.getMedicineById();
      res.status(200).json({
        status: 200,
        message: 'get detail medicine success',
        data,
      });
    } catch (err) {
      next(err);
    }
  },

  getAllMedicine: async (req, res, next) => {
    try {
      const data = await medicineServices.getAllMedicine();
      res.status(200).json({
        status: 200,
        message: 'get all medicine success',
        data,
      });
    } catch (err) {
      throw err;
    }
  },

  createMedicine: async (req, res, next) => {
    try {
      const {
        categoryId,
        medicineName,
        registrationNumber,
        dosageForm,
        productContent,
        chemicalName,
        chemicalCode,
        packingSpecification,
        barCode,
        sellUnit,
        inputUnit,
        applyToAffectedAreaCode,
        applyToAffectedArea,
        medicineFunction,
        medicineImage,
        isPrescription,
        note,
      } = req.body;
      const newMedicine = {
        categoryId,
        medicineName,
        registrationNumber,
        dosageForm,
        productContent,
        chemicalName,
        chemicalCode,
        packingSpecification,
        barCode,
        sellUnit,
        inputUnit,
        applyToAffectedAreaCode,
        applyToAffectedArea,
        medicineFunction,
        medicineImage,
        isPrescription,
        note,
      };

      const returnData = await medicineServices.createMedicine(newData);
      res.status(201).json({
        status: 201,
        message: 'create new medicine success',
        data: returnData,
      });
    } catch (err) {
      next(err);
    }
  },

  updateMedicine: async (req, res, next) => {
    try {
      const { id } = req.params;
      const {
        categoryId,
        medicineName,
        registrationNumber,
        dosageForm,
        productContent,
        chemicalName,
        chemicalCode,
        packingSpecification,
        barCode,
        sellUnit,
        inputUnit,
        applyToAffectedAreaCode,
        applyToAffectedArea,
        medicineFunction,
        medicineImage,
        isPrescription,
        note,
      } = req.body;
      const newMedicine = {
        categoryId,
        medicineName,
        registrationNumber,
        dosageForm,
        productContent,
        chemicalName,
        chemicalCode,
        packingSpecification,
        barCode,
        sellUnit,
        inputUnit,
        applyToAffectedAreaCode,
        applyToAffectedArea,
        medicineFunction,
        medicineImage,
        isPrescription,
        note,
      };
      const returnData = await medicineServices.updateMedicineById(id, newMedicine);
    } catch (err) {
      next(err);
    }
  },

  //!!! handle reference before delete medicine
  deleteMedicine: async (req, res, next) => {
    try {
      //   const { id } = req.params;
    } catch (err) {
      next(err);
    }
  },
};