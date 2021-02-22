import {USER_LOGIN, USER_LOGOUT, UserActionTypes, User} from './types';

export const ActionCreator = ({
  login: (data: User): UserActionTypes => ({
    type: USER_LOGIN,
    payload: {...data},
  }),

  logout: (): UserActionTypes => ({
    type: USER_LOGOUT,
  }),
});
