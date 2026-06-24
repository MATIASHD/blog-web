const prisma = require('../lib/prisma');
const Logger = require('../utils/logger');

class NewsletterRepository {
  async getAll() {
    try {
      return await prisma.newsletterSubscriber.findMany({ orderBy: { created_at: 'desc' } });
    } catch (error) {
      Logger.error('Error reading subscribers', error);
      return [];
    }
  }

  async getByEmail(email) {
    try {
      return await prisma.newsletterSubscriber.findUnique({ where: { email } });
    } catch (error) {
      Logger.error('Error getting subscriber by email', error);
      return null;
    }
  }

  async save(subscriberData) {
    try {
      const { email } = subscriberData;
      const existing = await this.getByEmail(email);
      if (existing) {
        return await prisma.newsletterSubscriber.update({
          where: { email },
          data: subscriberData,
        });
      } else {
        return await prisma.newsletterSubscriber.create({ data: subscriberData });
      }
    } catch (error) {
      Logger.error('Error saving subscriber', error);
      return null;
    }
  }

  async delete(email) {
    try {
      await prisma.newsletterSubscriber.delete({ where: { email } });
      return true;
    } catch (error) {
      Logger.error('Error deleting subscriber', error);
      return false;
    }
  }

  async getSubscribed() {
    try {
      return await prisma.newsletterSubscriber.findMany({ where: { status: 'active' } });
    } catch (error) {
      Logger.error('Error getting subscribed', error);
      return [];
    }
  }
}

module.exports = new NewsletterRepository();
