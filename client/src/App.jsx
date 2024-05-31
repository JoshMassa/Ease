import React from 'react';
import { Outlet } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';
import { ApolloProvider, InMemoryCache, ApolloClient } from '@apollo/client';
import Header from './components/Header';
import Navigation from './components/Navigation';
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
        <Layout style={{ minHeight: '100vh'}}>
          <Header />
          <Layout>
            <Sider>
              <Navigation />
            </Sider>
            <Layout>
              <Content style={{ minHeight: '91vh' }}>
                <Outlet />
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </SocketProvider>
    </ApolloProvider>
  );
};

export default App;