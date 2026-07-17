const jwtService = require('../services/jwt.service');
const config = require('../config/jwt');

const authenticate = async (req, res, next) => {
  const accessToken = req.cookies?.[config.cookie.access.name];

  if (!accessToken) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwtService.verifyAccessToken(accessToken);
    req.user = { id: decoded.sub, role: decoded.role };
    return next();
  } catch (err) {
    if (err.name !== 'TokenExpiredError') {
      req.user = null;
      return next();
    }
  }

  const refreshToken = req.cookies?.[config.cookie.refresh.name];
  if (!refreshToken) {
    req.user = null;
    return next();
  }

  try {
    const decodedRefresh = jwtService.verifyRefreshToken(refreshToken);
    const session = await jwtService.findSession(decodedRefresh.jti);
    if (session && session.user && session.user.is_active) {
      const newAccessToken = jwtService.generateAccessToken(session.user);
      res.cookie(config.cookie.access.name, newAccessToken, config.cookie.access);
      req.user = { id: session.user.id, role: session.user.role };
      return next();
    }
  } catch {
  }

  res.clearCookie(config.cookie.access.name, config.cookie.access);
  res.clearCookie(config.cookie.refresh.name, config.cookie.refresh);
  req.user = null;
  next();
};

module.exports = authenticate;
