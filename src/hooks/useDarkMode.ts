import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark' | 'system';

interface UseDarkModeReturn {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useDarkMode = (): UseDarkModeReturn => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Check localStorage first
    const stored = localStorage.getItem('aguasreko-theme') as Theme;
    if (stored && ['light', 'dark', 'system'].includes(stored)) {
      return stored;
    }
    
    // Default to system preference
    return 'system';
  });

  const [isDark, setIsDark] = useState(false);

  // Get system preference
  const getSystemPreference = (): boolean => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  // Calculate actual dark mode state
  const calculateIsDark = (currentTheme: Theme): boolean => {
    if (currentTheme === 'system') {
      return getSystemPreference();
    }
    return currentTheme === 'dark';
  };

  // Apply theme to document
  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    const actualIsDark = calculateIsDark(newTheme);
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    
    // Add new theme class
    root.classList.add(actualIsDark ? 'dark' : 'light');
    
    // Set data attribute for CSS targeting
    root.setAttribute('data-theme', actualIsDark ? 'dark' : 'light');
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', actualIsDark ? '#1f2937' : '#ffffff');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = actualIsDark ? '#1f2937' : '#ffffff';
      document.head.appendChild(meta);
    }
    
    setIsDark(actualIsDark);
  };

  // Set theme and persist to localStorage
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('aguasreko-theme', newTheme);
    applyTheme(newTheme);
    
    // Announce theme change to screen readers
    const announcement = `Tema cambiado a ${
      newTheme === 'system' ? 'automático' : 
      newTheme === 'dark' ? 'oscuro' : 'claro'
    }`;
    
    // Create temporary announcement element
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.textContent = announcement;
    document.body.appendChild(announcer);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcer);
    }, 1000);
  };

  // Toggle between light and dark (skip system)
  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setTheme(newTheme);
  };

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [theme]);

  // Apply initial theme
  useEffect(() => {
    applyTheme(theme);
  }, []);

  return {
    theme,
    isDark,
    setTheme,
    toggleTheme
  };
};