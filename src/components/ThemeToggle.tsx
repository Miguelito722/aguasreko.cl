import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Monitor, ChevronDown } from 'lucide-react';
import { useDarkMode, Theme } from '../hooks/useDarkMode';

const ThemeToggle: React.FC = () => {
  const { theme, isDark, setTheme } = useDarkMode();
  const [isOpen, setIsOpen] = useState(false);

  const themes: { value: Theme; label: string; icon: React.ComponentType<any> }[] = [
    { value: 'light', label: 'Claro', icon: Sun },
    { value: 'dark', label: 'Oscuro', icon: Moon },
    { value: 'system', label: 'Sistema', icon: Monitor }
  ];

  const currentTheme = themes.find(t => t.value === theme);

  const handleThemeSelect = (newTheme: Theme) => {
    setTheme(newTheme);
    setIsOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent, newTheme: Theme) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleThemeSelect(newTheme);
    }
  };

  return (
    <div className="relative">
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-300
          ${isDark 
            ? 'bg-gray-800 text-gray-200 hover:bg-gray-700 border border-gray-600' 
            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${isDark ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'}
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={`Tema actual: ${currentTheme?.label}. Hacer clic para cambiar tema`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <motion.div
          key={theme}
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {currentTheme && <currentTheme.icon className="h-4 w-4" />}
        </motion.div>
        <span className="hidden sm:block text-sm font-medium">
          {currentTheme?.label}
        </span>
        <ChevronDown 
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Menu */}
            <motion.div
              className={`
                absolute top-full right-0 mt-2 w-48 rounded-xl shadow-lg border z-50
                ${isDark 
                  ? 'bg-gray-800 border-gray-600' 
                  : 'bg-white border-gray-200'
                }
              `}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              role="menu"
              aria-label="Opciones de tema"
            >
              <div className="p-2">
                {themes.map((themeOption, index) => (
                  <motion.button
                    key={themeOption.value}
                    onClick={() => handleThemeSelect(themeOption.value)}
                    onKeyDown={(e) => handleKeyDown(e, themeOption.value)}
                    className={`
                      w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200
                      ${theme === themeOption.value
                        ? isDark
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-100 text-blue-900'
                        : isDark
                          ? 'text-gray-300 hover:bg-gray-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset
                    `}
                    whileHover={{ x: 5 }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    role="menuitem"
                    aria-label={`Cambiar a tema ${themeOption.label}`}
                  >
                    <themeOption.icon className="h-4 w-4 flex-shrink-0" />
                    <span className="font-medium">{themeOption.label}</span>
                    {theme === themeOption.value && (
                      <motion.div
                        className="ml-auto w-2 h-2 bg-current rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeToggle;