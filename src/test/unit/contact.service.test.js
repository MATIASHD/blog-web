import { describe, test, expect, vi, beforeEach } from 'vitest';
const contactService = require('../../services/contact.service');
const contactRepository = require('../../repositories/contact.repository');

describe('ContactService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('getAllContacts', () => {
    test('should return all contacts successfully', async () => {
      const mockContacts = [
        { id: '1', name: 'User 1', email: 'u1@example.com', message: 'Hello' },
        { id: '2', name: 'User 2', email: 'u2@example.com', message: 'Hi' },
      ];
      const getAllSpy = vi.spyOn(contactRepository, 'getAll').mockResolvedValue(mockContacts);

      const result = await contactService.getAllContacts();

      expect(getAllSpy).toHaveBeenCalled();
      expect(result).toEqual(mockContacts);
    });

    test('should return empty array if repository throws error', async () => {
      vi.spyOn(contactRepository, 'getAll').mockRejectedValue(new Error('DB error'));

      const result = await contactService.getAllContacts();

      expect(result).toEqual([]);
    });
  });

  describe('getContactById', () => {
    test('should return contact and mark as read if found', async () => {
      const mockContact = { id: '1', name: 'User 1', status: 'pending' };
      const getByIdSpy = vi.spyOn(contactRepository, 'getById').mockResolvedValue(mockContact);
      const markAsReadSpy = vi.spyOn(contactRepository, 'markAsRead').mockResolvedValue(true);

      const result = await contactService.getContactById('1');

      expect(getByIdSpy).toHaveBeenCalledWith('1');
      expect(markAsReadSpy).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockContact);
    });

    test('should return null if contact not found', async () => {
      const getByIdSpy = vi.spyOn(contactRepository, 'getById').mockResolvedValue(null);
      const markAsReadSpy = vi.spyOn(contactRepository, 'markAsRead');

      const result = await contactService.getContactById('999');

      expect(getByIdSpy).toHaveBeenCalledWith('999');
      expect(markAsReadSpy).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('createContact', () => {
    test('should create and save a new contact successfully', async () => {
      const inputData = { name: 'User 1', email: 'u1@example.com', subject: 'Inquiry', message: 'Hello!' };
      const savedContact = { id: 'new-id', ...inputData, status: 'pending' };
      const saveSpy = vi.spyOn(contactRepository, 'save').mockResolvedValue(savedContact);

      const result = await contactService.createContact(inputData);

      expect(saveSpy).toHaveBeenCalledWith({
        name: 'User 1',
        email: 'u1@example.com',
        subject: 'Inquiry',
        message: 'Hello!',
        status: 'pending',
      });
      expect(result).toEqual(savedContact);
    });
  });

  describe('updateContactStatus', () => {
    test('should update contact status successfully', async () => {
      const mockContact = { id: '1', name: 'User 1', status: 'pending' };
      const getByIdSpy = vi.spyOn(contactRepository, 'getById').mockResolvedValue(mockContact);
      const saveSpy = vi.spyOn(contactRepository, 'save').mockResolvedValue({ ...mockContact, status: 'replied' });

      const result = await contactService.updateContactStatus('1', 'replied');

      expect(getByIdSpy).toHaveBeenCalledWith('1');
      expect(saveSpy).toHaveBeenCalledWith({
        id: '1',
        name: 'User 1',
        status: 'replied',
      });
      expect(result.status).toBe('replied');
    });

    test('should throw error if contact not found to update', async () => {
      vi.spyOn(contactRepository, 'getById').mockResolvedValue(null);

      await expect(contactService.updateContactStatus('999', 'replied'))
        .rejects.toThrow('Contact not found');
    });
  });

  describe('getUnreadCount', () => {
    test('should calculate correct unread count', async () => {
      const mockContacts = [
        { id: '1', status: 'pending' },
        { id: '2', status: 'replied' },
        { id: '3', status: 'pending' },
      ];
      vi.spyOn(contactRepository, 'getAll').mockResolvedValue(mockContacts);

      const count = await contactService.getUnreadCount();

      expect(count).toBe(2);
    });
  });
});
