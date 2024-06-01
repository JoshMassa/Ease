import React, { useState } from 'react';
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
    const navigate = useNavigate();

    const changeTheme = (value) => {
        setTheme(value ? 'dark' : 'light');
    };

    const handleLogout = () => {
        AuthService.logout();
        console.log('Logout clicked'); // Add log to verify click
    };

    const items = [
        {
            label: <Link to='/'>Home</Link>,
            key: 'homePage',
            icon: <HomeOutlined />,
        },
        {
            label: <Link to='/signup'>Sign Up</Link>,
            key: 'signUp',
            icon: <SignatureOutlined />,
        },
        {
            label: <Link to='/login'>Log In</Link>,
            key: 'logIn',
            icon: <LoginOutlined />,
        },
        {
            label: <Link to='/userdashboard'>Dashboard</Link>,
            key: 'userDashboard',
            icon: <SettingOutlined />,
        },
        {
            label: 'Logout',
            key: 'logout',
            icon: <LogoutOutlined />,
            onClick: handleLogout,
        },
    ];

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
