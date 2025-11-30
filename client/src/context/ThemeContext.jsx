import { createContext, useContext, useEffect, useState } from 'react';

/**
 * ThemeContext
 * Manages dark/light theme state and persistence
 */
const ThemeContext = createContext();

/**
 * ThemeProvider Component
 * Wraps the application to provide theme context
 * 
 * @component
 * @example
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 * 
 * @param {React.ReactNode} children - Child components
 * @returns {JSX.Element}
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [isLoading, setIsLoading] = useState(true);

  // Initialize theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    applyTheme(initialTheme);
    setIsLoading(false);
  }, []);

  // Apply theme to DOM and save to localStorage
  const applyTheme = (newTheme) => {
    const htmlElement = document.documentElement;

    if (newTheme === 'dark') {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }

    localStorage.setItem('theme', newTheme);
  };

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  // Set theme function
  const setThemeValue = (newTheme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  const value = {
    theme,
    toggleTheme,
    setTheme: setThemeValue,
    isDark: theme === 'dark',
    isLight: theme === 'light',
  };

  return (
    <ThemeContext.Provider value={value}>
      {!isLoading && children}
    </ThemeContext.Provider>
  );
}

/**
 * useTheme Hook
 * Access theme context in components
 * 
 * @hook
 * @example
 * const { theme, toggleTheme, isDark } = useTheme();
 * 
 * @returns {Object} Theme context value
 * @throws {Error} If used outside ThemeProvider
 */
export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}

export default ThemeContext;
