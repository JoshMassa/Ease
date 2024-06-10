import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';

const LoggedInIndicator = () => {
  const { user, isLoggedIn } = useContext(AuthContext);
  const [displayUser, setDisplayUser] = useState(null);

  useEffect(() => {
    setDisplayUser(user);
  }, [user, isLoggedIn]);

  return (
    <div style={{
      position: 'fixed',
      bottom: 10, // Position from the bottom
      right: 10,  // Position from the right
      padding: '5px 10px',
      background: isLoggedIn ? 'green' : 'red',
      color: 'white',
      borderRadius: '5px',
      zIndex: 1000, // Ensure it stays above other elements
    }}>
      {isLoggedIn ? `Logged in as ${displayUser?.username || 'Unknown User'}` : 'Not Logged In'}
    </div>
  );
};

export default LoggedInIndicator;