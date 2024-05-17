import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();


// This will serve as front end client side theme rendering.
export const useTheme = () => useContext(ThemeContext);
export const ThemeProviderWelcome = ({ children }) => {
  const [theme, setTheme] = useState('');

  const updateTheme = (newTheme) => {
    localStorage.setItem('theme-welcome', newTheme);
    setTheme(newTheme);
  };

  const getCurrentTheme = () => {
    // Get the theme value from localStorage
    const storedTheme = localStorage.getItem('theme');
  
    // Return the stored theme, or a default theme if not found
    return storedTheme || 'primary';
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, getCurrentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};