import { Button } from 'antd';
import React, { useState, useEffect } from 'react';
import ChatWindow from '../../Components/Chat/ChatWindow/ChatWindow';
import UserList from '../../Components/Chat/Users/UsersList';
import './Chat.css';
import { useSocketContext } from '../../Context/SocketContext';
import { useLocation } from 'react-router-dom';
import { isAuthenticated } from '../../Components/Auth/auth';
import { ErrorAlert } from '../../Components/Messages/messages';
import axios from 'axios';
import { AiOutlineMenuUnfold } from "react-icons/ai";
import { RiCloseLargeLine } from "react-icons/ri";

const Chat = () => {
    const socket = useSocketContext();
    const location = useLocation();
    const receiverId = location.search.split("receiver=")[1];
    const sender = isAuthenticated();
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showUserList, setShowUserList] = useState(false);
    const [receiver, setReceiver] = useState(null);
    const [messages, setMessages] = useState([]);

    const getUserById = async (id) => {
        await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/user/${id}`).then(res => {
            if (res.status === 200) {
                setReceiver(res.data);
            } else {
                ErrorAlert(res.data.errorMessage);
            }
        }).catch(err => {
            console.log(err)
            ErrorAlert(err?.message);
        })
    }

    useEffect(() => {
        if (socket) {
            socket.emit("join", ({ userId: sender?._id }));
            // Emit getUsers event to server to fetch users list
            socket.emit('users', sender?._id);

            if (receiverId) {
                socket.emit('messages', { receiver: receiverId, sender: sender?._id });
            }

            // Handle usersList event from server
            socket.on('users', (users) => {
                setUsers(users);
            });

            socket.on('only sent to receiver', (user) => {
                console.log("only sent to receiver", user)
            });

            socket.on('messages', (messagesListFromBackend) => {
                console.log("all messages got", messagesListFromBackend);
                setMessages(messagesListFromBackend);
                if (messagesListFromBackend?.length === 1) {
                    socket.emit('users', sender?._id);
                }
            });
        }


        return () => {
            if (socket) {
                socket.off('usersList');
            }
        };
    }, [socket, selectedUser]);

    useEffect(() => {
        if (receiverId) {
            setSelectedUser(receiverId);
            getUserById(receiverId);
        }


        return () => {

        }
    }, [receiverId]);


    const handleSelectUser = (user) => {
        setSelectedUser(user);
        setShowUserList(false);
        getUserById(user);
        // Emit join event to socket server
        socket.emit('join', { userId: sender?._id });

        socket.emit('messages', { receiver: user, sender: sender?._id });
    };

    const sendMessage = async (message, file) => {
        const senderId = sender?._id; 

        // Emit sendMessage event to socket server
        await socket.emit('sendMessage', { senderId, receiverId: selectedUser, message, file });

        // Update local state for immediate display
        if (messages?.length > 0) {
            setMessages(prevMessages => [...prevMessages, { sender: senderId, receiver: selectedUser, message, file }]);
        } else {
            socket.emit('users', sender?._id);
            setMessages([{ sender: senderId, receiver: selectedUser, message, file }]);
        }
    };

    return (
        <div className={`chat-container ${showUserList ? 'show-user-list' : ''}`}>
            <div className='d-flex'>
                <UserList users={users} selectedUser={selectedUser} onSelectUser={handleSelectUser} />
                <Button
                    type="primary"
                    className={`mobileUsersBtn ${showUserList && "open"}`}
                    onClick={() => setShowUserList(!showUserList)}
                >
                    {showUserList ? <RiCloseLargeLine /> : <AiOutlineMenuUnfold />}
                </Button>
            </div>
            <div className="chat-main mt-5 mt-md-0">
                {receiver ? (
                    <ChatWindow
                        sender={sender} 
                        receiver={receiver}
                        messages={messages}
                        onSendMessage={sendMessage}
                    />
                ) : (
                    <div className="select-chat">Please select a chat</div>
                )}
                <div className='d-block d-md-none'>
                </div>
            </div>
        </div>
    );
};

export default Chat;
