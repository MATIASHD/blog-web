const prisma = require('../lib/prisma');
const Logger = require('../utils/logger');

class ContactRepository {
  async getAll() {
    try {
      return await prisma.contact.findMany({ orderBy: { created_at: 'desc' } });
    } catch (error) {
      Logger.error('Error reading contacts', error);
      return [];
    }
  }

  async getById(id) {
    try {
      return await prisma.contact.findUnique({ where: { id } });
    } catch (error) {
      Logger.error('Error getting contact by id', error);
      return null;
    }
  }

  async save(contactData) {
    try {
      if (contactData.id) {
        return await prisma.contact.update({
          where: { id: contactData.id },
          data: contactData,
        });
      } else {
        return await prisma.contact.create({ data: contactData });
      }
    } catch (error) {
      Logger.error('Error saving contact', error);
      return null;
    }
  }

  async delete(id) {
    try {
      await prisma.contact.delete({ where: { id } });
      return true;
    } catch (error) {
      Logger.error('Error deleting contact', error);
      return false;
    }
  }

  async markAsRead(id) {
    try {
      const contact = await prisma.contact.findUnique({ where: { id } });
      if (contact && contact.status === 'pending') {
        await prisma.contact.update({ where: { id }, data: { status: 'read' } });
      }
    } catch (error) {
      Logger.error('Error marking contact as read', error);
    }
  }
}

module.exports = new ContactRepository();
