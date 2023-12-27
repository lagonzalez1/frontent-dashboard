import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('');

  const updateTheme = (newTheme) => {
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  };

  const getCurrentTheme = () => {
    // Get the theme value from localStorage
    const storedTheme = localStorage.getItem('theme');
  
    // Return the stored theme, or a default theme if not found
    return storedTheme || 'light';
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, getCurrentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
