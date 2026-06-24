const contactRepository = require('../repositories/contact.repository');
const Logger = require('../utils/logger');

class ContactService {
  async getAllContacts() {
    try {
      return await contactRepository.getAll();
    } catch (error) {
      Logger.error('Error getting contacts', error);
      return [];
    }
  }

  async getContactById(id) {
    try {
      const contact = await contactRepository.getById(id);
      if (contact) {
        await contactRepository.markAsRead(id);
      }
      return contact;
    } catch (error) {
      Logger.error(`Error getting contact: ${id}`, error);
      return null;
    }
  }

  async createContact(data) {
    try {
      const contact = {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        status: 'pending',
      };

      return await contactRepository.save(contact);
    } catch (error) {
      Logger.error('Error creating contact', error);
      throw error;
    }
  }

  async updateContactStatus(id, status) {
    try {
      const contact = await contactRepository.getById(id);
      if (!contact) {
        throw new Error('Contact not found');
      }

      contact.status = status;
      return await contactRepository.save(contact);
    } catch (error) {
      Logger.error(`Error updating contact: ${id}`, error);
      throw error;
    }
  }

  async deleteContact(id) {
    try {
      return await contactRepository.delete(id);
    } catch (error) {
      Logger.error(`Error deleting contact: ${id}`, error);
      throw error;
    }
  }

  async getUnreadCount() {
    try {
      const contacts = await this.getAllContacts();
      return contacts.filter(c => c.status === 'pending').length;
    } catch (error) {
      Logger.error('Error getting unread count', error);
      return 0;
    }
  }
}

module.exports = new ContactService();
