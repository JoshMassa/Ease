import React from 'react';
import {
    HomeOutlined,
    SignatureOutlined,
    MoonFilled,
    LoginOutlined,
    SettingOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';

const { Header: AntHeader } = Layout;

const items = [
    {
        label: <Link to='/'>Home</Link>,
        key: 'homePage',
        icon: <HomeOutlined/>,

    },
    {
        label: <Link to='/signup'>Sign Up</Link>,
        key: "signUp",
        icon: <SignatureOutlined/>,

    },
    {
        label: <Link to='/login'>Log In</Link>,
        key: 'logIn',
        icon: <LoginOutlined/>,

    },
    {
        label: <Link to='/userdashboard'>Dashboard</Link>,
        key: 'userDashboard',
        icon: <SettingOutlined/>,
    }
]

function Header() {
    console.log('Header component rendered');
    return (
        <AntHeader
            style={{
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <div className="demo-logo" />
            <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={['current']}
                items={items}
                style={{
                    flex: 1,
                    minWidth: 0,
                }}
            />
            <MoonFilled
                style={{
                    color: "#ffffff",
                    fontSize: '25px',
                }}
            />
        </AntHeader>
    );
}

export default Header;
