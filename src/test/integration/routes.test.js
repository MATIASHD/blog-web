import { describe, test, expect, vi, beforeEach } from 'vitest';
const request = require('supertest');
const app = require('../../app');

describe('Public Endpoints Integration Tests', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('GET /', () => {
    test('should render home index page successfully (served statically)', async () => {
      const response = await request(app)
        .get('/')
        .expect('Content-Type', /html/)
        .expect(200);

      // Homepage is served statically from src/public/index.html via express.static
      expect(response.text).toContain('Inicio');
    });
  });

  describe('GET /about', () => {
    test('should render about page successfully', async () => {
      const response = await request(app)
        .get('/about')
        .expect('Content-Type', /html/)
        .expect(200);

      expect(response.text).toContain('Sobre m');
    });
  });

  describe('GET /contact', () => {
    test('should render contact page successfully', async () => {
      const response = await request(app)
        .get('/contact')
        .expect('Content-Type', /html/)
        .expect(200);

      expect(response.text).toContain('Contacto');
    });
  });

  describe('POST /contact', () => {
    test('should handle valid contact submission successfully', async () => {
      const contactService = require('../../services/contact.service');
      const emailService = require('../../services/email.service');
      
      const mockContact = { id: 'c-1', name: 'Matias', email: 'test@example.com', message: 'Hello' };
      const contactServiceProto = Object.getPrototypeOf(contactService);
      const createSpy = vi.spyOn(contactServiceProto, 'createContact').mockResolvedValue(mockContact);
      
      const emailServiceProto = Object.getPrototypeOf(emailService);
      const emailSpy = vi.spyOn(emailServiceProto, 'sendContactNotification').mockImplementation(() => {});

      const response = await request(app)
        .post('/contact')
        .type('form')
        .send({
          nombre: 'Matias',
          email: 'test@example.com',
          asunto: 'Test',
          mensaje: 'Hello'
        })
        .expect(200);

      expect(createSpy).toHaveBeenCalled();
      expect(emailSpy).toHaveBeenCalled();
      expect(response.text).toContain('enviado correctamente');
    });

    test('should render error if validation fails', async () => {
      const contactService = require('../../services/contact.service');
      const contactServiceProto = Object.getPrototypeOf(contactService);
      const createSpy = vi.spyOn(contactServiceProto, 'createContact');

      const response = await request(app)
        .post('/contact')
        .type('form')
        .send({
          nombre: '',
          email: 'invalid-email',
          asunto: 'Test',
          mensaje: ''
        })
        .expect(200);

      expect(createSpy).not.toHaveBeenCalled();
      expect(response.text).toContain('Name is required');
    });
  });

  describe('GET /newsletter', () => {
    test('should render newsletter page successfully', async () => {
      const response = await request(app)
        .get('/newsletter')
        .expect('Content-Type', /html/)
        .expect(200);

      expect(response.text).toContain('Newsletter');
    });
  });

  describe('POST /newsletter', () => {
    test('should handle valid newsletter subscription', async () => {
      const newsletterService = require('../../services/newsletter.service');
      const emailService = require('../../services/email.service');

      const mockSubscriber = { id: 's-1', email: 'news@example.com', confirm_token: 'token-123' };
      const newsletterServiceProto = Object.getPrototypeOf(newsletterService);
      const subscribeSpy = vi.spyOn(newsletterServiceProto, 'subscribe').mockResolvedValue(mockSubscriber);
      
      const emailServiceProto = Object.getPrototypeOf(emailService);
      const emailSpy = vi.spyOn(emailServiceProto, 'sendNewsletterConfirmation').mockImplementation(() => {});

      const response = await request(app)
        .post('/newsletter')
        .type('form')
        .send({ email: 'news@example.com' })
        .expect(200);

      expect(subscribeSpy).toHaveBeenCalledWith('news@example.com');
      expect(emailSpy).toHaveBeenCalledWith('news@example.com', 'token-123');
      expect(response.text).toContain('Suscripción exitosa');
    });

    test('should render error for invalid email', async () => {
      const response = await request(app)
        .post('/newsletter')
        .type('form')
        .send({ email: 'bad-email' })
        .expect(200);

      expect(response.text).toContain('Email');
    });
  });

  describe('GET /login', () => {
    test('should render login page successfully', async () => {
      const response = await request(app)
        .get('/login')
        .expect('Content-Type', /html/)
        .expect(200);

      expect(response.text).toContain('Login');
    });
  });
});
