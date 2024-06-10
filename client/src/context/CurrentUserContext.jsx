import React, { createContext, useState, useEffect } from 'react';
import AuthService from '../utils/auth'; // Assuming AuthService provides user info

export const CurrentUserContext = createContext();

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = AuthService.getProfile(); // Get user profile from AuthService
    setCurrentUser(user);
  }, []);

  return (
    <CurrentUserContext.Provider value={{ currentUser }}>
      {children}
    </CurrentUserContext.Provider>
  );
};