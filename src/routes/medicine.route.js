const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicine.controller');

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

//!!!   handle sắp hết hàng, sắp hết hạn, sắp đến hạn.

module.exports = router;
