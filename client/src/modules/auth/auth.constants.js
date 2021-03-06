export const AUTH_ADMIN_ROLE = 'admin';
export const AUTH_RI_ROLE = 'ri';
export const AUTH_PM_ROLE = 'pm';
export const AUTH_DEPUTY_ROLE = 'deputy';
// Deputy role is an internal role that shouldn't be showed on the pages beacuse it is the same as a PM for now.
// If at some point PM and DEPUTY diverge, we will add it to the list
export const ALL_VISIBLE_ROLES = [AUTH_ADMIN_ROLE, AUTH_RI_ROLE, AUTH_PM_ROLE];

export const getRoleLabel = (role) => {
  switch (role) {
  case AUTH_ADMIN_ROLE:
    return 'Admin';
  case AUTH_RI_ROLE:
    return 'RI';
  case AUTH_PM_ROLE:
  case AUTH_DEPUTY_ROLE:
    return 'User';
  default:
    return 'Unknown';
  }
};

export const getRoleColor = (role) => {
  switch (role) {
  case AUTH_ADMIN_ROLE:
    return 'teal';
  case AUTH_RI_ROLE:
    return 'yellow';
  default:
    return null;
  }
};

export const getRoleIcon = (role) => {
  switch (role) {
  case AUTH_ADMIN_ROLE:
    return 'unlock';
  case AUTH_RI_ROLE:
    return 'unlock alternate';
  case AUTH_PM_ROLE:
  case AUTH_DEPUTY_ROLE:
    return 'lock';
  default:
    return 'warning sign';
  }
};

export const getRoleData = (role) => {
  return {
    'value': getRoleLabel(role),
    'color': getRoleColor(role),
    'icon': getRoleIcon(role)
  };
};

export default {
  LOGIN_REQUEST: 'LOGIN_REQUEST',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_INVALID_REQUEST: 'LOGIN_INVALID_REQUEST',
  LOGIN_NOT_AUTHORIZED: 'LOGIN_NOT_AUTHORIZED',
  LOGOUT_REQUEST: 'LOGOUT_REQUEST',
  LOGOUT_SUCCESS: 'LOGOUT_SUCCESS',
  PROFILE_REQUEST: 'PROFILE_REQUEST',
  PROFILE_SUCCESS: 'PROFILE_SUCCESS',
  PROFILE_FAILURE: 'PROFILE_FAILURE'
};
