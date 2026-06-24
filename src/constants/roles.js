const ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  READER: 'reader',
  USER: 'user',
};

const rolePermissions = {
  admin: ['read', 'create', 'update', 'delete'],
  editor: ['read', 'create', 'update'],
  reader: ['read'],
  user: ['read'],
};

module.exports = {
  ROLES,
  PERMISSIONS: rolePermissions,
};
