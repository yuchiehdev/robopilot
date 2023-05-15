export type PermissionType = 'Guest' | 'Engineer' | 'Site Vender' | 'Developer';

const AUTHORIZATION = {
  Dashboard: {
    create: new Set(['Developer']),
    read: new Set(['Developer', 'Site Vender', 'Engineer', 'Guest']),
    update: new Set(['Developer']),
    delete: new Set(['Developer']),
  },
  Device: {
    create: new Set(['Developer', 'Site Vender']),
    read: new Set(['Developer', 'Site Vender', 'Engineer', 'Guest']),
    update: new Set(['Developer', 'Site Vender']),
    delete: new Set(['Developer', 'Site Vender']),
  },
  Alarm: {
    create: new Set(['Developer']),
    read: new Set(['Developer', 'site vendor', 'Engineer', 'Guest']),
    update: new Set(['Developer', 'Site Vender', 'Engineer']),
    delete: new Set(['Developer']),
  },
  Event: {
    create: new Set(['Developer']),
    read: new Set(['Developer', 'site vendor', 'Engineer', 'Guest']),
    update: new Set(['Developer', 'Site Vender', 'Engineer']),
    delete: new Set(['Developer']),
  },
  UserEvent: {
    create: new Set(['Developer']),
    read: new Set(['Developer']),
    update: new Set(['Developer']),
    delete: new Set(['Developer']),
  },
  Maintenance: {
    create: new Set(['Developer']),
    read: new Set(['Developer', 'Site vendor', 'Engineer', 'Guest']),
    update: new Set(['Developer', 'Site Vender', 'Engineer']),
    delete: new Set(['Developer']),
  },
  Assembly: {
    create: new Set(['Developer', 'Site Vender']),
    read: new Set(['Developer', 'Site vendor', 'Engineer', 'Guest']),
    update: new Set(['Developer', 'Site Vender']),
    delete: new Set(['Developer', 'Site Vender']),
  },
  Controller: {
    create: new Set(['Developer']),
    read: new Set(['Developer', 'Site Vender', 'Engineer']),
    update: new Set(['Developer', 'Site Vender']),
    delete: new Set(['Developer']),
  },
  Vision: {
    create: new Set(['Developer']),
    read: new Set(['Developer', 'Site Vender', 'Engineer']),
    update: new Set(['Developer', 'Site Vender']),
    delete: new Set(['Developer']),
  },
  User: {
    create: new Set(['Developer', 'Site Vender']),
    read: new Set(['Developer', 'Site Vender']),
    update: new Set(['Developer', 'Site Vender']),
    delete: new Set(['Developer', 'Site Vender']),
  },
  LevelIllustration: {
    create: new Set(['Developer', 'Site Vender']),
    read: new Set(['Developer', 'Site Vender']),
    update: new Set(['Developer', 'Site Vender']),
    delete: new Set(['Developer', 'Site Vender']),
  },
  SignIn: {
    create: new Set(['Developer', 'Site Vender', 'Engineer', 'Guest']),
    read: new Set(['Developer', 'Site Vender', 'Engineer', 'Guest']),
    update: new Set(['Developer', 'Site Vender', 'Engineer', 'Guest']),
    delete: new Set(['Developer', 'Site Vender', 'Engineer', 'Guest']),
  },
  Unauthorized: {
    create: new Set(['Developer', 'Site Vender', 'Engineer', 'Guest']),
    read: new Set(['Developer', 'Site Vender', 'Engineer', 'Guest']),
    update: new Set(['Developer', 'Site Vender', 'Engineer', 'Guest']),
    delete: new Set(['Developer', 'Site Vender', 'Engineer', 'Guest']),
  },
  Status: {
    create: new Set(['Developer']),
    read: new Set(['Developer']),
    update: new Set(['Developer']),
    delete: new Set(['Developer']),
  },
};

export default AUTHORIZATION;
