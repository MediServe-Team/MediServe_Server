const { prisma } = require('../config/prisma.instance.js');
const { passwordValidate } = require('../helpers/validation.js');
const crypto = require('crypto');

const createError = require('http-errors');
const bcrypt = require('bcrypt');

module.exports = {
  createAccount: async (newData) => {
    try {
      const { email, role } = newData;
      //* check email exists
      const isExistEmail = await prisma.user.findUnique({
        where: { email },
      });
      if (isExistEmail) {
        throw createError.Conflict('This is email already exists');
      }

      //* check role and generate password
      if (role === 'STAFF') {
        const generatePassword = crypto.randomBytes(4).toString('hex');
        console.log('generate pass: ', generatePassword);
        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(generatePassword, salt);
        newData.password = hashPassword;
        //!!! send to mail if success
      } else if (role === 'USER') {
        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash('12345678', salt);
        newData.password = hashPassword;
      }

      const data = await prisma.user.create({
        data: newData,
      });

      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },

  filterCustomer: async (searchValue) => {
    try {
      const data = await prisma.user.findMany({
        where: {
          fullName: { contains: searchValue, mode: 'insensitive' },
          role: 'USER',
        },
      });
      return Promise.resolve(data);
    } catch (err) {
      next(err);
    }
  },

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
      const data = await prisma.user.findMany({
        where: {
          role: { notIn: 'ADMIN' },
        },
      });
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
