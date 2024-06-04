import React from 'react';
import {
    UserOutlined,
    SettingOutlined,
    CoffeeOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';

const items2 = [
    {
        key: 'sub1',
        label: 'Users',
        icon: <UserOutlined />,
        children: [
            {
                key: 'g1',
                label: 'Online',
                type: 'group',
                children: [
                    {
                        key: '1',
                        label: 'User 1',
                    },
                    {
                        key: '2',
                        label: 'User 2',
                    },
                ],
            },
            {
                key: 'g2',
                label: 'Away',
                type: 'group',
                children: [
                    {
                        key: '3',
                        label: 'User 3',
                    },
                    {
                        key: '4',
                        label: 'User 4',
                    },
                ],
            },
        ],
    },
    {
        key: 'sub2',
        label: 'Settings',
        icon: <SettingOutlined />,
        children: [
            {
                key: '5',
                label: 'Option 5',
            },
            {
                key: '6',
                label: 'Option 6',
            },
        ],
    },
    {
        type: 'divider',
    },
    {
        key: 'donate',
        label: 'Donate?',
        icon: <CoffeeOutlined />,
        children: [
            {
                key: 'donate1',
                label: 'Donate Here!',
            },
        ],
    },
    {
        key: 'grp',
        label: 'Extra',
        type: 'group',
        children: [
            {
                key: 'extra1',
                label: 'Click Me',
            },
        ],
    },
];

function Navigation() {
    return (
            <>
                <Menu
                    mode="inline"
                    defaultSelectedKeys={['current']}
                    defaultOpenKeys={['current']}
                    style={{
                        height: '100%',
                        borderRight: 0,
                    }}
                    items={items2}
                />
            </>
    );
}

export default Navigation;
