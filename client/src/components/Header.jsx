import React, { useContext } from 'react';
import {
  HomeOutlined,
  SignatureOutlined,
  LoginOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Logout from './Logout';

const { Header: AntHeader } = Layout;

function Header() {
  console.log('Header component rendered');
  const { user, isLoggedIn } = useContext(AuthContext);

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
      label: <Logout />,
      key: 'logout',
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
