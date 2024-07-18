// src/components/UserList.js
import React from 'react';
import { List, Avatar, Input } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './UsersList.css';
import { isAuthenticated } from '../../Auth/auth';

const { Search } = Input;

const UserList = ({ users, onSelectUser, selectedUser }) => {
    return (
        <div className="user-list">
            <div className="header">
                <h3>All Conversations</h3>
                <Search size='large' placeholder="Search" className='w-100' />
            </div>
            <List
                itemLayout="horizontal"
                dataSource={users}
                renderItem={user => {
                    let userToShow = isAuthenticated()?._id === user?.receiver?._id ? user?.sender : user?.receiver;
                    return (
                        <List.Item className={selectedUser === userToShow?._id && "active"} onClick={() => onSelectUser(userToShow?._id)}>
                            <List.Item.Meta
                                avatar={<Avatar src={userToShow?.picture?.url} icon={!userToShow?.picture?.url && <UserOutlined />} />}
                                title={userToShow?.fullName}
                                description={user?.messages[user?.messages?.length - 1]?.message}
                            />
                        </List.Item>
                    )
                }
                }
            />
        </div>
    );
};

export default UserList;