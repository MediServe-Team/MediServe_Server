const { prisma } = require('../config/prisma.instance.js');
const createError = require('http-errors');

module.exports = {
  getAllUnit: async () => {
    try {
      const data = await prisma.unit.findMany();
      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },

  createNewUnit: async (newUnit) => {
    try {
      const data = await prisma.unit.create({ data: newUnit });
      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },

  deleteUnitById: async (id) => {
    try {
      const data = await prisma.unit.delete({ where: { id: Number(id) } });
      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },
};
