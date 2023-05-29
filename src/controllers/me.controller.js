const meServices = require('../services/me.services.js');

module.exports = {
  getProfile: async (req, res, next) => {
    try {
      const { userId } = req.payload;
      const data = await meServices.getUserById(userId);
      res.status(200).json({
        status: 200,
        messagae: 'get profile success',
        data,
      });
    } catch (err) {
      next(err);
    }
  },

  updateInfo: async (req, res, next) => {
    try {
      const { userId } = req.payload;
      const dataUpdate = ({
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
      } = req.body);

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
