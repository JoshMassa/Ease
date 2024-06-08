import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';
import { ApolloProvider, InMemoryCache, ApolloClient } from '@apollo/client';
import Header from './components/Header';
import Navigation from './components/Navigation';
import { Layout, Switch, ConfigProvider, theme } from 'antd';
import LoggedInIndicator from './components/LoggedInIndicator';
import { CurrentUserProvider } from './context/CurrentUserContext';


const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql',
  cache: new InMemoryCache({
    typePolicies: {
      User: {
        fields: {
          friends : {
            merge(existing = [], incoming = []) {
              return incoming;
            }
          }
        }
      }
    }
  }),
});

const { Sider, Content } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('light');
  const changeTheme = (value) => {
    setCurrentTheme(value ? 'dark' : 'light');
  };
  const LightTheme = 
  {
    colorBgContainer: '#ffffff', 
    colorTextBase: '#4b4b4b',
    "headerBg": "#ffffff",
    "bodyBg": '#f5f5f5',
    "itemSelectedColor": "#3c89e8",
    "itemSelectedBg": "#E6F4FF",
    "horizontalItemSelectedColor": '#3c89e8',
    "itemHoverColor": "#3c89e8",
    "triggerBg": "#ffffff",
    "triggerColor": "#4b4b4b"
  }
  const DarkTheme =
  {
    colorBgContainer: '#15325b', 
    colorTextBase: '#ffffff',
    "bodyBg": "#111a2c",
    "headerBg": "#15325b",
    "itemSelectedColor": "#ffffff",
    "itemSelectedBg": "rgba(0, 0, 0, 0.06)",
    "itemHoverBg": "rgba(0, 0, 0, 0.06)",
    "horizontalItemSelectedColor": '#65a9f3',
    "colorPrimary": "#1668dc",
    "triggerBg": "#15325b",
  }

  console.log('App component rendered');
  return (
    <ApolloProvider client={client}>
      <SocketProvider>
        <CurrentUserProvider>
        <ConfigProvider
        theme={{
      token: 
        currentTheme === 'light'? LightTheme : DarkTheme,
      components:{
        "Layout":
          currentTheme ==='light'? LightTheme : DarkTheme,  
         "Menu": 
          currentTheme ==='light'? LightTheme : DarkTheme,
          "Switch":
          currentTheme ==='light'? LightTheme : DarkTheme,
      }
    }}>
        <Layout 

        style={{ minHeight: '100vh'}}>
          <Header/>
          <Layout>
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
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
                style={{
                  margin: '10px'
                }}
                />
                <Outlet />
                <LoggedInIndicator />
              </Content>
            </Layout>
          </Layout>
        </Layout>
        </ConfigProvider>
        </CurrentUserProvider>
      </SocketProvider>
    </ApolloProvider>
  );
};

export default App;