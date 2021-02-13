import {USER_LOGIN, USER_LOGOUT} from './types';

const initialState = {
  user: {
    isAuthenticated: false,
    token: null,
    userId: null,
  },
};

export const ActionCreator = ({
  login: (token, userId) => ({
    type: USER_LOGIN,
    payload: {token, userId},
  }),

  logout: () => ({
    type: USER_LOGOUT,
    payload: {},
  }),
});

export const reducer = (state = initialState, action) => {
  const {type, payload} = action;

  switch (type) {
  case USER_LOGIN:
    return {
      ...state,
      user: {
        isAuthenticated: true,
        token: payload.token,
        userId: payload.userId,
      },
    };

  case USER_LOGOUT:
    return {
      ...state,
      user: {
        isAuthenticated: false,
        token: null,
        userId: null,
      },
    };
  }

  return state;
};
