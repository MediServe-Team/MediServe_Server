const { number } = require('joi');
const { prisma } = require('../config/prisma.instance');
const createError = require('http-errors');
const { storeImg, removeImg } = require('../helpers/cloudinary');

module.exports = {
  filterMedicineInStock: async (searchValue) => {
    try {
      let data = await prisma.medicineIntoStock.findMany({
        where: {
          medicine: {
            medicineName: { contains: searchValue, mode: 'insensitive' },
          },
        },
        include: {
          medicine: {
            select: { id: true, medicineName: true, sellUnit: true, packingSpecification: true },
          },
        },
      });

      data = data.filter((medicine) => medicine.inputQuantity - medicine.soldQuantity > 0);
      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },

  filterMedicines: async (searchValue) => {
    try {
      const data = await prisma.medicine.findMany({
        where: {
          medicineName: { contains: searchValue, mode: 'insensitive' },
        },
      });
      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },

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
      const data = await prisma.medicine.findUnique({ where: { id: Number(id) } });
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
      const { barCode, medicineImage } = newData;

      //* check barcode and medicineImage in medicine before update
      const medicineBefore = await prisma.medicine.findFirst({
        where: { id: Number(id) },
        select: { barCode: true, medicineImage: true },
      });

      //* update store barcode
      if (barCode) {
        if (barCode !== medicineBefore.barCode) {
          if (medicineBefore.barCode) {
            try {
              removeImg(medicineBefore.barCode);
            } catch (err) {
              return;
            }
          }
          const imgURL = await storeImg(barCode);
          newData.barCode = imgURL.url;
        }
      }

      //* update store medicine Img
      if (medicineImage) {
        if (medicineImage !== medicineBefore.medicineImage) {
          if (medicineBefore.medicineImage) {
            try {
              removeImg(medicineBefore.medicineImage);
            } catch (err) {
              return;
            }
          }
          const imgURL = await storeImg(medicineImage);
          newData.medicineImage = imgURL.url;
        }
      }

      //* update medicine
      const data = await prisma.medicine.update({ data: newData, where: { id: Number(id) } });
      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },

  deleteMedicineById: async (id) => {
    try {
      // remove image from cloud
      (async () => {
        const medicine = await prisma.medicine.findFirst({
          where: { id: Number(id) },
          select: { medicineImage: true },
        });
        if (medicine?.medicineImage) {
          try {
            removeImg(medicine.medicineImage);
          } catch (err) {
            return;
          }
        }
      })();
      // delete medicine
      const data = await prisma.medicine.delete({ where: { id: Number(id) } });
      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },
};
