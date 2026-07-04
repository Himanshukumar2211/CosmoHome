import { createContext, useEffect, useMemo, useState } from 'react';
import { getAdminProfile, logoutAdmin } from '../services/auth.api.js';
import { unwrapApiData } from '../utils/apiData.js';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getAdminProfile()
      .then((response) => {
        if (active) setAdmin(unwrapApiData(response, 'admin'));
      })
      .catch(() => {
        if (active) setAdmin(null);
      })
      .finally(() => {
        if (active) setAuthLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const signOut = async () => {
    try {
      await logoutAdmin();
    } finally {
      setAdmin(null);
    }
  };

  const value = useMemo(
    () => ({
      admin,
      isAuthenticated: Boolean(admin),
      authLoading,
      setAdmin,
      clearAdmin: () => setAdmin(null),
      signOut,
    }),
    [admin, authLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
