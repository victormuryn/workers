import {createContext} from 'react';
import {AccountTypes} from '../types/types';

type Login = (
  data: {
    name: string,
    surname: string,
    image: {
      extension: string,
      buffer: string,
    },
    token: string,
    userId: string,
    accountType: AccountTypes,
    username: string,
  }
) => void;

// type Logout = (id: string | null, token: string | null) => void;

type ContextType = {
  isAuthenticated: boolean,
  login: Login,
  logout: () => void,
}

export default createContext({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
} as ContextType);
