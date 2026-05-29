const contactRepository = require('../repositories/contact.repository');
const Logger = require('../utils/logger');

class ContactService {
  getAllContacts() {
    try {
      return contactRepository.getAll();
    } catch (error) {
      Logger.error('Error getting contacts', error);
      return [];
    }
  }

  getContactById(id) {
    try {
      const contact = contactRepository.getById(id);
      if (contact) {
        contactRepository.markAsRead(id);
      }
      return contact;
    } catch (error) {
      Logger.error(`Error getting contact: ${id}`, error);
      return null;
    }
  }

  createContact(data) {
    try {
      const contact = {
        id: null,
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        status: 'new',
        read: false,
        createdAt: new Date().toISOString()
      };

      return contactRepository.save(contact);
    } catch (error) {
      Logger.error('Error creating contact', error);
      throw error;
    }
  }

  updateContactStatus(id, status) {
    try {
      const contact = contactRepository.getById(id);
      if (!contact) {
        throw new Error('Contact not found');
      }

      contact.status = status;
      return contactRepository.save(contact);
    } catch (error) {
      Logger.error(`Error updating contact: ${id}`, error);
      throw error;
    }
  }

  deleteContact(id) {
    try {
      return contactRepository.delete(id);
    } catch (error) {
      Logger.error(`Error deleting contact: ${id}`, error);
      throw error;
    }
  }

  getUnreadCount() {
    try {
      const contacts = this.getAllContacts();
      return contacts.filter(c => !c.read).length;
    } catch (error) {
      Logger.error('Error getting unread count', error);
      return 0;
    }
  }
}

module.exports = new ContactService();
