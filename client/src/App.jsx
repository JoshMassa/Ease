import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';
import HomePage from './pages/HomePage';
import Messages from './components/Messages';
import Header from './components/Header';

import Signup from './pages/Signup';
import Login from './pages/Login';

const App = () => {
  console.log('App component rendered');
  return (
    <SocketProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </SocketProvider>
  );
};

export default App;
