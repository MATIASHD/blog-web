const bcrypt = require('bcryptjs');
const prisma = require('../lib/prisma');
const Logger = require('../utils/logger');

class UserRepository {
  async createDefaultAdmin() {
    try {
      const adminExists = await prisma.user.findFirst({ where: { role: 'admin' } });
      if (adminExists) return;

      if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
        Logger.info('Default admin was not created: ADMIN_EMAIL and ADMIN_PASSWORD must be set');
        return;
      }

      const adminEmail = process.env.ADMIN_EMAIL;
      const adminPassword = process.env.ADMIN_PASSWORD;

      const password_hash = await bcrypt.hash(adminPassword, 10);
      await prisma.user.create({
        data: {
          email: adminEmail,
          password_hash,
          name: 'Admin',
          role: 'admin',
          is_active: true,
        },
      });
      Logger.info(`Default admin user created: ${adminEmail}`);
    } catch (error) {
      Logger.error('Error creating default admin', error);
    }
  }

  async getAll() {
    try {
      return await prisma.user.findMany({
        select: { id: true, email: true, name: true, role: true, is_active: true, email_verified_at: true, created_at: true, updated_at: true },
      });
    } catch (error) {
      Logger.error('Error reading users', error);
      return [];
    }
  }

  async getById(id) {
    try {
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) return null;
      const { password_hash, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      Logger.error('Error getting user by id', error);
      return null;
    }
  }

  async getByEmail(email) {
    try {
      return await prisma.user.findUnique({ where: { email } });
    } catch (error) {
      Logger.error('Error getting user by email', error);
      return null;
    }
  }

  async save(userData) {
    try {
      if (userData.id) {
        const { id, password, lastLogin, ...updateData } = userData;
        const data = { ...updateData };
        if (lastLogin) data.last_login = new Date(lastLogin);
        if (password) {
          data.password_hash = await bcrypt.hash(password, 10);
        }
        if (data.password) delete data.password;
        return await prisma.user.update({
          where: { id },
          data,
          select: { id: true, email: true, name: true, role: true, is_active: true, email_verified_at: true, created_at: true, updated_at: true },
        });
      } else {
        const { password, ...rest } = userData;
        const password_hash = await bcrypt.hash(password || 'default123', 10);
        return await prisma.user.create({
          data: { ...rest, password_hash },
          select: { id: true, email: true, name: true, role: true, is_active: true, email_verified_at: true, created_at: true, updated_at: true },
        });
      }
    } catch (error) {
      Logger.error('Error saving user', error);
      return null;
    }
  }

  async delete(id) {
    try {
      await prisma.user.delete({ where: { id } });
      return true;
    } catch (error) {
      Logger.error('Error deleting user', error);
      return false;
    }
  }

  async verifyPassword(user, password) {
    return bcrypt.compare(password, user.password_hash);
  }
}

module.exports = new UserRepository();
