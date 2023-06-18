const { prisma } = require('../config/prisma.instance');

module.exports = {
  getAllPrescription: async () => {
    try {
      const data = await prisma.prescription.findMany();
      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },

  getPresciptionById: async (id) => {
    try {
      const data = await prisma.prescription.findUnique({ where: { id: Number(id) } });
      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },

  createNewPrescription: async (newPrescription) => {
    try {
      const data = await prisma.prescription.create({ data: newPrescription });
      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },

  updatePrescription: async (id, newPrescription) => {
    try {
      const data = await prisma.prescription.update({ data: newPrescription, where: { id: Number(id) } });
      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },

  deletePrescription: async (id) => {
    try {
      const data = await prisma.prescription.delete({ where: { id: Number(id) } });
      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },
};
