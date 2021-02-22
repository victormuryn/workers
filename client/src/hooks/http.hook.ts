import {useCallback, useState} from 'react';

type RequestType<T> = (
  url: RequestInfo,
  method?: `GET` | `POST` | `DELETE` | `OPTIONS`,
  reqBody?: object,
  headers?: {
    [key: string]: string
  }
) => T;

interface UseHttpReturn<T> {
  loading: boolean,
  request: RequestType<T>,
  error: string | null,
  clearError: () => void,
}

export const useHttp = <T>(): UseHttpReturn<T> => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const request = <RequestType<T>><unknown>useCallback(
    async (url, method = `GET`, reqBody = undefined, headers = {}) => {
      setLoading(true);

      try {
        let body: string | null = null;

        if (reqBody) {
          body = JSON.stringify(reqBody);
          headers[`Content-Type`] = `application/json`;
        }

        const response = await fetch(url, {method, body, headers});
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Щось пішло не так');
        }

        setLoading(false);
        return data;
      } catch (e) {
        setLoading(false);
        setError(e.message);
        throw e;
      }
    }, []);

  const clearError = () => setError(null);

  return {loading, request, error, clearError};
}
;
