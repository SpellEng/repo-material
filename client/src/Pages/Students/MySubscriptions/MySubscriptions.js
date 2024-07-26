import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { List, Typography, Button } from 'antd';
import './MySubscriptions.css';
import { isAuthenticated } from '../../../Components/Auth/auth';
import { useNavigate } from 'react-router-dom';
import moment from "moment"
import { ErrorAlert } from '../../../Components/Messages/messages';

const MySubscriptions = () => {
    const router = useNavigate();
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [cancelledClasses, setCancelledClasses] = useState([]);
    const [currentMonthCancelledClasses, setCurrentMonthCancelledClasses] = useState([]);
    const [futureClasses, setFutureClasses] = useState([]);
    const [previousClasses, setPreviousClasses] = useState([]);

    const getCancelledClasses = async () => {
        await axios.get(`${process.env.REACT_APP_BACKEND_URL}/scheduled-classes/student/cancelled/${isAuthenticated()?._id}`, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        }).then(res => {
            setLoading(false);
            if (res.status === 200) {
                setCancelledClasses(res.data);
                const currentMonthStart = moment().startOf('month').toDate();
                const nextMonthStart = moment().startOf('month').add(1, 'month').toDate();
                const studentCurrentMonthClasses = res.data?.filter(scheduledClass => {
                    const classDate = moment(scheduledClass.date, "DD/MM/YYYY").toDate();
                    return classDate >= currentMonthStart && classDate < nextMonthStart;
                });
                setCurrentMonthCancelledClasses(studentCurrentMonthClasses);
            } else {
                ErrorAlert(res.data.errorMessage);
            }
        }).catch(err => {
            setLoading(false);
            console.log(err)
            ErrorAlert(err?.message);
        })
    }

    const getFutureClasses = async () => {
        await axios.get(`${process.env.REACT_APP_BACKEND_URL}/scheduled-classes/student/future/${isAuthenticated()?._id}`, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        }).then(res => {
            setLoading(false);
            if (res.status === 200) {
                setFutureClasses(res.data);
            } else {
                ErrorAlert(res.data.errorMessage);
            }
        }).catch(err => {
            setLoading(false);
            console.log(err)
            ErrorAlert(err?.message);
        })
    }

    const getPreviousClasses = async () => {
        await axios.get(`${process.env.REACT_APP_BACKEND_URL}/scheduled-classes/student/past/${isAuthenticated()?._id}`, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        }).then(res => {
            setLoading(false);
            if (res.status === 200) {
                setPreviousClasses(res.data);
            } else {
                ErrorAlert(res.data.errorMessage);
            }
        }).catch(err => {
            setLoading(false);
            console.log(err)
            ErrorAlert(err?.message);
        })
    }


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
        getFutureClasses();
        getPreviousClasses();
        getCancelledClasses();
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
            <div className="container">
                <List
                    grid={{ gutter: 16, column: 1 }}
                    dataSource={subscriptions}
                    className="mt-5"
                    renderItem={subscription => (
                        <List.Item>
                            <div className='subscriptionsItem'>
                                <h3>Active Plan</h3>
                                <div className='inner'>
                                    <h2>{subscription?.plan}</h2>
                                    <p className='mb-4'><b>{subscription?.classesPerMonth} sessions</b> per month</p>
                                    {
                                        subscription?.status === "expired" ?
                                            <div className='subsctiptionStatus expired'>
                                                <p>Your subscription has been expired on <b>{moment(subscription.expiryDate).format("MMMM DD, YYYY")}</b></p>
                                            </div>
                                            :
                                            <div className='subsctiptionStatus'>
                                                <p>Your subscription will expire on <b>{moment(subscription.expiryDate).format("MMMM DD, YYYY")}</b></p>
                                            </div>
                                    }
                                    <div className='items'>
                                        <div className='item'>
                                            <h5>{previousClasses?.length + futureClasses?.length}/{subscription?.classesPerMonth}</h5>
                                            <p>Total sessions left</p>
                                        </div>
                                        <div className='item'>
                                            <h5>{cancelledClasses?.length}</h5>
                                            <p>Sessions Cancelled</p>
                                        </div>
                                        <div className='item'>
                                            <h5>{currentMonthCancelledClasses?.length}</h5>
                                            <p>Monthly Cancelled Sessions</p>
                                        </div>
                                        <div className='item'>
                                            <h5>{moment(subscription.expiryDate).format("MMMM DD, YYYY")}</h5>
                                            <p>Expires on</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </List.Item>
                    )}
                />
            </div>
        </div>
    );
};

export default MySubscriptions;
