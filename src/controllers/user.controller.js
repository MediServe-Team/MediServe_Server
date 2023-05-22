const { prisma } = require('../config/prisma.instance.js');
const { passwordValidate } = require('../helpers/validation.js');
const createError = require('http-errors');
const bcrypt = require('bcrypt');

module.exports = {
  getUser: async (req, res, next) => {
    try {
      const { id } = req.params;

      const data = await prisma.user.findUnique({
        where: {
          id,
        },
      });

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
      const data = await prisma.user.findMany();

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
      };

      const data = await prisma.user.update({
        data: newUserInfo,
        where: {
          id,
        },
      });

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
      const deleteUser = await prisma.user.delete({
        where: {
          id,
        },
      });
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

      if (currPassword === newPassword) {
        throw createError.Conflict('The new password is the same as the old password');
      }

      //*   validate new password
      const { error } = passwordValidate(newPassword);
      if (error) {
        throw createError(error.details[0].message);
      }

      //* hash new password
      const salt = await bcrypt.genSalt(10);
      const hashNewPass = await bcrypt.hash(newPassword, salt);

      //* update new password
      const data = await prisma.user.update({
        data: {
          password: hashNewPass,
        },
        where: {
          id,
        },
      });

      res.status(200).json({
        status: 200,
        message: 'update password success',
        data,
      });
    } catch (err) {
      next(err);
    }
  },

  changeRole: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { role } = req.body;

      const data = await prisma.user.update({
        data: {
          role,
        },
        where: {
          id,
        },
      });

      res.status(200).json({
        status: 200,
        message: 'update role for account success',
        data,
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

      const data = await prisma.user.update({
        data: {
          permitList,
        },
        where: {
          id,
        },
      });

      res.status(200).json({
        status: 200,
        message: 'update permit for account success',
        data,
      });
    } catch (err) {
      next(err);
    }
  },
};
