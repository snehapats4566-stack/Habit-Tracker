import { useState, useEffect, useCallback } from 'react';

const THEME_KEY = 'streakflow_theme';

export default function useTheme() {
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem(THEME_KEY) || 'system';
  });

  const applyTheme = useCallback((t) => {
    const root = document.documentElement;
    if (t === 'dark') {
      root.classList.add('dark');
    } else if (t === 'light') {
      root.classList.remove('dark');
    } else {
      // system
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
    }
  }, []);

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme, applyTheme]);

  useEffect(() => {
    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => {
      document.documentElement.classList.toggle('dark', e.matches);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  const setTheme = useCallback((t) => {
    setThemeState(t);
  }, []);

  const toggleDarkLight = useCallback(() => {
    setThemeState(prev => {
      const isDark = document.documentElement.classList.contains('dark');
      return isDark ? 'light' : 'dark';
    });
  }, []);

  return { theme, setTheme, toggleDarkLight };
}
