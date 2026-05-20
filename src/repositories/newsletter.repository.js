const fs = require('fs');
const path = require('path');
const { DATA_PATH } = require('../utils/constants');
const Logger = require('../utils/logger');

const dataPath = path.join(process.cwd(), DATA_PATH);
const newsletterFile = path.join(dataPath, 'newsletter.json');

class NewsletterRepository {
  constructor() {
    this.ensureDataDir();
  }

  ensureDataDir() {
    if (!fs.existsSync(dataPath)) {
      fs.mkdirSync(dataPath, { recursive: true });
    }
    if (!fs.existsSync(newsletterFile)) {
      fs.writeFileSync(newsletterFile, JSON.stringify([], null, 2), 'utf-8');
    }
  }

  getAll() {
    try {
      const data = fs.readFileSync(newsletterFile, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      Logger.error('Error reading newsletter', error);
      return [];
    }
  }

  getByEmail(email) {
    const subscribers = this.getAll();
    return subscribers.find(s => s.email === email) || null;
  }

  save(subscriber) {
    try {
      const subscribers = this.getAll();
      const index = subscribers.findIndex(s => s.email === subscriber.email);

      if (index > -1) {
        subscribers[index] = { ...subscribers[index], ...subscriber };
      } else {
        subscribers.push(subscriber);
      }

      fs.writeFileSync(newsletterFile, JSON.stringify(subscribers, null, 2), 'utf-8');
      return subscriber;
    } catch (error) {
      Logger.error('Error saving subscriber', error);
      return null;
    }
  }

  delete(email) {
    try {
      const subscribers = this.getAll();
      const filtered = subscribers.filter(s => s.email !== email);
      fs.writeFileSync(newsletterFile, JSON.stringify(filtered, null, 2), 'utf-8');
      return true;
    } catch (error) {
      Logger.error('Error deleting subscriber', error);
      return false;
    }
  }

  getSubscribed() {
    return this.getAll().filter(s => s.status === 'subscribed');
  }
}

module.exports = new NewsletterRepository();
