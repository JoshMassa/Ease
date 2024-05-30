import React from 'react';
import Messages from '../components/Messages';
import { LaptopOutlined, NotificationOutlined, UserOutlined, SettingOutlined, CoffeeOutlined, AppstoreOutlined, MailOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
const { Header, Content, Sider } = Layout;
import { MoonFilled } from '@ant-design/icons';

const items1 = ['1', '2', '3'].map((key) => ({
  key,
  label: `nav ${key}`,
}));

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


function HomePage () {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout>
      <Header
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
            style= {{
                color: "#ffffff",
                fontSize: '25px'
        }}
        />

      </Header>
      <Layout>
        <Sider
          width={200}
          style={{
            background: colorBgContainer,
          }}
        >
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
        </Sider>
        <Layout
          style={{
            padding: '0 24px 24px',
          }}
        >


          <Breadcrumb
            style={{
              margin: '16px 0',
            }}
          >
            <Breadcrumb.Item>Dash</Breadcrumb.Item>
            <Breadcrumb.Item>Chats</Breadcrumb.Item>
            <Breadcrumb.Item>Chatroom</Breadcrumb.Item>
          </Breadcrumb>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Messages />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default HomePage;