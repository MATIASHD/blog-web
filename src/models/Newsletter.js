class Newsletter {
  constructor(data = {}) {
    this.id = data.id || null;
    this.email = data.email || '';
    this.name = data.name || '';
    this.status = data.status || 'subscribed';
    this.subscriptionDate = data.subscriptionDate || new Date().toISOString();
    this.lastEmail = data.lastEmail || null;
    this.unsubscribeToken = data.unsubscribeToken || null;
  }

  validate() {
    const errors = {};
    if (!this.email?.trim()) errors.email = 'Email is required';
    return Object.keys(errors).length > 0 ? errors : null;
  }
}

module.exports = Newsletter;
