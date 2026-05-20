const fs = require('fs');
const path = require('path');
const { DATA_PATH } = require('../utils/constants');
const Logger = require('../utils/logger');

const dataPath = path.join(process.cwd(), DATA_PATH);
const contactsFile = path.join(dataPath, 'contacts.json');

class ContactRepository {
  constructor() {
    this.ensureDataDir();
  }

  ensureDataDir() {
    if (!fs.existsSync(dataPath)) {
      fs.mkdirSync(dataPath, { recursive: true });
    }
    if (!fs.existsSync(contactsFile)) {
      fs.writeFileSync(contactsFile, JSON.stringify([], null, 2), 'utf-8');
    }
  }

  getAll() {
    try {
      const data = fs.readFileSync(contactsFile, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      Logger.error('Error reading contacts', error);
      return [];
    }
  }

  getById(id) {
    const contacts = this.getAll();
    return contacts.find(c => c.id === id) || null;
  }

  save(contact) {
    try {
      const contacts = this.getAll();
      contact.id = contact.id || Date.now().toString();
      const index = contacts.findIndex(c => c.id === contact.id);

      if (index > -1) {
        contacts[index] = { ...contacts[index], ...contact };
      } else {
        contacts.push(contact);
      }

      fs.writeFileSync(contactsFile, JSON.stringify(contacts, null, 2), 'utf-8');
      return contact;
    } catch (error) {
      Logger.error('Error saving contact', error);
      return null;
    }
  }

  delete(id) {
    try {
      const contacts = this.getAll();
      const filtered = contacts.filter(c => c.id !== id);
      fs.writeFileSync(contactsFile, JSON.stringify(filtered, null, 2), 'utf-8');
      return true;
    } catch (error) {
      Logger.error('Error deleting contact', error);
      return false;
    }
  }

  markAsRead(id) {
    const contact = this.getById(id);
    if (contact) {
      contact.read = true;
      this.save(contact);
    }
  }
}

module.exports = new ContactRepository();
