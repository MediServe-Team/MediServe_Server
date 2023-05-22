const authRouter = require('./auth');
const testRouter = require('./test');
const userRouter = require('./user.route');
const invoiceIntoStockRouter = require('./invoiceIntoStock.route');

function route(app) {
  app.use('/api/auth', authRouter);
  app.use('/api/test', testRouter);
  app.use('/api/users', userRouter);
  app.use('/api/invoice-into-stocks', invoiceIntoStockRouter);
}

module.exports = route;
