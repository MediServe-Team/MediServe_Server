const { prisma } = require('../config/prisma.instance.js');
const createError = require('http-errors');

module.exports = {
  getAllUnitOfMedicine: async (type) => {
    try {
      let data;
      if (type === 'all') {
        data = await prisma.medicineUnit.findMany();
      } else {
        data = await prisma.medicineUnit.findMany({ where: { type: { equals: type } } });
      }
      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },

  createNewMedicineUnit: async (newUnit) => {
    try {
      // check type of unit
      if (!newUnit.type || !['import', 'sell'].includes(newUnit.type)) {
        throw createError.ExpectationFailed('expected value of type in [import, sell]');
      }
      const data = await prisma.medicineUnit.create({ data: newUnit });
      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },

  deleteMedicineUnitById: async (id) => {
    try {
      const data = await prisma.medicineUnit.delete({ where: { id: Number(id) } });
    } catch (err) {
      throw err;
    }
  },
};
