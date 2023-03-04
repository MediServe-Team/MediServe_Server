const jwt = require('jsonwebtoken');
const createError = require('http-errors');

const createAccessToken = async (userId, email) => {
  return new Promise((resolve, reject) => {
    const payload = { userId, email };

    const options = {
      algorithm: 'HS256',
      expiresIn: '1h',
    };

    const secretKey = process.env.SECRET_ACCESS_TOKEN_KEY;

    jwt.sign(payload, secretKey, options, (error, token) => {
      if (error) {
        reject(error);
      }
      resolve(token);
    });
  });
};

const verifyAccessToken = async (req, res, next) => {
  if (!req.headers['authorization']) {
    return next(createError.Unauthorized());
  }

  const authHeader = req.headers['authorization'];
  const bearerToken = authHeader.split(' ');
  const token = bearerToken[1];

  // verify access token
  jwt.verify(token, process.env.SECRET_ACCESS_TOKEN_KEY, (error, payload) => {
    if (error) {
      if (error.name == 'JsonWebTokenError') {
        return next(createError.Unauthorized());
      }
      return next(createError.Unauthorized(error.message));
    }

    req.payload = payload;

    next();
  });
};

const createRefreshToken = async (userId, email) => {
  return new Promise((resolve, reject) => {
    const payload = {
      userId,
      email,
    };

    const options = {
      algorithm: 'HS256',
      expiresIn: '1y',
    };

    const secretKey = process.env.SECRECT_REFRESH_TOKEN_KEY;

    jwt.sign(payload, secretKey, options, (error, token) => {
      if (error) {
        reject(error);
      }
      resolve(token);
    });
  });
};

const verifyRefreshToken = async (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.SECRECT_REFRESH_TOKEN_KEY, (error, payload) => {
      if (error) {
        reject(error);
      }

      resolve(payload);
    });
  });
};

module.exports = {
  createAccessToken,
  verifyAccessToken,
  createRefreshToken,
  verifyRefreshToken,
};
