const express = require('express');
const prescriptionController = require('../controllers/prescription.controller');
const router = express.Router();

//* [GET] /prescriptions/filter?searchValue=""
router.get('/filter', prescriptionController.filterPrescription);

//* [GET] /prescriptions/all    -> Get all precriptions
router.get('/all', prescriptionController.getaAllPrescription);

//* [GET] /prescriptions/detail/:id     -> Get detail a prescription
router.get('/detail/:id', prescriptionController.getDetailPrescription);

//* [POST] /prescriptions/create    -> Create new prescription
router.post('/create', prescriptionController.createPrescription);

//* [PUT] /prescriptions/update/:id     -> Update a prescription
router.put('/update/:id', prescriptionController.updatePrescription);

//* [DELETE] /prescriptions/delete/:id  -> Delete a prescription
router.delete('/delete/:id', prescriptionController.deletePrescription);
module.exports = router;
