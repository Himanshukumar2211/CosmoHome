import { useCallback, useState } from 'react';

export const useApi = (request) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      try {
        const response = await request(...args);
        setData(response.data);
        return response;
      } catch (requestError) {
        setError(requestError);
        throw requestError;
      } finally {
        setLoading(false);
      }
    },
    [request],
  );

  return { data, error, loading, execute };
};
