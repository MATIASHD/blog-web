const userRepository = require('../../repositories/user.repository');
const jwtService = require('../../services/jwt.service');
const config = require('../../config/jwt');
const ApiError = require('../../utils/apiError');
const STATUS = require('../../constants/status');

const authController = {
  login: async (req, res) => {
    const { email, password } = req.body;

    const user = await userRepository.getByEmail(email);
    if (!user) {
      return res.render('pages/login', {
        title: 'Login',
        error: 'Usuario o contraseña incorrectos',
      });
    }

    const valid = await userRepository.verifyPassword(user, password);
    if (!valid) {
      return res.render('pages/login', {
        title: 'Login',
        error: 'Usuario o contraseña incorrectos',
      });
    }

    if (!user.is_active) {
      return res.render('pages/login', {
        title: 'Login',
        error: 'Cuenta desactivada. Contacte al administrador.',
      });
    }

    await userRepository.save({ id: user.id, lastLogin: new Date().toISOString() });

    const accessToken = jwtService.generateAccessToken(user);
    const { token: refreshToken, jti } = jwtService.generateRefreshToken();

    await jwtService.createSession(
      user.id,
      req.ip,
      req.headers['user-agent'] || '',
      jti
    );

    res.cookie(config.cookie.access.name, accessToken, config.cookie.access);
    res.cookie(config.cookie.refresh.name, refreshToken, config.cookie.refresh);

    req.session.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    res.redirect('/dashboard');
  },

  refresh: async (req, res) => {
    const token = req.cookies?.[config.cookie.refresh.name];
    if (!token) {
      throw new ApiError('Refresh token not found', STATUS.UNAUTHORIZED);
    }

    let decoded;
    try {
      decoded = jwtService.verifyRefreshToken(token);
    } catch {
      res.clearCookie(config.cookie.access.name, config.cookie.access);
      res.clearCookie(config.cookie.refresh.name, config.cookie.refresh);
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const session = await jwtService.findSession(decoded.jti);
    if (!session || !session.user || !session.user.is_active) {
      res.clearCookie(config.cookie.access.name, config.cookie.access);
      res.clearCookie(config.cookie.refresh.name, config.cookie.refresh);
      return res.status(401).json({ error: 'Session expired or revoked' });
    }

    const newAccessToken = jwtService.generateAccessToken(session.user);
    res.cookie(config.cookie.access.name, newAccessToken, config.cookie.access);

    res.json({ success: true });
  },

  logout: async (req, res) => {
    const token = req.cookies?.[config.cookie.refresh.name];
    if (token) {
      try {
        const decoded = jwtService.verifyRefreshToken(token);
        await jwtService.deleteSession(decoded.jti).catch(() => {});
      } catch {
        console.log("error")
      }
    }

    res.clearCookie(config.cookie.access.name, config.cookie.access);
    res.clearCookie(config.cookie.refresh.name, config.cookie.refresh);

    req.session.destroy(() => {});

    if (req.accepts('html')) {
      return res.redirect('/');
    }
    res.json({ success: true });
  },
};

module.exports = authController;
