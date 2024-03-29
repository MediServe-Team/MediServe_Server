const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicine.controller');

//* [GET] /medicines/filter-stock?searchValue=""
router.get('/filter-stock', medicineController.filterMedicineInStock);

//* [GET] /medicines/filter?searchValue=""
router.get('/filter', medicineController.filterMedicines);

//* [GET] /medicines/by-category/:categoryId
router.get('/by-category/:categoryId', medicineController.getMedicineByCategory);

//* [GET] /medicines/all    -> get all medicine
router.get('/all', medicineController.getAllMedicine);

//* [GET] /medicines/:id    -> get a medicine
router.get('/:id', medicineController.getDetailMedicine);

//* [POST] /medicines/create    -> create new medicine in system
router.post('/create', medicineController.createMedicine);

//* [PUT] /medicines/update/:id    ->  Edit medicine infomation
router.put('/update/:id', medicineController.updateMedicine);

//* [DELETE] /medicines/delete/:id      -> Delete a medicine in system
router.delete('/delete/:id', medicineController.deleteMedicine);

module.exports = router;
