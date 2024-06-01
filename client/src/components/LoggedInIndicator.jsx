import React, { useState, useEffect } from 'react';
import AuthService from '../utils/auth';

const LoggedInIndicator = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const updateUser = async () => {
      const profile = await AuthService.getProfile();
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
    <div style={{ position: 'fixed', top: 10, right: 10, padding: '5px 10px', background: user ? 'green' : 'red', color: 'white', borderRadius: '5px' }}>
      {user ? `Logged in as ${user.username || 'Unknown User'}` : 'Not Logged In'}
    </div>
  );
};

export default LoggedInIndicator;
