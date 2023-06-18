const { prisma } = require('../config/prisma.instance');

module.exports = {
  getAllReceiptWithCondition: async (staffId, customerId, fromDate, toDate, sort, pageNumber, limit) => {
    try {
      //* defind option
      const skip = pageNumber && limit ? (Number(pageNumber) - 1) * Number(limit) : null;
      const order =
        sort && (sort.toLowerCase() === 'asc' || sort.toLowerCase() === 'desc') ? sort.toLowerCase() : 'desc';
      const whereClause = {
        ...(staffId ? { staffId: { equals: staffId } } : {}),
        ...(customerId ? { customerId: { equals: customerId } } : {}),
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
      const data = await prisma.receipt.findUnique(id);
      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },

  createReceipt: async (newReceipt) => {
    try {
      const data = await prisma.receipt.create({ data: newReceipt });
      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },
};
