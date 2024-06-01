import React, { useState, useEffect } from 'react';
import {
  HomeOutlined,
  SignatureOutlined,
  LoginOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Switch } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../utils/auth';

const { Header: AntHeader } = Layout;

function Header() {
  console.log('Header component rendered');
  const [theme, setTheme] = useState('light');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoggedIn(AuthService.loggedIn());
  }, []);

  const changeTheme = (value) => {
    setTheme(value ? 'dark' : 'light');
  };

  const handleLogout = () => {
    AuthService.logout();
    console.log('Logout clicked'); // Add log to verify click
    setIsLoggedIn(false);
  };

  const items = [
    {
      label: <Link to='/'>Home</Link>,
      key: 'homePage',
      icon: <HomeOutlined />,
    },
    !isLoggedIn && {
      label: <Link to='/signup'>Sign Up</Link>,
      key: 'signUp',
      icon: <SignatureOutlined />,
    },
    !isLoggedIn && {
      label: <Link to='/login'>Log In</Link>,
      key: 'logIn',
      icon: <LoginOutlined />,
    },
    isLoggedIn && {
      label: <Link to='/userdashboard'>Dashboard</Link>,
      key: 'userDashboard',
      icon: <SettingOutlined />,
    },
    isLoggedIn && {
      label: 'Logout',
      key: 'logout',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ].filter(Boolean); // Filter out any falsey values (e.g., when isLoggedIn is false)

  return (
    <AntHeader
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div className="demo-logo" />
      <Menu
        theme={theme}
        mode="horizontal"
        defaultSelectedKeys={['current']}
        items={items}
        style={{
          flex: 1,
          minWidth: 0,
        }}
      />
      <Switch onChange={changeTheme} /> Change Style
    </AntHeader>
  );
}

export default Header;
