const { prisma } = require('../config/prisma.instance.js');
const { storeImg, removeImg } = require('../helpers/cloudinary.js');
const createError = require('http-errors');

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
      const { avatar, certificate, identityCard } = dataUpdate;
      if (avatar) {
        const beforeData = await prisma.user.findFirst({
          where: { id },
          select: { avatar: true, certificate: true, identityCard: true },
        });

        console.log('~~update info user');

        //* check store avatar
        if (avatar !== beforeData?.avatar) {
          if (beforeData?.avatar) {
            try {
              console.log('~~try remove image');
              console.log(beforeData.avatar);
              await removeImg(beforeData.avatar);
            } catch (err) {
              console.log('~Remove image in cloudinary error!!!');
              throw createError('Remove image in cloud error!');
            }
          }
          // store new img
          const imgURL = await storeImg(avatar);
          dataUpdate.avatar = imgURL.url;
        }

        //* check store certificate
        if (certificate !== beforeData?.certificate) {
          if (beforeData?.certificate) {
            try {
              removeImg(beforeData.certificate);
            } catch (err) {
              return;
            }
          }
          // store new img
          const imgURL = await storeImg(certificate);
          dataUpdate.certificate = imgURL.url;
        }

        //* check store identityCard
        if (identityCard !== beforeData?.identityCard) {
          if (beforeData?.identityCard) {
            try {
              removeImg(beforeData.identityCard);
            } catch (err) {
              return;
            }
          }
          // store new img
          const imgURL = await storeImg(identityCard);
          dataUpdate.identityCard = imgURL.url;
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
