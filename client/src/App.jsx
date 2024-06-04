import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';
import { ApolloProvider, InMemoryCache, ApolloClient } from '@apollo/client';
import Header from './components/Header';
import Navigation from './components/Navigation';
import { Layout, Switch, ConfigProvider, theme } from 'antd';
import LoggedInIndicator from './components/LoggedInIndicator'; // Add this import


const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql',
  cache: new InMemoryCache(),
});

const { Sider, Content } = Layout;

const App = () => {
  const [currentTheme, setCurrentTheme] = useState('light');
  const changeTheme = (value) => {
    setCurrentTheme(value ? 'dark' : 'light');
  };
  const LightTheme = 
  {
    colorBgContainer: '#ffffff', 
    colorTextBase: '#4b4b4b',
    "headerBg": "rgb(255, 255, 255)",
    "bodyBg": '#f5f5f5'
  }
  const DarkTheme =
  {
    colorBgContainer: '#15325b', 
    colorTextBase: '#ffffff',
    "bodyBg": "#111a2c",
    "headerBg": "#15325b"
  }

  console.log('App component rendered');
  return (
    <ApolloProvider client={client}>
      <SocketProvider>
        <ConfigProvider
        theme={{
      token: 
        currentTheme === 'light'? LightTheme : DarkTheme,
      components:{
        "Layout":
          currentTheme ==='light'? LightTheme : DarkTheme,        
      }
    }}>
        <Layout 

        style={{ minHeight: '100vh'}}>
          <Header/>
          <Layout>
            <Sider>
              <Navigation/>
            </Sider>
            <Layout>
              <Content

              style={{ minHeight: '91vh' }}>
                <Switch 
                checked = {currentTheme === 'dark'}
                checkedChildren = "Dark"
                unCheckedChildren = "Light"
                onChange= {changeTheme}
                />
                <Outlet />
                <LoggedInIndicator />
              </Content>
            </Layout>
          </Layout>
        </Layout>
        </ConfigProvider>
      </SocketProvider>
    </ApolloProvider>
  );
};

export default App;