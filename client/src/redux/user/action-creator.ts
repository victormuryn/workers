import {
  USER_LOGIN,
  USER_LOGOUT,
  USER_SET_AVATAR,
} from './types';

import {
  User,
  UserActionTypes,
} from './types';
import {Image} from '../../types/types';

const ActionCreator = {
  login: (data: User): UserActionTypes => ({
    type: USER_LOGIN,
    payload: {...data},
  }),

  logout: () => ({
    type: USER_LOGOUT,
  }),

  setAvatar: (data: Image): UserActionTypes => ({
    type: USER_SET_AVATAR,
    payload: data,
  }),
};

export default ActionCreator;
