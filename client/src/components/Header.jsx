import React from 'react';
import Navigation from './Navigation';
import {
    // LaptopOutlined,
    // NotificationOutlined,
    // UserOutlined,
    // SettingOutlined,
    // CoffeeOutlined,
    // AppstoreOutlined,
    // MailOutlined,
    MoonFilled,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';

const { Header: AntHeader } = Layout;

const items1 = ['1', '2', '3'].map((key) => ({
    key,
    label: `nav ${key}`,
}));

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
                defaultSelectedKeys={['1']}
                items={items1}
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
