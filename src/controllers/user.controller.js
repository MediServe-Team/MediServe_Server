const { prisma } = require('../config/prisma.instance.js');

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

  deleteUser: async (req, res, next) => {
    try {
      //   const { id } = req.params;
      //   const deleteUser = await prisma.user.delete({
      //     where: {
      //       id,
      //     },
      //   });
      //   res.status(200).json({
      //     status: 200,
      //     message: 'deleted user success',
      //     data: deleteUser,
      //   });
    } catch (err) {
      next(err);
    }
  },

  changePass: async (req, res, next) => {
    try {
      // handle
    } catch (err) {
      next(err);
    }
  },

  changeRole: async (req, res, next) => {
    try {
      // handle
    } catch (err) {
      next(err);
    }
  },

  changePermit: async (req, res, next) => {
    try {
      // handle
    } catch (err) {
      next(err);
    }
  },
};
