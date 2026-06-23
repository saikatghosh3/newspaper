'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/settings')
      .then(r => r.json())
      .then(d => { if (!cancelled && d.settings) setSettings(d.settings); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
