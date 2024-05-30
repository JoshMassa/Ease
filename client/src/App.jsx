import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';
import HomePage from './pages/HomePage';
import Messages from './components/Messages';
// import Header from './components/Header';

const App = () => {
  console.log('App component rendered');
  return (
    <SocketProvider>
      <Router>
        {/* <Header /> */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/messages" element={<Messages />} />
        </Routes>
      </Router>
    </SocketProvider>
  );
};

export default App;
