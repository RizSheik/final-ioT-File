import { createContext, useContext } from 'react';

type Theme = 'dark' | 'light' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: 'dark' | 'light';
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function useTheme() {
  return {
    theme: 'light',
    setTheme: () => {},
    actualTheme: 'light'
  };
}

export function useThemeProvider() {
  return {
    theme: 'light',
    setTheme: () => {},
    actualTheme: 'light'
  };
}

export { ThemeContext };
