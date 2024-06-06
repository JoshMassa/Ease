import React, { useEffect, useState } from 'react';
import {
    UserOutlined,
    SettingOutlined,
    CoffeeOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';
import { useQuery } from '@apollo/client';
import { USERS_BY_STATUS } from '../utils/queries';

function Navigation() {
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [offlineUsers, setOfflineUsers] = useState([]);

    const { data: onlineData } = useQuery(USERS_BY_STATUS, { variables: { status: 'Online' } });
    const { data: offlineData } = useQuery(USERS_BY_STATUS, { variables: { status: 'Offline' } });

    useEffect(() => {
        if (onlineData) {
            setOnlineUsers(onlineData.usersByStatus);
        }
    }, [onlineData]);

    useEffect(() => {
        if (offlineData) {
            setOfflineUsers(offlineData.usersByStatus);
        }
    }, [offlineData]);

    const generateUserItems = (users) => {
        return users.map((user, index) => ({
            key: `user-${index}`,
            label: user.username
        }));
    };

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
                children: generateUserItems(onlineUsers),
            },
            {
                key: 'g2',
                label: 'Offline',
                type: 'group',
                children: generateUserItems(offlineUsers),
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
                label: 'My Profile',
            },
            {
                key: '6',
                label: 'Extra Settings',
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
        label: 'More',
        type: 'group',
        children: [
            {
                key: 'extra1',
                label: 'Community Guidelines',
            },
        ],
    },
];

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