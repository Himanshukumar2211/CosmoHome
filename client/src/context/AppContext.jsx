import { createContext, useMemo } from 'react';
import { APP_CONFIG } from '../config/app.config.js';

export const AppContext = createContext(null);

export function AppProvider({ children }) {
  const value = useMemo(() => ({ app: APP_CONFIG }), []);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
