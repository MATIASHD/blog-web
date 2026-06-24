const newsletterRepository = require('../repositories/newsletter.repository');
const Logger = require('../utils/logger');
const crypto = require('crypto');

class NewsletterService {
  async getAllSubscribers() {
    try {
      return await newsletterRepository.getAll();
    } catch (error) {
      Logger.error('Error getting subscribers', error);
      return [];
    }
  }

  async getSubscribedCount() {
    try {
      const subscribed = await newsletterRepository.getSubscribed();
      return subscribed.length;
    } catch (error) {
      Logger.error('Error getting subscribed count', error);
      return 0;
    }
  }

  async subscribe(email, name = '') {
    try {
      const existing = await newsletterRepository.getByEmail(email);
      if (existing) {
        if (existing.status === 'active') {
          throw new Error('Email already subscribed');
        }
        existing.status = 'active';
        return await newsletterRepository.save(existing);
      }

      const subscriber = {
        email,
        status: 'active',
        confirm_token: crypto.randomBytes(32).toString('hex'),
      };

      return await newsletterRepository.save(subscriber);
    } catch (error) {
      Logger.error('Error subscribing to newsletter', error);
      throw error;
    }
  }

  async unsubscribe(email) {
    try {
      const subscriber = await newsletterRepository.getByEmail(email);
      if (!subscriber) {
        throw new Error('Email not found');
      }

      subscriber.status = 'unsubscribed';
      subscriber.unsubscribed_at = new Date();
      return await newsletterRepository.save(subscriber);
    } catch (error) {
      Logger.error('Error unsubscribing', error);
      throw error;
    }
  }

  async unsubscribeByToken(token) {
    try {
      const subscribers = await newsletterRepository.getAll();
      const subscriber = subscribers.find(s => s.confirm_token === token);
      if (!subscriber) {
        throw new Error('Invalid unsubscribe token');
      }

      return await this.unsubscribe(subscriber.email);
    } catch (error) {
      Logger.error('Error unsubscribing by token', error);
      throw error;
    }
  }
}

module.exports = new NewsletterService();
