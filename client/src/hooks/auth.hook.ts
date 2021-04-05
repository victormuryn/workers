import {useState, useCallback, useEffect} from 'react';
import {Action, Dispatch} from 'redux';
import {ActionCreator} from '../redux/action-creator';
import {User} from '../redux/types';
import {AccountTypes} from '../types/types';

// logged user data keeps in localstorage
const storageName = `user`;

type Login = (
  token: string,
  userId: string,
  accountType: AccountTypes,
  username: string
) => void;

export const useAuth = (dispatch: Dispatch<Action>) => {
  // have we checked is user logged
  const [ready, setReady] = useState(false);

  const login = <Login>useCallback((
    token, userId, accountType, username,
  ) => {
    // set logged user data to redux state
    dispatch(ActionCreator.login({token, userId, accountType, username}));
    dispatch(ActionCreator.initMessages(username, token)(dispatch));

    // set data to localstorage
    localStorage.setItem(storageName, JSON.stringify({
      token, userId, accountType, username,
    }));
  }, []);

  // const logout = useCallback((id: string | null, token: string | null) => {
  const logout = useCallback(() => {
    // remove data from state
    dispatch(ActionCreator.logout());
    dispatch(ActionCreator.offSocket());

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
        const {token, userId, accountType, username} = parsedData;
        login(token, userId, accountType, username);
      }

      // set that we checked if user logged
      setReady(true);
    })();
  }, [login]);

  return {login, logout, ready};
};
