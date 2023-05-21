const authRouter = require('./auth');
const testRouter = require('./test');
const userRouter = require('./user.route');

function route(app) {
  app.use('/api/auth', authRouter);
  app.use('/api/test', testRouter);
  app.use('/api/users', userRouter);
}

module.exports = route;
