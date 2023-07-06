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
      const data = await prisma.prescription.findUnique({
        where: { id: Number(id) },
        include: {
          MedicineGuides: {
            include: {
              medicine: {
                select: {
                  medicineName: true,
                  packingSpecification: true,
                  sellUnit: true,
                },
              },
            },
          },
        },
      });
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
        totalPrice: Number(guide?.totalPrice),
      }));
      const newGuide = await prisma.medicineGuide.createMany({ data: listGuide });
      return Promise.resolve({ newPrescription: prescriptionSaved, newGuide });
    } catch (err) {
      throw err;
    }
  },

  updatePrescription: async (id, newPrescription, listMedicines) => {
    try {
      // get list mediciguide before update
      const guideBefores = await prisma.medicineGuide.findMany({
        where: {
          prescriptionId: Number(id),
        },
        select: { medicineId: true },
      });

      // check medicine is deleted of prescription when update
      const medicineBeforeIds = guideBefores.map((guide) => guide.medicineId);
      const medicineDeleteIds = medicineBeforeIds.filter((item) => !listMedicines.includes(item.medicineId));

      const data = await prisma.$transaction([
        //* update prescription
        prisma.prescription.update({
          data: newPrescription,
          where: { id: Number(id) },
        }),

        //* delete medicineGuide old
        prisma.medicineGuide.deleteMany({
          where: {
            medicineId: { in: medicineDeleteIds },
            prescriptionId: Number(id),
          },
        }),

        //* update list medicineGuide
        ...listMedicines.map((guide) => {
          const { medicineId, morning, night, noon, quantity } = guide;
          return prisma.medicineGuide.upsert({
            where: {
              medicineGuideId: {
                prescriptionId: Number(id),
                medicineId: Number(medicineId),
              },
            },
            update: {
              morning: Number(morning),
              night: Number(night),
              noon: Number(noon),
              quantity: Number(quantity),
            },
            create: {
              prescriptionId: Number(id),
              medicineId: Number(medicineId),
              morning: Number(morning),
              night: Number(night),
              noon: Number(noon),
              quantity: Number(quantity),
            },
          });
        }),
      ]);

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
