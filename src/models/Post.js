class Post {
  constructor(data = {}) {
    this.id = data.id || null;
    this.title = data.title || '';
    this.slug = data.slug || '';
    this.author = data.author || '';
    this.description = data.description || '';
    this.content = data.content || '';
    this.image = data.image || '';
    this.tags = data.tags || [];
    this.category = data.category || '';
    this.date = data.date || new Date().toISOString();
    this.status = data.status || 'published';
    this.views = data.views || 0;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  validate() {
    const errors = {};
    if (!this.title?.trim()) errors.title = 'Title is required';
    if (!this.slug?.trim()) errors.slug = 'Slug is required';
    if (!this.content?.trim()) errors.content = 'Content is required';
    return Object.keys(errors).length > 0 ? errors : null;
  }
}

module.exports = Post;
