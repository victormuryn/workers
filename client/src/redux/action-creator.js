import {USER_LOGIN, USER_LOGOUT} from './types';

export const ActionCreator = ({
  login: (token, userId, accountType, login) => ({
    type: USER_LOGIN,
    payload: {token, userId, accountType, login},
  }),

  logout: () => ({
    type: USER_LOGOUT,
    payload: {},
  }),
});
