const { prisma } = require('../config/prisma.instance');
const createError = require('http-errors');

const formatDate = (dateTime) => {
  const date = dateTime.getDate();
  const month = dateTime.getMonth();
  const year = dateTime.getFullYear();
  return `${date}-${month}-${year}`;
};

const formatGroupInvoiceByDate = (invoices) => {
  const formatInvoice = invoices.reduce((result, item) => {
    const existDateIndex = result.findIndex((existItem) => existItem.createdAt === formatDate(item.createdAt));
    if (existDateIndex > -1) {
      result[existDateIndex].listInvoiceIndate.push(item);
    } else {
      result.push({ createdAt: formatDate(item.createdAt), listInvoiceIndate: [{ ...item }] });
    }

    return result;
  }, []);
  return formatInvoice;
};

module.exports = {
  getMerchandiseInventory: async () => {
    try {
      //* get all merchandise in stock
      const getListMedicineStock = () =>
        new Promise(async (resolve) => {
          const data = await prisma.medicineIntoStock.findMany({ include: { medicine: true } });
          resolve(data);
        });
      const getListProductStock = () =>
        new Promise(async (resolve) => {
          const data = await prisma.productIntoStock.findMany({ include: { product: true } });
          resolve(data);
        });
      const listMerChandise = await Promise.all([getListMedicineStock(), getListProductStock()]);
      const data = listMerChandise[0].concat(listMerChandise[1]);

      //* detach merchandise for each status
      // all
      const allMerchandise = data;
      // prepare sold out
      const preSoldOutMerchandise = data.filter(
        (item) => item.inputQuantity - item.soldQuantity / item.specification < 2,
      );
      // prepare expired
      const preExpMerchandise = data.filter((item) => {
        const currentDate = new Date();
        const expDate = new Date(item.expirationDate);
        const nextThirtyDate = new Date();
        nextThirtyDate.setDate(currentDate.getDate() + 30);
        return expDate > currentDate && expDate <= nextThirtyDate;
      });
      // expired
      const expMerchandise = data.filter((item) => {
        const currentDate = new Date();
        const expDate = new Date(item.expirationDate);
        return expDate <= currentDate;
      });

      return Promise.resolve({ allMerchandise, preSoldOutMerchandise, preExpMerchandise, expMerchandise });
    } catch (err) {
      throw err;
    }
  },

  filterHistory: async (fromDate, toDate, sort, pageNumber, limit) => {
    try {
      //* defind option
      const skip = pageNumber && limit ? (Number(pageNumber) - 1) * Number(limit) : null;
      const order =
        sort && (sort.toLowerCase() === 'asc' || sort.toLowerCase() === 'desc') ? sort.toLowerCase() : 'desc';
      const whereClause = {
        ...(fromDate && toDate
          ? {
              createdAt: {
                gte: new Date(fromDate),
                lte: new Date(toDate),
              },
            }
          : {}),
      };

      //* Task get invoices with filter
      let getInvoices = () => {
        return new Promise(async (resolve) => {
          const invoices = await prisma.invoiceIntoStock.findMany({
            where: whereClause,
            ...(pageNumber && limit ? { skip: skip, take: Number(limit) } : {}),
            orderBy: { createdAt: order },
            include: { staff: { select: { fullName: true } } },
          });
          resolve(formatGroupInvoiceByDate(invoices));
        });
      };

      //*  Task count total Page base on data filter
      let countTotalPage = () => {
        return new Promise(async (resolve) => {
          const totalInvoices = await prisma.invoiceIntoStock.count({
            where: whereClause,
          });
          resolve(totalInvoices);
        });
      };

      const data = await Promise.all([getInvoices(), countTotalPage()]);
      return Promise.resolve({
        listGroupDate: data[0],
        currentPage: pageNumber,
        totalPage: Math.ceil(data[1] / limit),
      });
    } catch (err) {
      throw err;
    }
  },

  getInvoiceByDate: async (from, to, sort) => {
    try {
      if (!from || !to) return null;
      const order =
        sort && (sort.toLowerCase() === 'asc' || sort.toLowerCase() === 'desc') ? sort.toLowerCase() : 'desc';
      // get invoice
      let getTotalInvoiceByDate = () => {
        return new Promise(async (resolve, reject) => {
          const data = await prisma.invoiceIntoStock.findMany({
            where: {
              createdAt: {
                gte: new Date(from),
                lte: new Date(to),
              },
            },
            orderBy: { createdAt: order },
          });
          resolve(data);
        });
      };
      //   count total invoice
      let countTotalInvoice = () => {
        return new Promise(async (resolve, reject) => {
          const totalCount = await prisma.invoiceIntoStock.count({
            where: {
              createdAt: {
                gte: new Date(from),
                lte: new Date(to),
              },
            },
          });
          resolve(totalCount);
        });
      };
      const data = await Promise.all([getTotalInvoiceByDate(), countTotalInvoice()]);
      return Promise.resolve({ listInvoices: data[0], total: data[1] });
    } catch (err) {
      throw err;
    }
  },

  filterProduct: async (search, categoryId) => {
    try {
      if (!search || !categoryId) {
        throw createError.ExpectationFailed('expected "search" and "categoryId" in request!');
      }

      let getProduct = () => {
        return new Promise(async (resolve) => {
          const products = await prisma.product.findMany({
            where: {
              AND: [
                {
                  OR: [{ productName: { contains: search } }, { packingSpecification: { contains: search } }],
                },
                { categoryId: Number(categoryId) },
              ],
            },
          });
          const dataAddField = products.map((item) => ({ ...item, isMedicine: false }));
          resolve(dataAddField);
        });
      };

      let getMedicine = () =>
        new Promise(async (resolve) => {
          const medicines = await prisma.medicine.findMany({
            where: {
              AND: [
                {
                  OR: [{ medicineName: { contains: search } }, { packingSpecification: { contains: search } }],
                },
                { categoryId: Number(categoryId) },
              ],
            },
          });
          const dataAddField = medicines.map((item) => ({ ...item, isMedicine: true }));
          resolve(dataAddField);
        });

      const result = await Promise.all([getMedicine(), getProduct()]);
      const data = result[0].concat(result[1]);

      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },

  getInvoiceById: async (id) => {
    try {
      const data = await prisma.invoiceIntoStock.findUnique({
        where: { id: Number(id) },
        include: {
          MedicineIntoStocks: {
            include: {
              medicine: {
                select: {
                  medicineName: true,
                  packingSpecification: true,
                },
              },
            },
          },
          ProductIntoStocks: {
            include: {
              product: {
                select: {
                  productName: true,
                  packingSpecification: true,
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

  createNewInvoice: async (newInvoice, listProducts, listMedicines) => {
    try {
      let createInvoice = () =>
        new Promise(async (resolve) => {
          const data = await prisma.invoiceIntoStock.create({ data: newInvoice });
          return resolve(data);
        });

      let createProductIntoStock = (invoiceIntoStockId) =>
        new Promise(async (resolve) => {
          const fullDatas = listProducts.map((item) => {
            //* convert type:
            item.inputQuantity = Number(item.inputQuantity);
            item.specification = Number(item.specification);
            item.importPrice = Number(item.importPrice);
            item.sellPrice = Number(item.sellPrice);
            //*add field
            item.invoiceIntoStockId = invoiceIntoStockId;
            item.productId = item.id;
            item.soldQuantity = 0;
            item.destroyed = false;
            delete item.id;
            delete item.isMedicine;
            return item;
          });
          console.log(fullDatas);
          const data = await prisma.productIntoStock.createMany({ data: fullDatas });
          return resolve(data);
        });

      let createMedicineIntoStock = (invoiceIntoStockId) =>
        new Promise(async (resolve) => {
          const fullDatas = listMedicines.map((item) => {
            //* convert type:
            item.inputQuantity = Number(item.inputQuantity);
            item.specification = Number(item.specification);
            item.importPrice = Number(item.importPrice);
            item.sellPrice = Number(item.sellPrice);
            //*add field
            item.invoiceIntoStockId = invoiceIntoStockId;
            item.medicineId = item.id;
            item.soldQuantity = 0;
            item.destroyed = false;
            delete item.id;
            delete item.isMedicine;
            return item;
          });
          const data = await prisma.medicineIntoStock.createMany({ data: fullDatas });
          return resolve(data);
        });

      const data = await createInvoice().then(async (invoice) => {
        const data = await Promise.all([createMedicineIntoStock(invoice.id), createProductIntoStock(invoice.id)]);
        return Promise.resolve({ newInvoice: invoice, newMedicineStocks: data[0], newProductStocks: data[1] });
      });

      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },
};
