import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from '../hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeContextType {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  useSystemTheme: boolean;
  setUseSystemTheme: (value: boolean) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  setIsDarkMode: () => {},
  useSystemTheme: true,
  setUseSystemTheme: () => {},
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [useSystemTheme, setUseSystemTheme] = useState(true);

  useEffect(() => {
    loadThemeSettings();
  }, []);

  useEffect(() => {
    if (useSystemTheme) {
      setIsDarkMode(systemColorScheme === 'dark');
    }
  }, [systemColorScheme, useSystemTheme]);

  const loadThemeSettings = async () => {
    try {
      const [savedThemeMode, savedUseSystem] = await Promise.all([
        AsyncStorage.getItem('@theme_mode'),
        AsyncStorage.getItem('@theme_use_system'),
      ]);

      setUseSystemTheme(savedUseSystem === null ? true : savedUseSystem === 'true');
      
      if (savedUseSystem === 'false' && savedThemeMode !== null) {
        setIsDarkMode(savedThemeMode === 'dark');
      } else {
        setIsDarkMode(systemColorScheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme settings:', error);
    }
  };

  const updateIsDarkMode = async (value: boolean) => {
    setIsDarkMode(value);
    try {
      await AsyncStorage.setItem('@theme_mode', value ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme mode:', error);
    }
  };

  const updateUseSystemTheme = async (value: boolean) => {
    setUseSystemTheme(value);
    try {
      await AsyncStorage.setItem('@theme_use_system', value.toString());
      if (value) {
        setIsDarkMode(systemColorScheme === 'dark');
      }
    } catch (error) {
      console.error('Error saving system theme setting:', error);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        setIsDarkMode: updateIsDarkMode,
        useSystemTheme,
        setUseSystemTheme: updateUseSystemTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}; 