class Contact {
  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || '';
    this.email = data.email || '';
    this.subject = data.subject || '';
    this.message = data.message || '';
    this.status = data.status || 'new';
    this.read = data.read || false;
    this.createdAt = data.createdAt || new Date().toISOString();
  }

  validate() {
    const errors = {};
    if (!this.name?.trim()) errors.name = 'Name is required';
    if (!this.email?.trim()) errors.email = 'Email is required';
    if (!this.subject?.trim()) errors.subject = 'Subject is required';
    if (!this.message?.trim()) errors.message = 'Message is required';
    return Object.keys(errors).length > 0 ? errors : null;
  }
}

module.exports = Contact;
