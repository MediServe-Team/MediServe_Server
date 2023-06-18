const { prisma } = require('../config/prisma.instance.js');

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
