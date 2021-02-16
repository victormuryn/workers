import {USER_LOGIN, USER_LOGOUT} from './types';

const initialState = {
  user: {
    isAuthenticated: false,
    token: null,
    userId: null,
    accountType: null,
    login: null,
  },
};

export const reducer = (state = initialState, action) => {
  const {type, payload} = action;

  switch (type) {
  case USER_LOGIN:
    return {
      ...state,
      user: {
        isAuthenticated: true,
        token: payload.token,
        login: payload.login,
        userId: payload.userId,
        accountType: payload.accountType,
      },
    };

  case USER_LOGOUT:
    return {
      ...state,
      user: {
        isAuthenticated: false,
        token: null,
        userId: null,
        accountType: null,
      },
    };
  }

  return state;
};
