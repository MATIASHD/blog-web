const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/user.repository');
const jwtService = require('./jwt.service');
const Logger = require('../utils/logger');

class AuthService {
  async login(email, password, req) {
    const user = await userRepository.getByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const valid = await userRepository.verifyPassword(user, password);
    if (!valid) {
      throw new Error('Invalid email or password');
    }

    if (!user.is_active) {
      throw new Error('Account is disabled');
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

    return { user, accessToken, refreshToken };
  }

  async register(data) {
    const existingUser = await userRepository.getByEmail(data.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const newUser = {
      email: data.email,
      password: data.password,
      name: data.name,
      role: 'reader',
      is_active: true,
    };

    return userRepository.save(newUser);
  }

  logout(userId) {
    Logger.info(`User logged out: ${userId}`);
    return true;
  }

  async resetPassword(email, newPassword) {
    const user = await userRepository.getByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    const password_hash = await bcrypt.hash(newPassword, 10);
    await userRepository.save({ id: user.id, password_hash });
    await jwtService.deleteAllUserSessions(user.id);
    return true;
  }
}

module.exports = { AuthService };
