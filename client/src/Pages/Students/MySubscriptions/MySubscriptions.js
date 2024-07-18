import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { List, Card, Tag, Typography, Button } from 'antd';
import './MySubscriptions.css';
import { isAuthenticated } from '../../../Components/Auth/auth';
import { useNavigate } from 'react-router-dom';
import CurrencySign from '../../../Components/CurrencySign';

const { Title, Text } = Typography;

const MySubscriptions = () => {
    const router = useNavigate();
    const [subscriptions, setSubscriptions] = useState([]);


    const fetchSubscriptions = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/subscriptions/user/${isAuthenticated()?._id}`, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            });
            setSubscriptions(response.data);
        } catch (error) {
            console.error('Error fetching subscriptions:', error);
        }
    };

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    useEffect(() => {
        const checkExpiry = async () => {
            const now = new Date();
            for (let subscription of subscriptions) {
                const expiryDate = new Date(subscription.expiryDate);
                if (expiryDate < now && subscription.status !== 'expired') {
                    try {
                        await axios.put(`${process.env.REACT_APP_BACKEND_URL}/subscriptions/update-status/${subscription._id}`, { status: "expired" }, {
                            headers: {
                                Authorization: "Bearer " + localStorage.getItem("token")
                            }
                        }).then(res => {
                            if (res.status === 200) {
                                fetchSubscriptions();
                            }
                        })
                    } catch (error) {
                        console.error('Error updating subscription status:', error);
                    }
                }
            }
        };

        checkExpiry();
    }, [subscriptions]);

    return (
        <div className="subscriptions-container">
            <Title level={2}>Subscriptions</Title>
            <div className='text-center'>
                <Button type='primary' onClick={() => router("/subscription")}>Buy Now</Button>
            </div>
            <List
                grid={{ gutter: 16, column: 1 }}
                dataSource={subscriptions}
                className="mt-5"
                renderItem={subscription => (
                    <List.Item>
                        <Card
                            style={{ margin: "0px auto" }}
                            title={subscription.plan}
                            extra={<Tag color={subscription.status === 'expired' ? 'red' : 'green'} style={{ textTransform: "capitalize" }}>{subscription.status}</Tag>}
                        >
                            <Text strong>Expiry Date: </Text>
                            <Text>{new Date(subscription.expiryDate).toLocaleDateString()}</Text>
                            <br />
                            <Text strong>Amount: </Text>
                            <Text><CurrencySign />{subscription.amount}</Text>
                        </Card>
                    </List.Item>
                )}
            />
        </div>
    );
};

export default MySubscriptions;
