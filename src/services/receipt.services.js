const { prisma } = require('../config/prisma.instance');
const { createNewPrescription } = require('./prescription.services');
const createError = require('http-errors');

module.exports = {
  getReceiptOfUser: async (userId) => {
    try {
      const data = await prisma.receipt.findMany({
        where: {
          customerId: userId,
        },
        include: {
          staff: {
            select: { fullName: true },
          },
        },
      });
      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },

  getAllReceiptWithCondition: async (staffName, customerName, fromDate, toDate, sort, pageNumber, limit) => {
    try {
      //* defind option
      const skip = pageNumber && limit ? (Number(pageNumber) - 1) * Number(limit) : null;
      const order =
        sort && (sort.toLowerCase() === 'asc' || sort.toLowerCase() === 'desc') ? sort.toLowerCase() : 'desc';
      const whereClause = {
        ...(staffName ? { staff: { fullName: { contains: staffName, mode: 'insensitive' } } } : {}),
        ...(customerName
          ? {
              OR: [
                { customer: { fullName: { contains: customerName, mode: 'insensitive' } } },
                { guest: { fullName: { contains: customerName, mode: 'insensitive' } } },
              ],
            }
          : {}),
        ...(fromDate && toDate
          ? {
              createdAt: {
                gte: new Date(fromDate),
                lte: new Date(toDate),
              },
            }
          : {}),
      };

      //* Task get receipts with filter
      let getReceipts = () => {
        return new Promise(async (resolve) => {
          const receipts = await prisma.receipt.findMany({
            where: whereClause,
            include: {
              staff: { select: { fullName: true } },
              customer: { select: { fullName: true } },
              guest: { select: { fullName: true } },
            },
            ...(pageNumber && limit ? { skip: skip, take: Number(limit) } : {}),
            orderBy: { createdAt: order },
          });
          resolve(receipts);
        });
      };

      //*  Task count total Page base on data filter
      let countTotalPage = () => {
        return new Promise(async (resolve) => {
          const totalReceipts = await prisma.receipt.count({
            where: whereClause,
          });
          resolve(totalReceipts);
        });
      };

      //* Excute above task
      const data = await Promise.all([getReceipts(), countTotalPage()]);

      return Promise.resolve({ receipts: data[0], currentPage: pageNumber, totalPage: Math.ceil(data[1] / limit) });
    } catch (err) {
      throw err;
    }
  },

  getReceiptById: async (id) => {
    try {
      const data = await prisma.receipt.findUnique({
        where: { id: Number(id) },
        select: {
          //* receipts
          id: true,
          totalPayment: true,
          givenByCustomer: true,
          note: true,
          //* list products
          DetailReceiptProducts: {
            select: {
              quantity: true,
              totalPrice: true,
              product: {
                select: {
                  id: true,
                  productName: true,
                  sellUnit: true,
                },
              },
            },
          },
          //* list medicines
          DetailReceiptMedicines: {
            select: {
              quantity: true,
              totalPrice: true,
              medicine: {
                select: {
                  id: true,
                  medicineName: true,
                  sellUnit: true,
                },
              },
            },
          },
          //* list presctiptions
          DetailReceiptPrescriptions: {
            select: {
              quantity: true,
              totalPrice: true,
              prescription: {
                select: {
                  diagnose: true,
                  totalPrice: true,
                  note: true,
                  MedicineGuides: {
                    select: {
                      morning: true,
                      noon: true,
                      night: true,
                      quantity: true,
                      totalPrice: true,
                      medicine: {
                        select: {
                          medicineName: true,
                          sellUnit: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          //* customer
          customer: {
            select: {
              id: true,
              fullName: true,
              age: true,
              gender: true,
              address: true,
            },
          },
          guest: true,
        },
      });
      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },

  createReceipt: async (
    newReceipt,
    guest,
    customerId,
    products,
    medicines,
    // prescriptionAvailbles,
    newPrescriptions,
  ) => {
    try {
      const data = await prisma.$transaction(async (transaction) => {
        //* add customerId or guestId into receipt:
        if (customerId) {
          newReceipt.customerId = customerId;
        } else {
          if (Object.keys(guest).length === 0) throw createError.BadRequest('Invalid information of customer!');
          const newGuest = await transaction.guest.create({ data: guest });
          newReceipt.guestId = newGuest.id;
        }

        //* create new receipt:
        const receipt = await transaction.receipt.create({ data: newReceipt });

        // //* create detail product ref
        const createDetailProductReceipt = () =>
          new Promise(async (resolve) => {
            const listProductDetail = products.map((product) => ({
              receiptId: receipt.id,
              productId: product.productId,
              quantity: product.quantity,
              totalPrice: product.totalPrice,
            }));
            const detailReceiptProductSaved = await transaction.detailReceiptProduct.createMany({
              data: listProductDetail,
            });
            return resolve(detailReceiptProductSaved);
          });

        // //* create detail medicines ref
        const createDetailMedicineReceipt = () =>
          new Promise(async (resolve) => {
            const listMedicineDetail = medicines.map((medicine) => ({
              receiptId: receipt.id,
              medicineId: medicine.medicineId,
              quantity: medicine.quantity,
              totalPrice: medicine.totalPrice,
            }));
            const detailReceiptMedicineSaved = await transaction.detailReceiptMedicine.createMany({
              data: listMedicineDetail,
            });
            return resolve(detailReceiptMedicineSaved);
          });

        // //* create detail prescription for availble dose
        // ? current app not use this feature:
        const createDetailPresAvailReceipt = () =>
          new Promise(async (resolve) => {
            const listAvailPresDetail = prescriptionAvailbles.map((pres) => ({
              receiptId: receipt.id,
              prescriptionId: pres.prescriptionId,
              quantity: pres.quantity,
            }));
            const detailReceiptPresAvailSaved = await transaction.detailReceiptPrescription.createMany({
              data: listAvailPresDetail,
            });
            return resolve(detailReceiptPresAvailSaved);
          });

        // //* create detail prescription for new dose
        const createDetailPresReceipt = () =>
          new Promise(async (resolve) => {
            // create new dose and return array data to create detail receipt
            const listDetailPresReceipts = await Promise.all(
              newPrescriptions.map(async (pres) => {
                const newPrescription = {
                  staffId: newReceipt.staffId,
                  diagnose: pres.diagnose,
                  isDose: false,
                  note: pres.note,
                };
                const data = await createNewPrescription(newPrescription, pres.listMedicines);
                return {
                  receiptId: receipt.id,
                  prescriptionId: data.newPrescription.id,
                  quantity: pres.quantity,
                  totalPrice: pres.totalPrice,
                };
              }),
            );
            // create detail prescription receipt
            const detailReceiptPresSaved = await transaction.detailReceiptPrescription.createMany({
              data: listDetailPresReceipts,
            });
            return resolve(detailReceiptPresSaved);
          });

        //* Excute create receipt:
        const data = await Promise.all([
          createDetailProductReceipt(),
          createDetailMedicineReceipt(),
          createDetailPresReceipt(),
        ]);

        return Promise.resolve({ receipt, data });
      });

      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },
};
