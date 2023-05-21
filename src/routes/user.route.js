const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

//! verify ADMIN
//* [GET] /users/all     -> Get all user
router.get('/all', userController.getAllUser);

//! verify ADMIN
//* [GET] /users/:id     -> Get an user
router.get('/:id', userController.getUser);

//! verify ADMIN
//* [PUT] /users/update-info/:id     -> Edit an user
// router.put('/update-info/:id', userController.editUser);

//! verify ADMIN
//* [DELETE] /users/:id      -> Delete an user
router.delete('/:id', userController.deleteUser);

//! verify AccessToken
//* [PUT] /users/change-pass/:id    -> Change password
// router.put('/change-pass/:id', userController.changePass);

//! verify ADMIN
//* [PUT] /users/change-role/:id    -> Change role
router.put('/change-role/:id', userController.changeRole);

//! verify ADMIN
// *change permit
router.put('/change-permit/:id', userController.changePermit);

module.exports = router;
