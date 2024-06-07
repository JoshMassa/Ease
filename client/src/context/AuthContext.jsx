import React, { createContext, useState, useEffect } from 'react';
import AuthService from '../utils/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    const loggedIn = AuthService.loggedIn();
    setIsLoggedIn(loggedIn);
    if (loggedIn) {
      setUser(AuthService.getProfile());
    }
  }, []);

  const value = {
    user,
    setUser,
    isLoggedIn,
    setIsLoggedIn,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
