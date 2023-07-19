const userServices = require('../services/user.services.js');

module.exports = {
  createAccount: async (req, res, next) => {
    try {
      const { email, name, fullName, address, age, dateOfBirth, phoneNumber, role } = req.body;
      const newData = { email, name, fullName, address, age, dateOfBirth, phoneNumber, role };
      const data = await userServices.createAccount(newData);
      res.status(201).json({
        status: 201,
        message: 'create new account success!',
        data,
      });
    } catch (err) {
      next(err);
    }
  },

  filterCustomer: async (req, res, next) => {
    try {
      const { searchValue } = req.query;
      const data = await userServices.filterCustomer(searchValue);
      res.status(200).json({
        status: 200,
        message: 'filter customer success',
        data,
      });
    } catch (err) {
      next(err);
    }
  },

  getUser: async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await userServices.getUserInfo(id);
      res.status(200).json({
        status: 200,
        message: 'get user infomation success',
        data,
      });
    } catch (err) {
      next(err);
    }
  },

  getAllUser: async (req, res, next) => {
    try {
      const data = await userServices.getAllUser();
      res.status(200).json({
        status: 200,
        message: 'get all user success',
        data,
      });
    } catch (err) {
      next(err);
    }
  },

  editUser: async (req, res, next) => {
    try {
      const { id } = req.params;
      const {
        name,
        fullName,
        gender,
        age,
        dateOfBirth,
        phoneNumber,
        avatar,
        address,
        discount,
        certificate,
        identityCard,
        numOfPPC,
        permitList,
      } = req.body;

      const newUserInfo = {
        name,
        fullName,
        gender,
        age,
        dateOfBirth,
        phoneNumber,
        avatar,
        address,
        discount,
        certificate,
        identityCard,
        numOfPPC,
        permitList,
      };
      const data = await userServices.editUserById(id, newUserInfo);

      res.status(200).json({
        status: 200,
        message: 'updated user infomation success',
        data,
      });
    } catch (err) {
      next(err);
    }
  },

  //!!! handle case reference when delete
  deleteUser: async (req, res, next) => {
    try {
      const { id } = req.params;
      const deleteUser = await userServices.deleteUserById(id);
      res.status(200).json({
        status: 200,
        message: 'deleted user success',
        data: deleteUser,
      });
    } catch (err) {
      next(err);
    }
  },

  changePass: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { currPassword, newPassword } = req.body;
      const returnData = await userServices.updatePassWordById(id, currPassword, newPassword);
      res.status(200).json({
        status: 200,
        message: 'update password success',
        data: returnData,
      });
    } catch (err) {
      next(err);
    }
  },

  changeRole: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { role } = req.body;
      const returnData = await userServices.updateRoleById(id, role);
      res.status(200).json({
        status: 200,
        message: 'update role for account success',
        data: returnData,
      });
    } catch (err) {
      next(err);
    }
  },

  //!!! shoule check exists of each permit in list
  changePermit: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { permitList } = req.body;
      const returnData = await userServices.updatePermitById(id, permitList);
      res.status(200).json({
        status: 200,
        message: 'update permit for account success',
        data: returnData,
      });
    } catch (err) {
      next(err);
    }
  },
};
