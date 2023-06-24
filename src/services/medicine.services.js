const { number } = require('joi');
const { prisma } = require('../config/prisma.instance');
const createError = require('http-errors');
const { storeImg, removeImg } = require('../helpers/cloudinary');

module.exports = {
  getMedicineByCategory: async (categoryId, pageNumber, limit, searchValue = '') => {
    try {
      if (!categoryId) {
        throw createError.ExpectationFailed('expected categoryId in request.');
      }
      let data;
      let totalRows;
      const skip = pageNumber && limit ? (Number(pageNumber) - 1) * Number(limit) : undefined;
      const searchCondition = [
        { medicineName: { contains: searchValue, mode: 'insensitive' } },
        { packingSpecification: { contains: searchValue, mode: 'insensitive' } },
      ];

      switch (categoryId) {
        case 'all':
          data = await prisma.medicine.findMany({
            where: {
              OR: [...searchCondition],
            },
            skip,
            take: Number(limit),
          });
          totalRows = await prisma.medicine.count({ where: { OR: [...searchCondition] } });
          break;

        case 'prescription':
          data = await prisma.medicine.findMany({
            where: {
              isPrescription: true,
              OR: [...searchCondition],
            },
            skip,
            take: Number(limit),
          });
          totalRows = await prisma.medicine.count({ where: { isPrescription: true, OR: [...searchCondition] } });
          break;

        case 'non-prescription':
          data = await prisma.medicine.findMany({
            where: {
              isPrescription: false,
              OR: [...searchCondition],
            },
            skip,
            take: Number(limit),
          });
          totalRows = await prisma.medicine.count({ where: { isPrescription: false, OR: [...searchCondition] } });
          break;

        default:
          data = await prisma.medicine.findMany({
            where: {
              category: { id: Number(categoryId) },
              OR: [...searchCondition],
            },
            skip,
            take: Number(limit),
          });
          totalRows = await prisma.medicine.count({
            where: { category: { id: Number(categoryId) }, OR: [...searchCondition] },
          });
          break;
      }

      return Promise.resolve({ medicines: data, totalPage: Math.ceil(totalRows / limit), currentpage: pageNumber });
    } catch (err) {
      throw err;
    }
  },

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
      const { medicineImage, barCode, ...rest } = newData;
      const imgStore = await Promise.all([
        new Promise(async (resolve) => {
          const imgURL = await storeImg(medicineImage);
          resolve(imgURL);
        }),
        new Promise(async (resolve) => {
          const imgURL = await storeImg(barCode);
          resolve(imgURL);
        }),
      ]);

      const newMedicine = { ...rest, medicineImage: imgStore[0].url, barCode: imgStore[1].url };
      const returnData = await prisma.medicine.create({
        data: newMedicine,
      });

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
