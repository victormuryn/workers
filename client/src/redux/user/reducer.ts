import {
  USER_LOGIN, USER_LOGOUT, USER_SET_AVATAR,
  UserActionTypes,
} from './types';
import {AccountTypes} from '../../types/types';

export type State = {
  name: string,
  token: string,
  image: {
    extension: string,
    buffer: string,
  },
  userId: string,
  surname: string,
  username: string,
  isAuthenticated: boolean,
  accountType: AccountTypes | null,
}

const initialState: State = {
  name: ``,
  token: ``,
  userId: ``,
  surname: ``,
  image: {
    extension: ``,
    buffer: ``,
  },
  username: ``,
  accountType: null,
  isAuthenticated: false,
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
      name: action.payload.name,
      image: action.payload.image,
      token: action.payload.token,
      userId: action.payload.userId,
      surname: action.payload.surname,
      username: action.payload.username,
      accountType: action.payload.accountType,
    };

  case USER_LOGOUT:
    return {
      ...state,
      ...initialState,
    };

  case USER_SET_AVATAR: {
    const storage = localStorage.getItem(`user`);

    if (typeof storage === `string`) {
      const parsedStorage = JSON.parse(storage);
      parsedStorage.image = action.payload;
      localStorage.setItem(`user`, JSON.stringify(parsedStorage));
    }

    return {
      ...state,
      image: action.payload,
    };
  }
  }

  return state;
};
