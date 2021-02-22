import {AccountTypes} from '../types/types';

export const USER_LOGIN = `USER/LOGIN`;
export const USER_LOGOUT = `USER/LOGOUT`;

export interface User {
  token: string,
  userId: string,
  accountType: AccountTypes,
  username: string
}

interface UserLoginAction {
  type: typeof USER_LOGIN
  payload: User
}

interface UserLogoutAction {
  type: typeof USER_LOGOUT
}

export type UserActionTypes = UserLoginAction | UserLogoutAction;
