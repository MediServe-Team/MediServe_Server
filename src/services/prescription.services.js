const { prisma } = require('../config/prisma.instance');

module.exports = {
  filterPrescription: async (searchValue) => {
    try {
      const data = await prisma.prescription.findMany({
        where: {
          diagnose: { contains: searchValue, mode: 'insensitive' },
        },
      });
      return data;
    } catch (err) {
      throw err;
    }
  },

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

  createNewPrescription: async (newPrescription, listMedicines) => {
    try {
      const prescriptionSaved = await prisma.prescription.create({
        data: newPrescription,
      });
      listGuide = listMedicines.map((guide) => ({
        medicineId: Number(guide?.medicineId),
        prescriptionId: Number(prescriptionSaved.id),
        morning: Number(guide?.morning),
        noon: Number(guide?.noon),
        night: Number(guide?.night),
        quantity: Number(guide?.quantity),
      }));
      const newGuide = await prisma.medicineGuide.createMany({ data: listGuide });
      return Promise.resolve({ newPrescription: prescriptionSaved, newGuide });
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
