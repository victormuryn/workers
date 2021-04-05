import {USER_LOGIN, USER_LOGOUT, UserActionTypes} from '../types';
import {AccountTypes} from '../../types/types';

export type State = {
  isAuthenticated: boolean,
  token: string | null,
  userId: string | null,
  accountType: AccountTypes | null,
  username: string| null
}

const initialState: State = {
  isAuthenticated: false,
  token: null,
  userId: null,
  accountType: null,
  username: null,
};

export default (
  state = initialState,
  action: UserActionTypes,
): State => {
  switch (action.type) {
  case USER_LOGIN:
    return {
      ...state,
      isAuthenticated: true,
      username: action.payload.username,
      token: action.payload.token,
      userId: action.payload.userId,
      accountType: action.payload.accountType,
    };

  case USER_LOGOUT:
    return {
      ...state,
      isAuthenticated: false,
      username: null,
      token: null,
      userId: null,
      accountType: null,
    };
  }

  return state;
};
