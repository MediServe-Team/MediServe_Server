const { prisma } = require('../config/prisma.instance');

module.exports = {
  getAllCategory: async () => {
    try {
      const data = await prisma.category.findMany();
      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },

  getCategoryById: async (id) => {
    try {
      const data = await prisma.category.findUnique({
        where: { id },
      });
      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },

  createCategory: async (newData) => {
    try {
      const returnData = await prisma.category.create({
        data: newData,
      });
      return Promise.resolve(returnData);
    } catch (err) {
      throw err;
    }
  },

  updateCategoryById: async (id, newData) => {
    try {
      // check category diffrence default type
      const categoryData = await prisma.category.findUnique({ where: { id } });
      if (categoryData.isDefault === true) {
        //! cant update
      }
    } catch (err) {
      throw err;
    }
  },
};
