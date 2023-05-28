const authRouter = require('./auth');
const userRouter = require('./user.route');
const invoiceIntoStockRouter = require('./invoiceIntoStock.route');
const categoryRouter = require('./category.route');
const medicineRouter = require('./medicine.route');
const medicineUnitRouter = require('./medicineUnit.route');
const productRouter = require('./product.route');

function route(app) {
  app.use('/api/auth', authRouter);
  app.use('/api/users', userRouter);
  app.use('/api/invoice-into-stocks', invoiceIntoStockRouter);
  app.use('/api/categories', categoryRouter);
  app.use('/api/medicines', medicineRouter);
  app.use('/api/medicine-units', medicineUnitRouter);
  app.use('/api/products', productRouter);
}

module.exports = route;
