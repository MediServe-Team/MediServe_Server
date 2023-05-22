const meServices = require('../services/me.services.js');

module.exports = {
  updateInfo: async (req, res, next) => {
    try {
      const { userId } = req.payload;
      const {
        name,
        fullName,
        gender,
        age,
        dateOfBirth,
        phoneNumber,
        avatar,
        address,
        certificate,
        identityCard,
        numOfPPC,
      } = req.body;

      const dataUpdate = {
        name,
        fullName,
        gender,
        age,
        dateOfBirth,
        phoneNumber,
        avatar,
        address,
        certificate,
        identityCard,
        numOfPPC,
      };

      const returnData = await meServices.updateProfileById(userId, dataUpdate);
      res.status(200).json({
        status: 200,
        message: 'update profile success',
        data: returnData,
      });
    } catch (err) {
      next(err);
    }
  },
};
