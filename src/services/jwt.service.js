const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../config/jwt');
const prisma = require('../lib/prisma');

class JwtService {
  generateAccessToken(user) {
    return jwt.sign(
      { sub: user.id, role: user.role },
      config.access.secret,
      { expiresIn: config.access.expiresIn }
    );
  }

  generateRefreshToken() {
    const jti = crypto.randomUUID();
    const token = jwt.sign(
      { jti },
      config.refresh.secret,
      { expiresIn: config.refresh.expiresIn }
    );
    return { token, jti };
  }

  verifyAccessToken(token) {
    return jwt.verify(token, config.access.secret);
  }

  verifyRefreshToken(token) {
    return jwt.verify(token, config.refresh.secret);
  }

  async createSession(userId, ipAddress, userAgent, jti) {
    return prisma.userSession.create({
      data: {
        user_id: userId,
        token: jti,
        ip_address: ipAddress,
        user_agent: userAgent,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      include: { user: true },
    });
  }

  async findSession(jti) {
    const session = await prisma.userSession.findUnique({
      where: { token: jti },
      include: { user: true },
    });
    if (session) {
      await prisma.userSession.update({
        where: { token: jti },
        data: { last_used_at: new Date() },
      });
    }
    return session;
  }

  async deleteSession(jti) {
    return prisma.userSession.delete({ where: { token: jti } });
  }

  async deleteAllUserSessions(userId) {
    return prisma.userSession.deleteMany({ where: { user_id: userId } });
  }
}

module.exports = new JwtService();
