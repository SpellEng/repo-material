import React, { useEffect, useRef } from 'react';
import { Avatar, List } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './ChatWindow.css';

const ChatWindow = ({ messages }) => {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="video-chat-window">
            <div className="messages">
                {messages?.length > 0 &&
                    <List
                        itemLayout="horizontal"
                        dataSource={messages}
                        renderItem={message => (
                            <List.Item ref={messagesEndRef} className={`message`}>
                                <List.Item.Meta
                                    avatar={<Avatar icon={<UserOutlined />} />}
                                    title={message?.sender?.fullName}
                                    description={
                                        <div>
                                            <p>{message?.message}</p>
                                        </div>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                }
            </div>

        </div>
    );
};

export default ChatWindow;
