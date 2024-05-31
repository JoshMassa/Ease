import React from 'react';
import {
    HomeOutlined,
    SignatureOutlined,
    MoonFilled,
    LoginOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';

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
