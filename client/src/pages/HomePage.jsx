import React from 'react';
import Messages from '../components/Messages';
import { Breadcrumb, Layout, theme } from 'antd';

const { Content } = Layout;

function HomePage() {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <>
            <Breadcrumb
                style={{
                    margin: '16px 24px',
                }}
            >
                <Breadcrumb.Item>Dash</Breadcrumb.Item>
                <Breadcrumb.Item>Chats</Breadcrumb.Item>
                <Breadcrumb.Item>Chatroom</Breadcrumb.Item>
            </Breadcrumb>
                    <Content
                        style={{
                            padding: 24,
                            margin: '0px 24px 24px 24px',
                            minHeight: 280,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <Messages />
                    </Content>
        </>
    );
}

export default HomePage;
