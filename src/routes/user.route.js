const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyStaffAdminAccess, verifyAdminAccess, verifyAccessToken } = require('../helpers/jwt.service');

//* [GET] /users/filter-customer?SearchValue=""   -> filter customer
router.get('/filter-customer', userController.filterCustomer);

//! can use: ADMIN
//* [GET] /users/all     -> Get all user
router.get('/all', verifyAccessToken, verifyAdminAccess, userController.getAllUser);

//! can use: ADMIN
//* [GET] /users/:id     -> Get an user by id
router.get('/:id', verifyAccessToken, verifyAdminAccess, userController.getUser);

//! can use: ADMIN
//* [PUT] /users/update-info/:id     -> Edit an user by id
router.put('/update-user-info/:id', verifyAccessToken, verifyAdminAccess, userController.editUser);

//! verify ADMIN
//* [DELETE] /users/:id      -> Delete an user by id
router.delete('/:id', verifyAccessToken, verifyAdminAccess, userController.deleteUser);

//! can use: ADMIN
//* [PUT] /users/change-pass/:id    -> Change password of user by id
router.put('/change-pass/:id', verifyAccessToken, verifyAdminAccess, userController.changePass);

//! can use: ADMIN
//* [PUT] /users/change-role/:id    -> Change role  of user by id
router.put('/change-role/:id', verifyAccessToken, verifyAdminAccess, userController.changeRole);

//! can use: ADMIN
//* [PUT] /users/change-permit/:id      -> Change list permit of staff by id
router.put('/change-permit/:id', verifyAccessToken, verifyAdminAccess, userController.changePermit);

//! can use: ADMIN
//* [POST] /users/create      -> create new Account
router.post('/create', verifyAccessToken, verifyAdminAccess, userController.createAccount);

module.exports = router;
