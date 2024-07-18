import React, { useState, useEffect } from 'react';
import './ChatBox.css';
import { isAuthenticated } from '../../../Components/Auth/auth';
import { useSocketContext } from '../../../Context/SocketContext';
import ChatWindow from './ChatWindow/ChatWindow';
import { BsFillChatLeftTextFill } from "react-icons/bs";
import { Drawer, Input, Button } from 'antd';
import { IoSend } from "react-icons/io5";

const { TextArea } = Input;

const ChatBox = ({ messagesList, roomId }) => {
    const socket = useSocketContext();
    const sender = isAuthenticated();
    const [messages, setMessages] = useState([]);
    const [open, setOpen] = useState(false);
    const [inputText, setInputText] = useState('');

    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        if (socket) {
            socket?.emit('join-room', roomId, isAuthenticated()?._id);
            socket.on('roomMessages', (messagesListFromBackend) => {
                setMessages(messagesListFromBackend);
            });
        }


        return () => {
            if (socket) {
                socket.off('roomMessages');
            }
        };
    }, [socket]);

    useEffect(() => {
        if (messagesList?.length > 0) {
            setMessages(messagesList)
        }

        return () => {

        }
    }, [messagesList]);


    const sendMessage = async (message) => {
        const senderId = sender?._id;
        // Emit sendMessage event to socket server
        await socket.emit('sendMessageInRoom', { roomId, senderId, message });
        setInputText("");
    };

    return (
        <>
            <button className='video-chat-btn btn' onClick={showDrawer}>
                <BsFillChatLeftTextFill />
            </button>
            <Drawer className='chatDrawer' footer={
                <div className="chat-input">
                    <TextArea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Type your message here"
                        autoSize={{ minRows: 2, maxRows: 2 }}
                    />
                    <Button type="primary" icon={<IoSend />} onClick={() => sendMessage(inputText)}>
                        Send
                    </Button>
                </div>
            } title="Chatting" onClose={onClose} open={open}>
                <div className={`chat-container`}>
                    <div className="chat-main mt-5 mt-md-0">
                        <ChatWindow
                            sender={sender}
                            messages={messages}
                            onSendMessage={sendMessage}
                        />
                    </div>
                </div>
            </Drawer>
        </>
    );
};

export default ChatBox;
