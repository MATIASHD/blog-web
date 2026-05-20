const newsletterRepository = require('../repositories/newsletter.repository');
const Logger = require('../utils/logger');
const crypto = require('crypto');

class NewsletterService {
  getAllSubscribers() {
    try {
      return newsletterRepository.getAll();
    } catch (error) {
      Logger.error('Error getting subscribers', error);
      return [];
    }
  }

  getSubscribedCount() {
    try {
      return newsletterRepository.getSubscribed().length;
    } catch (error) {
      Logger.error('Error getting subscribed count', error);
      return 0;
    }
  }

  subscribe(email, name = '') {
    try {
      const existing = newsletterRepository.getByEmail(email);
      if (existing) {
        if (existing.status === 'subscribed') {
          throw new Error('Email already subscribed');
        }
        existing.status = 'subscribed';
        return newsletterRepository.save(existing);
      }

      const subscriber = {
        email,
        name,
        status: 'subscribed',
        subscriptionDate: new Date().toISOString(),
        unsubscribeToken: crypto.randomBytes(32).toString('hex')
      };

      return newsletterRepository.save(subscriber);
    } catch (error) {
      Logger.error('Error subscribing to newsletter', error);
      throw error;
    }
  }

  unsubscribe(email) {
    try {
      const subscriber = newsletterRepository.getByEmail(email);
      if (!subscriber) {
        throw new Error('Email not found');
      }

      subscriber.status = 'unsubscribed';
      return newsletterRepository.save(subscriber);
    } catch (error) {
      Logger.error('Error unsubscribing', error);
      throw error;
    }
  }

  unsubscribeByToken(token) {
    try {
      const subscribers = newsletterRepository.getAll();
      const subscriber = subscribers.find(s => s.unsubscribeToken === token);
      if (!subscriber) {
        throw new Error('Invalid unsubscribe token');
      }

      return this.unsubscribe(subscriber.email);
    } catch (error) {
      Logger.error('Error unsubscribing by token', error);
      throw error;
    }
  }
}

module.exports = new NewsletterService();
