import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { List, Typography, Button } from 'antd';
import './MySubscriptions.css';
import { isAuthenticated } from '../../../Components/Auth/auth';
import { useNavigate } from 'react-router-dom';
import moment from "moment"
import { ErrorAlert } from '../../../Components/Messages/messages';
import { checkSubscriptionStatus } from '../../../Utils/checkSubscriptionStatus';

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
                setFutureClasses(res.data?.filter(f => !f?.trialClass));
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
                setPreviousClasses(res.data?.filter(f => !f?.trialClass));
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

    return (
        <div className="subscriptions-container">
            <div className="container">
                <div className='text-center mt-4'>
                    <h4>Buy Subscription</h4>
                    <Button className='btn h-auto py-2 px-5 mt-3' type='primary' onClick={() => router("/subscription")}>Buy Now</Button>
                </div>
                <List
                    grid={{ gutter: 16, column: 1 }}
                    dataSource={subscriptions}
                    className="mt-2"
                    renderItem={subscription => (
                        <List.Item>
                            <div className='subscriptionsItem'>
                                <h3>Active Plan</h3>
                                <div className='inner'>
                                    <h2>{subscription?.plan}</h2>
                                    <p className='mb-4'><b>{subscription?.classesPerMonth} sessions</b> per month</p>
                                    {
                                        checkSubscriptionStatus(subscription?.expiryDate) ?
                                            <div className='subsctiptionStatus expired'>
                                                <p>Your subscription has been expired on <b>{moment(subscription.expiryDate, "DD/MM/YYYY").format("MMMM DD, YYYY")}</b></p>
                                            </div>
                                            :
                                            <div className='subsctiptionStatus'>
                                                <p>Your subscription will expire on <b>{moment(subscription.expiryDate, "DD/MM/YYYY").format("MMMM DD, YYYY")}</b></p>
                                            </div>
                                    }
                                    <div className='items'>
                                        <div className='item'>
                                            <h5>{previousClasses?.length + futureClasses?.length}/{subscription?.totalClasses}</h5>
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
                                            <h5>{moment(subscription.expiryDate, "DD/MM/YYYY").format("MMMM DD, YYYY")}</h5>
                                            <p>{checkSubscriptionStatus(subscription?.expiryDate) ? "Expired" : "Expires"} on</p>
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
