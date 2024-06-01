import React, { useState, useEffect } from 'react';
import AuthService from '../utils/auth';

const LoggedInIndicator = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const updateUser = () => {
      const profile = AuthService.getProfile();
      console.log('Profile:', profile);
      setUser(profile);
    };

    updateUser();

    const handleStorageChange = () => {
      updateUser();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      bottom: 10, // Position from the bottom
      right: 10,  // Position from the right
      padding: '5px 10px',
      background: user ? 'green' : 'red',
      color: 'white',
      borderRadius: '5px',
      zIndex: 1000, // Ensure it stays above other elements
    }}>
      {user ? `Logged in as ${user.username || 'Unknown User'}` : 'Not Logged In'}
    </div>
  );
};

export default LoggedInIndicator;
