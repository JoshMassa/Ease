import React, { createContext, useState, useEffect, useContext } from 'react';
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

  const login = (token) => {
    AuthService.login(token);
    setIsLoggedIn(true);
    setUser(AuthService.getProfile());
  };

  const logout = () => {
    AuthService.logout();
    setIsLoggedIn(false);
    setUser(null);
  };

  const value = {
    user,
    setUser,
    isLoggedIn,
    setIsLoggedIn,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
