class User {
  constructor(data = {}) {
    this.id = data.id || null;
    this.email = data.email || '';
    this.password = data.password || '';
    this.name = data.name || '';
    this.role = data.role || 'user';
    this.status = data.status || 'active';
    this.lastLogin = data.lastLogin || null;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  validate() {
    const errors = {};
    if (!this.email?.trim()) errors.email = 'Email is required';
    if (!this.password?.trim()) errors.password = 'Password is required';
    if (this.password?.length < 6) errors.password = 'Password must be at least 6 characters';
    return Object.keys(errors).length > 0 ? errors : null;
  }
}

module.exports = User;
