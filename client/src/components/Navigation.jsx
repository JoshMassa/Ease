import React from 'react';
import {
    // AppstoreOutlined,
    // LaptopOutlined,
    // NotificationOutlined,
    // MailOutlined,
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
            // {
            //   key: 'sub3',
            //   label: 'Submenu',
            //   children: [
            //     {
            //       key: '7',
            //       label: 'Option 7',
            //     },
            //     {
            //       key: '8',
            //       label: 'Option 8',
            //     },
            //   ],
            // },
        ],
    },
    {
        type: 'divider',
    },
    {
        key: 'sub4',
        label: 'Donate',
        icon: <CoffeeOutlined />,
        children: [
            {
                key: '9',
                label: 'Donate Here',
            },
        ],
    },
    {
        key: 'grp',
        label: 'Group',
        type: 'group',
        children: [
            {
                key: '13',
                label: 'Option 13',
            },
            {
                key: '14',
                label: 'Option 14',
            },
        ],
    },
];

function Navigation() {
    return (
            <>
                <Menu
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
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
