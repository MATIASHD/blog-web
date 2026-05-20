const userRepository = require('../repositories/user.repository');
const Logger = require('../utils/logger');

class AuthService {
  login(email, password) {
    try {
      const user = userRepository.getByEmail(email);
      if (!user) {
        throw new Error('Invalid email or password');
      }

      if (!userRepository.verifyPassword(user, password)) {
        throw new Error('Invalid email or password');
      }

      user.lastLogin = new Date().toISOString();
      userRepository.save(user);

      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      Logger.error('Login error', error);
      throw error;
    }
  }

  register(data) {
    try {
      const existingUser = userRepository.getByEmail(data.email);
      if (existingUser) {
        throw new Error('Email already registered');
      }

      const crypto = require('crypto');
      const newUser = {
        id: Date.now().toString(),
        email: data.email,
        password: crypto.createHash('sha256').update(data.password).digest('hex'),
        name: data.name,
        role: 'user',
        status: 'active',
        createdAt: new Date().toISOString()
      };

      const saved = userRepository.save(newUser);
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

  resetPassword(email, newPassword) {
    try {
      const user = userRepository.getByEmail(email);
      if (!user) {
        throw new Error('User not found');
      }

      const crypto = require('crypto');
      user.password = crypto.createHash('sha256').update(newPassword).digest('hex');
      userRepository.save(user);

      return true;
    } catch (error) {
      Logger.error('Password reset error', error);
      throw error;
    }
  }
}

module.exports = new AuthService();
