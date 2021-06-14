import {useState, useCallback, useEffect} from 'react';

import {ActionCreator} from '../redux/action-creator';

import {Action, Dispatch} from 'redux';

import {User} from '../redux/user/types';
import {AccountTypes} from '../types/types';

// logged user data keeps in localstorage
const storageName = `user`;

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

export const useAuth = (dispatch: Dispatch<Action>) => {
  // have we checked is user logged
  const [ready, setReady] = useState(false);

  const login = <Login>useCallback((data) => {
    const {token, username} = data;

    // @ts-ignore
    dispatch(ActionCreator.initMessages(username, token));

    // set logged user data to redux state
    dispatch(ActionCreator.login(data));

    // set data to localstorage
    localStorage.setItem(storageName, JSON.stringify(data));
  }, []);

  const logout = useCallback(() => {
    // turn off messages (socket.io)
    dispatch(ActionCreator.offSocket());

    // remove data from state
    dispatch(ActionCreator.logout());

    // remove data from localstorage
    localStorage.removeItem(storageName);
  }, []);

  // on mount
  useEffect(() => {
    (async () => {
      // get user data from storage
      const data = localStorage.getItem(storageName);

      if (data) {
        // parse and login user
        const parsedData: User = await JSON.parse(data);
        login(parsedData);
      }

      // set that we checked if user logged
      setReady(true);
    })();
  }, [login]);

  return {login, logout, ready};
};
