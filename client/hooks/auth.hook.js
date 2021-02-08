import {useState, useCallback, useEffect} from 'react';

const storageName = `user`;

export const useAuth = () => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [ready, setReady] = useState(false);

  const login = useCallback((jwt, id) => {
    setToken(jwt);
    setUserId(id);

    localStorage.setItem(storageName, JSON.stringify({token: jwt, userId: id}));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);

    localStorage.removeItem(storageName);
  }, []);

  useEffect(async () => {
    const data = localStorage.getItem(storageName);

    if (data) {
      const parsedData = await JSON.parse(data);
      login(parsedData.token, parsedData.userId);
    }

    setReady(true);
  }, [login]);

  return {login, logout, token, userId, ready};
};
