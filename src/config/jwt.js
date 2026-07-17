module.exports = {
  access: {
    secret: process.env.JWT_ACCESS_SECRET || process.env.SESSION_SECRET || 'fallback-access-secret-change-me',
    expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m',
  },
  refresh: {
    secret: process.env.JWT_REFRESH_SECRET || process.env.SESSION_SECRET || 'fallback-refresh-secret-change-me',
    expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d',
  },
  cookie: {
    access: {
      name: 'access_token',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 15 * 60 * 1000,
    },
    refresh: {
      name: 'refresh_token',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  },
};
