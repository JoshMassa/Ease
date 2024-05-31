import React, { useState } from 'react';
import {
    HomeOutlined,
    SignatureOutlined,
    MoonFilled,
    LoginOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Switch } from 'antd';

const { Header: AntHeader } = Layout;

const items = [
    {
        label: "Home",
        key: 'homePage',
        icon: <HomeOutlined/>,

    },
    {
        label: "Sign Up",
        key: "signUp",
        icon: <SignatureOutlined/>,

    },
    {
        label: "Log In",
        key: 'logIn',
        icon: <LoginOutlined/>,

    },
]

function Header() {
    console.log('Header component rendered');
    const [theme, setTheme] = useState('light');
    const changeTheme = (value) => {
        setTheme(value ? 'dark' : 'light');
      };

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
