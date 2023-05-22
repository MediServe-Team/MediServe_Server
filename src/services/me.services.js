const { prisma } = require('../config/prisma.instance.js');

module.exports = {
  updateProfileById: async (id, dataUpdate) => {
    try {
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
