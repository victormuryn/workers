import {useState, useCallback, useEffect} from 'react';
import {ActionCreator} from '../redux/action-creator';

// logged user data keeps in localstorage
const storageName = `user`;

export const useAuth = (dispatch) => {
  // have we checked is user logged
  const [ready, setReady] = useState(false);

  const login = useCallback((jwt, id, type, login) => {
    // set logged user data to redux state
    dispatch(ActionCreator.login(jwt, id, type, login));

    // set data to localstorage
    localStorage.setItem(storageName, JSON.stringify({
      token: jwt,
      userId: id,
      accountType: type,
      loginName: login,
    }));
  }, []);

  const logout = useCallback(() => {
    // remove data from state
    dispatch(ActionCreator.logout());

    // remove data from localstorage
    localStorage.removeItem(storageName);
  }, []);

  // on mount
  useEffect(async () => {
    // get user data from storage
    const data = localStorage.getItem(storageName);

    if (data) {
      // parse and login user
      const parsedData = await JSON.parse(data);
      const {token, userId, accountType, loginName} = parsedData;
      login(token, userId, accountType, loginName);
    }

    // set that we checked if user logged
    setReady(true);
  }, [login]);

  return {login, logout, ready};
};
