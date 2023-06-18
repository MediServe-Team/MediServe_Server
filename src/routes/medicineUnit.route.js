const express = require('express');
const medicineUnitController = require('../controllers/medicineUnit.controller.js');
const router = express.Router();

//* [GET] /medicine-units/all?type=""   -> Get all import/sell unit of medicine
router.get('/all', medicineUnitController.getAllUnitOfMedicine);

//* [POST] /medicine-units/create   -> Create new medicine unit
router.post('/create', medicineUnitController.createNewMedicineUnit);

//* [DELETE] /medicine-units/delete/:id     -> Delete an unit of medicine
router.delete('/delete/:id', medicineUnitController.deleteMedicineUnit);

module.exports = router;
