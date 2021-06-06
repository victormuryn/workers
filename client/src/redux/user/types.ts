import {AccountTypes} from '../../types/types';

export const USER_LOGIN = `USER/LOGIN`;
export const USER_LOGOUT = `USER/LOGOUT`;
export const USER_SET_AVATAR = `USER/SET_AVATAR`;

export interface User {
  name: string
  token: string
  image: boolean
  userId: string
  surname: string
  username: string
  accountType: AccountTypes
}

interface UserLoginAction {
  type: typeof USER_LOGIN
  payload: User
}

interface UserLogoutAction {
  type: typeof USER_LOGOUT
}

interface UserSetAvatar {
  type: typeof USER_SET_AVATAR,
}

export type UserActionTypes =
  UserLoginAction |
  UserLogoutAction |
  UserSetAvatar;
