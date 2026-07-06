import { createContext, useEffect, useMemo, useState } from 'react';
import { APP_CONFIG } from '../config/app.config.js';
import { getSettings } from '../services/settings.api.js';
import { unwrapApiData } from '../utils/apiData.js';

export const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    getSettings()
      .then((response) => {
        const data = unwrapApiData(response, 'settings');
        setSettings(data || null);
      })
      .catch(() => {
        setSettings(null);
      });
  }, []);

  const value = useMemo(
    () => ({
      app: APP_CONFIG,
      settings,
      setSettings,
    }),
    [settings]
  );

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}