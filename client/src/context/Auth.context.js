import {createContext} from 'react';

export default createContext({
  token: null,
  userId: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});
