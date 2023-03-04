require('dotenv').config();
const express = require('express');
const createError = require('http-errors');
// const cors = require("cors");
const cookieParser = require('cookie-parser');
const app = express();
const route = require('./src/routes');

app.use(express.json());

app.use(cookieParser());

route(app);

app.use((req, res, next) => {
  next(createError.NotFound('This route does not exist!'));
});

app.use((err, req, res, next) => {
  res.json({
    status: err.status || 500,
    message: err.message,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});
