import React, { useState, useEffect, useContext } from 'react';
import {
  HomeOutlined,
  SignatureOutlined,
  LoginOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../utils/auth';
import AuthContext from '../context/AuthContext';

const { Header: AntHeader } = Layout;

function Header() {
  console.log('Header component rendered');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoggedIn(AuthService.loggedIn());
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    console.log('Logout clicked'); // Add log to verify click
    setIsLoggedIn(false);
    navigate('/login');
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
      label: <Link to={`/user/${user ? user.username : ':username'}`}>Dashboard</Link>,
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
        mode="horizontal"
        defaultSelectedKeys={['current']}
        items={items}
        style={{
          flex: 1,
          minWidth: 0,
        }}
      />
    </AntHeader>
  );
}

export default Header;
