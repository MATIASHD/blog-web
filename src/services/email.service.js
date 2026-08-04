const https = require('https');
const Logger = require('../utils/logger');

const BREVO_API_KEY = process.env.BREVO_API_KEY || '';
const BREVO_API_URL = 'api.brevo.com';
const FROM_EMAIL = process.env.BREVO_FROM_EMAIL || 'noreply@arevdev.com';
const FROM_NAME = process.env.BREVO_FROM_NAME || 'Arevdev';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@arevdev.com';

class EmailService {
  get enabled() {
    return !!BREVO_API_KEY;
  }

  _apiRequest(endpoint, body) {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify(body);
      const options = {
        hostname: BREVO_API_URL,
        path: `/v3/${endpoint}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': BREVO_API_KEY,
          'Content-Length': Buffer.byteLength(data),
        },
      };
      const req = https.request(options, (res) => {
        let responseData = '';
        res.on('data', (chunk) => (responseData += chunk));
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(JSON.parse(responseData || '{}'));
          } else {
            Logger.error(`Brevo API error ${res.statusCode}: ${responseData}`);
            reject(new Error(`Brevo API error: ${res.statusCode}`));
          }
        });
      });
      req.on('error', reject);
      req.write(data);
      req.end();
    });
  }

  async sendContactNotification(contact) {
    if (!this.enabled) {
      Logger.info(`[EMAIL] Contact notification skipped (Brevo not configured): ${contact.email}`);
      return;
    }
    try {
      await this._apiRequest('smtp/email', {
        sender: { email: FROM_EMAIL, name: FROM_NAME },
        to: [{ email: ADMIN_EMAIL }],
        subject: `Nuevo mensaje de contacto: ${contact.subject || 'Sin asunto'}`,
        htmlContent: `<h3>Nuevo mensaje de contacto</h3>
<p><strong>Nombre:</strong> ${contact.name}</p>
<p><strong>Email:</strong> ${contact.email}</p>
<p><strong>Asunto:</strong> ${contact.subject || 'Sin asunto'}</p>
<p><strong>Mensaje:</strong></p>
<p>${contact.message}</p>`,
      });
      Logger.info(`Contact notification sent to admin from: ${contact.email}`);
    } catch (error) {
      Logger.error('Failed to send contact notification', error);
    }
  }

  async sendNewsletterConfirmation(email, confirmToken) {
    if (!this.enabled) {
      Logger.info(`[EMAIL] Newsletter confirmation skipped (Brevo not configured): ${email}`);
      return;
    }
    const confirmUrl = `${process.env.SITE_URL || 'https://arevdev.com'}/newsletter/confirm?token=${confirmToken}`;
    try {
      await this._apiRequest('smtp/email', {
        sender: { email: FROM_EMAIL, name: FROM_NAME },
        to: [{ email }],
        subject: 'Confirmá tu suscripción al newsletter',
        htmlContent: `<h3>¡Gracias por suscribirte!</h3>
<p>Hacé clic en el siguiente enlace para confirmar tu suscripción:</p>
<p><a href="${confirmUrl}">Confirmar suscripción</a></p>
<p>Si no solicitaste esta suscripción, ignorá este mensaje.</p>`,
      });
      Logger.info(`Newsletter confirmation email sent to: ${email}`);
    } catch (error) {
      Logger.error('Failed to send newsletter confirmation', error);
    }
  }
}

module.exports = new EmailService();
