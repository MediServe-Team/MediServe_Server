const { prisma } = require('../config/prisma.instance');

module.exports = {
  getMedicineById: async (id) => {
    try {
      const data = await prisma.medicine.findUnique({ where: { id } });
      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },

  getAllMedicine: async () => {
    try {
      const data = await prisma.medicine.findMany();
      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },

  createMedicine: async (newData) => {
    try {
      const returnData = await prisma.medicine.create({ data: newData });
      return Promise.resolve(returnData);
    } catch (err) {
      throw err;
    }
  },

  updateMedicineById: async (id, newData) => {
    try {
      const returnData = await prisma.medicine.update({ data: newData, where: { id } });
      return Promise.resolve(returnData);
    } catch (err) {
      throw err;
    }
  },
};
