const authRouter = require('./auth');
const testRouter = require('./test');

function route(app) {
  app.use('/api/auth', authRouter);
  app.use('/api/test', testRouter);
}

module.exports = route;
