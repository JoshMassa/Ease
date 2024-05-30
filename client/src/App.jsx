import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';
import HomePage from './pages/HomePage';
import Header from './components/Header';
import { ApolloProvider, InMemoryCache, ApolloClient } from '@apollo/client';

import Signup from './pages/Signup';
import Login from './pages/Login';

const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql',
  cache: new InMemoryCache(),
});

const App = () => {
  console.log('App component rendered');
  return (
    <ApolloProvider client={client}>
    <SocketProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </SocketProvider>
    </ApolloProvider>
  );
};

export default App;