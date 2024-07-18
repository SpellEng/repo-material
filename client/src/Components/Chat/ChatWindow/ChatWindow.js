import React, { useState, useEffect, useRef } from 'react';
import { Input, Button, Avatar, List } from 'antd';
import { SendOutlined, UserOutlined } from '@ant-design/icons';
import './ChatWindow.css';
import FileUpload from '../FileUpload/FileUpload';
import { renderFile } from '../renderFile';

const { TextArea } = Input;

const ChatWindow = ({ receiver, messages, sender, onSendMessage }) => {
    const [input, setInput] = useState('');
    const [uploadedFile, setUploadedFile] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const sendMessage = () => {
        if (input === '') return;
        onSendMessage(input, uploadedFile);
        setInput("");
        setUploadedFile(null);
    };

    return (
        <div className="chat-window">
            <div className="chat-header">
                <div className="d-flex gap-2 align-items-center">
                    <Avatar src={receiver?.picture?.url} icon={!receiver?.picture?.url && <UserOutlined />} />
                    <span>{receiver?.fullName}</span>
                </div>
            </div>
            <div className="messages">
                {messages?.length > 0 &&
                    <List
                        itemLayout="horizontal"
                        dataSource={messages}
                        renderItem={message => (
                            <List.Item ref={messagesEndRef} className={`message ${message?.sender === sender?._id ? 'my-message' : ''}`}>
                                <List.Item.Meta
                                    avatar={<Avatar icon={<UserOutlined />} />}
                                    title={message?.sender === sender?._id ? 'Me' : receiver?.fullName}
                                    description={
                                        <div>
                                            {renderFile(message?.file)}
                                            <p>{message?.message}</p>
                                        </div>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                }
            </div>
            <div className="chat-input">
                <TextArea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message here"
                    autoSize={{ minRows: 2, maxRows: 6 }}
                />
                <Button type="primary" icon={<SendOutlined />} onClick={sendMessage}>
                    Send
                </Button>
            </div>
            <FileUpload value={uploadedFile} updateFileFun={(val) => setUploadedFile(val)} />
        </div>
    );
};

export default ChatWindow;
