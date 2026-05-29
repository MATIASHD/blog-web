module.exports = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest',
};

const rolePermissions = {
  admin: ['read', 'create', 'update', 'delete'],
  user: ['read'],
  guest: ['read'],
};

module.exports = {
  ROLES: {
    ADMIN: 'admin',
    USER: 'user',
    GUEST: 'guest',
  },
  PERMISSIONS: rolePermissions,
};
