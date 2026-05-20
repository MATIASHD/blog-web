const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { DATA_PATH } = require('../utils/constants');
const Logger = require('../utils/logger');

const dataPath = path.join(process.cwd(), DATA_PATH);
const usersFile = path.join(dataPath, 'users.json');

const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

class UserRepository {
  constructor() {
    this.ensureDataDir();
    this.createDefaultAdmin();
  }

  ensureDataDir() {
    if (!fs.existsSync(dataPath)) {
      fs.mkdirSync(dataPath, { recursive: true });
    }
    if (!fs.existsSync(usersFile)) {
      fs.writeFileSync(usersFile, JSON.stringify([], null, 2), 'utf-8');
    }
  }

  createDefaultAdmin() {
    try {
      const users = this.getAll();
      const adminExists = users.some(u => u.role === 'admin');
      if (!adminExists) {
        const defaultAdmin = {
          id: '1',
          email: 'admin@blog.com',
          password: hashPassword('admin123'),
          name: 'Admin',
          role: 'admin',
          status: 'active',
          createdAt: new Date().toISOString(),
        };
        fs.writeFileSync(usersFile, JSON.stringify([defaultAdmin], null, 2), 'utf-8');
        Logger.info('Default admin user created: admin@blog.com / admin123');
      }
    } catch (error) {
      Logger.error('Error creating default admin', error);
    }
  }

  getAll() {
    try {
      const data = fs.readFileSync(usersFile, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      Logger.error('Error reading users', error);
      return [];
    }
  }

  getById(id) {
    const users = this.getAll();
    const user = users.find(u => u.id === id);
    return user ? { ...user, password: undefined } : null;
  }

  getByEmail(email) {
    const users = this.getAll();
    return users.find(u => u.email === email) || null;
  }

  save(user) {
    try {
      const users = this.getAll();
      user.id = user.id || Date.now().toString();
      const index = users.findIndex(u => u.id === user.id);

      if (index > -1) {
        users[index] = { ...users[index], ...user };
      } else {
        users.push(user);
      }

      fs.writeFileSync(usersFile, JSON.stringify(users, null, 2), 'utf-8');
      const saved = { ...user, password: undefined };
      return saved;
    } catch (error) {
      Logger.error('Error saving user', error);
      return null;
    }
  }

  delete(id) {
    try {
      const users = this.getAll();
      const filtered = users.filter(u => u.id !== id);
      fs.writeFileSync(usersFile, JSON.stringify(filtered, null, 2), 'utf-8');
      return true;
    } catch (error) {
      Logger.error('Error deleting user', error);
      return false;
    }
  }

  verifyPassword(user, password) {
    return user.password === hashPassword(password);
  }
}

module.exports = new UserRepository();
