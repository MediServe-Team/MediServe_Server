const express = require('express');
const medicineUnitController = require('../controllers/medicineUnit.controller.js');
const router = express.Router();

//* [GET] /medicine-units/all   -> Get all unit of medicine
router.get('/all', medicineUnitController.getAllUnit);

//* [POST] /medicine-units/create   -> Create new medicine unit
router.post('/create', medicineUnitController.createNewUnit);

//* [DELETE] /medicine-units/delete/:id     -> Delete an unit of medicine
router.delete('/delete/:id', medicineUnitController.deleteUnit);

module.exports = router;
