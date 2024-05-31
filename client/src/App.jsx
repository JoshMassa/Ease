import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';
import HomePage from './pages/HomePage';
import Header from './components/Header';
import Navigation from './components/Navigation';
import { ApolloProvider, InMemoryCache, ApolloClient } from '@apollo/client';
import Signup from './pages/Signup';
import Login from './pages/Login';
import UserDashboard from './pages/UserDashboard';
import { Layout } from 'antd';

const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql',
  cache: new InMemoryCache(),
});

const { Sider, Content } = Layout;

const App = () => {
  console.log('App component rendered');
  return (
    <ApolloProvider client={client}>
      <SocketProvider>
        <Router>
          <Layout style={{ minHeight: '100vh'}}>
            <Header />
            <Layout>
              <Sider>
                <Navigation />
              </Sider>
              <Layout>
                <Content style={{ minHeight: '91vh' }}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/userdashboard" element={<UserDashboard />} />
                  </Routes>
                </Content>
              </Layout>
            </Layout>
          </Layout>
        </Router>
      </SocketProvider>
    </ApolloProvider>
  );
};

export default App;