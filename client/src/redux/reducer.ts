import {USER_LOGIN, USER_LOGOUT, UserActionTypes} from './types';
import {AccountTypes} from '../types/types';

export type State = {
  user: {
    isAuthenticated: boolean,
    token: string | null,
    userId: string | null,
    accountType: AccountTypes | null,
    username: string| null
  },
}

const initialState: State = {
  user: {
    isAuthenticated: false,
    token: null,
    userId: null,
    accountType: null,
    username: null,
  },
};

export const reducer = (
  state = initialState,
  action: UserActionTypes,
): State => {
  switch (action.type) {
  case USER_LOGIN:
    return {
      ...state,
      user: {
        isAuthenticated: true,
        username: action.payload.username,
        token: action.payload.token,
        userId: action.payload.userId,
        accountType: action.payload.accountType,
      },
    };

  case USER_LOGOUT:
    return {
      ...state,
      user: {
        isAuthenticated: false,
        username: null,
        token: null,
        userId: null,
        accountType: null,
      },
    };
  }

  return state;
};
