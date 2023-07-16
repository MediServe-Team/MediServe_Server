const { prisma } = require('../config/prisma.instance.js');
const { storeImg, removeImg } = require('../helpers/cloudinary.js');

module.exports = {
  getUserById: async (id) => {
    try {
      const data = await prisma.user.findUnique({ where: { id } });
      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },

  updateProfileById: async (id, dataUpdate) => {
    try {
      const { avatar } = dataUpdate;
      if (avatar) {
        const beforeData = await prisma.user.findFirst({ where: { id }, select: { avatar: true } });

        if (avatar !== beforeData?.avatar) {
          if (beforeData?.avatar) {
            try {
              removeImg(beforeData.avatar);
            } catch (err) {
              return;
            }
          }
          // store new img
          const imgURL = await storeImg(avatar);
          dataUpdate.avatar = imgURL.url;
        }
      }
      const returnData = await prisma.user.update({
        data: dataUpdate,
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
