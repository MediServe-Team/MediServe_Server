const { prisma } = require('../config/prisma.instance.js');
const { passwordValidate } = require('../helpers/validation.js');
const createError = require('http-errors');
const bcrypt = require('bcrypt');

module.exports = {
  getUserInfo: async (id) => {
    try {
      const data = await prisma.user.findUnique({
        where: {
          id,
        },
      });
      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },

  getAllUser: async () => {
    try {
      const data = await prisma.user.findMany();
      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },

  editUserById: async (id, newUserInfo) => {
    try {
      const data = await prisma.user.update({
        data: newUserInfo,
        where: {
          id,
        },
      });
      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },

  deleteUserById: async (id) => {
    try {
      const returnData = await prisma.user.delete({
        where: {
          id,
        },
      });
      return Promise.resolve(returnData);
    } catch (err) {
      throw err;
    }
  },

  updatePassWordById: async (id, currPassword, newPassword) => {
    try {
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
      const returnData = await prisma.user.update({
        data: {
          password: hashNewPass,
        },
        where: {
          id,
        },
      });
      return Promise.resolve(returnData);
    } catch (err) {
      throw err;
    }
  },

  updateRoleById: async (id, role) => {
    try {
      const data = await prisma.user.update({
        data: {
          role,
        },
        where: {
          id,
        },
      });
      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },

  updatePermitById: async (id, permitList) => {
    try {
      const returnData = await prisma.user.update({
        data: {
          permitList,
        },
        where: {
          id,
        },
      });
      return Promise.resolve(returnData);
    } catch (err) {
      throw err;
    }
  },
};
