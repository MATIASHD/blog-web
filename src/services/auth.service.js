const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/user.repository');
const Logger = require('../utils/logger');

class AuthService {
  async login(email, password) {
    try {
      const user = await userRepository.getByEmail(email);
      if (!user) {
        throw new Error('Invalid email or password');
      }

      const valid = await userRepository.verifyPassword(user, password);
      if (!valid) {
        throw new Error('Invalid email or password');
      }

      await userRepository.save({ id: user.id, lastLogin: new Date().toISOString() });

      const { password_hash, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      Logger.error('Login error', error);
      throw error;
    }
  }

  async register(data) {
    try {
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

      const saved = await userRepository.save(newUser);
      return saved;
    } catch (error) {
      Logger.error('Registration error', error);
      throw error;
    }
  }

  logout(userId) {
    Logger.info(`User logged out: ${userId}`);
    return true;
  }

  async resetPassword(email, newPassword) {
    try {
      const user = await userRepository.getByEmail(email);
      if (!user) {
        throw new Error('User not found');
      }

      const password_hash = await bcrypt.hash(newPassword, 10);
      await userRepository.save({ id: user.id, password_hash });
      return true;
    } catch (error) {
      Logger.error('Password reset error', error);
      throw error;
    }
  }
}

module.exports = new AuthService();
