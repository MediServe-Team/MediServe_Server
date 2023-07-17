const { loginValidate, registerValidate } = require('../../helpers/validation');
const createError = require('http-errors');
const bcrypt = require('bcrypt');
const { prisma } = require('../../config/prisma.instance');
const { createAccessToken, createRefreshToken, verifyRefreshToken } = require('../../helpers/jwt.service');

module.exports = {
  register: async (req, res, next) => {
    try {
      const { email, password, name, fullName } = req.body;

      // validation data
      const { error } = registerValidate(req.body);
      if (error) {
        throw createError(error.details[0].message);
      }

      // check registered email
      const isExistEmail = await prisma.User.findUnique({
        where: { email },
      });
      if (isExistEmail) {
        throw createError.Conflict('This is email already exists');
      }

      // hash password
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const user = {
        email,
        password: hashPassword,
        name,
        fullName,
      };

      const saveUser = await prisma.User.create({
        data: user,
      });

      res.json({
        status: 201,
        data: saveUser,
      });
    } catch (err) {
      next(err);
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // validation data
      const { error } = loginValidate(req.body);
      if (error) {
        throw createError(error.details[0].message);
      }

      // check exists user account
      const user = await prisma.User.findUnique({
        where: { email },
      });
      if (!user) {
        throw createError.NotFound('This email is not exists');
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw createError.Unauthorized();
      }

      const accessToken = await createAccessToken(user.id, user.email, user.role);
      const refreshToken = await createRefreshToken(user.id, user.email, user.role);

      // save new refresh token
      await prisma.User.update({
        where: {
          id: user.id,
        },
        data: {
          refreshToken,
        },
      });

      // save refresh_token to cookie of client
      res.cookie('MediServe_refresh_token', refreshToken, {
        domain: 'mediserveserver-production.up.railway.app',
        path: '/',
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 360,
      });

      res.status(200).json({
        status: 200,
        user,
        accessToken, // continue save accesstoken to store redux
      });
    } catch (err) {
      next(err);
    }
  },

  refreshToken: async (req, res, next) => {
    try {
      const { MediServe_refresh_token } = req.cookies;
      const refreshToken = MediServe_refresh_token;
      if (!refreshToken) {
        next(createError.BadRequest());
      }

      const payload = await verifyRefreshToken(refreshToken);
      const newAccessToken = await createAccessToken(payload.userId, payload.email, payload.role);
      const newRefreshToken = await createRefreshToken(payload.userId, payload.email, payload.role);

      // Update refresh token to DB
      await prisma.User.update({
        where: {
          id: payload.userId,
        },
        data: {
          refreshToken: newRefreshToken,
        },
      });

      // Update refresh token in cookie
      res.cookie('MediServe_refresh_token', refreshToken, {
        domain: 'mediserveserver-production.up.railway.app',
        path: '/',
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 360,
      });

      res.status(200).json({
        status: 200,
        data: {
          newAccessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  logout: async (req, res, next) => {
    try {
      const { MediServe_refresh_token } = req.cookies;
      const refreshToken = MediServe_refresh_token;
      if (!refreshToken) {
        next(createError.BadRequest());
      }

      const payload = await verifyRefreshToken(refreshToken);

      // clear refres_token in DB
      await prisma.User.update({
        where: {
          id: payload.userId,
        },
        data: {
          refreshToken: '',
        },
      });

      // clear refresh_token in cookie
      res.clearCookie('MediServe_refresh_token', {
        domain: 'mediserveserver-production.up.railway.app',
        path: '/',
      });

      res.status(200).json({
        status: 200,
        message: 'Logout',
      });
    } catch (error) {
      next(error);
    }
  },

  getUser: async (req, res, next) => {
    try {
      res.json({
        status: 200,
        message: 'OK',
        payload: req.payload,
      });
    } catch (err) {
      next(err);
    }
  },
};
