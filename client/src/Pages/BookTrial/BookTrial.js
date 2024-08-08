import React from 'react';
import "./BookTrial.css";
import { isAuthenticated } from '../../Components/Auth/auth';
import axios from 'axios';
import { ErrorAlert, SuccessAlert } from '../../Components/Messages/messages';
import { useNavigate } from 'react-router-dom';

const BookTrial = () => {
    const router = useNavigate();

    const handleTrialPayment = async () => {
        if (isAuthenticated() && isAuthenticated()?.trialActivated) {
            ErrorAlert("Trial can be activated once. You have already activated your free trial.")
        }
        else if (isAuthenticated() && !isAuthenticated()?.trialActivated) {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/subscriptions/create-order`, { amount: 1 }, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            }).catch(err => {
                console.log(err);
            })
            const { id: order_id } = res.data;

            const options = {
                key: process.env.REACT_APP_RAZORPAY_KEY_ID,
                amount: 1 * 100,
                currency: 'INR',
                name: 'SpellEng Trial Payment',
                description: 'Trial Payment',
                order_id: order_id,
                handler: async function (response) {
                    try {
                        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/book-trial`, {
                            user: isAuthenticated()?._id,
                            plan: "Trial",
                            name: isAuthenticated()?.fullName,
                            email: isAuthenticated()?.email,
                            razorpayPaymentId: response.razorpay_payment_id,
                            amount: 1,
                        }, {
                            headers: {
                                Authorization: "Bearer " + localStorage.getItem("token")
                            }
                        }).then(res => {
                            if (res.status === 200) {
                                SuccessAlert(res.data.successMessage);
                                localStorage.setItem("user", JSON.stringify(res.data?.user));
                                router("/all-tutors")
                            } else {
                                ErrorAlert(res.data.errorMessage);
                            }
                        })
                    } catch (error) {
                        console.error(error);
                        ErrorAlert('Failed to activate Trial');
                    }
                },
                theme: {
                    color: '#F37254'
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } else {
            ErrorAlert("Please login first to activate your trial")
        }
    };

    return (
        <div className="BookTrial container">
            <div className="inner">
                <div className="fee">
                    <h2>Book A Trial Class @ ₹1</h2>
                    <p>
                        You get a 30-minute trial class with an expert tutor,
                        <span> feedback, and recording</span>
                    </p>
                </div>
                <div className="bookBtn">
                    <button onClick={handleTrialPayment}>Book Now</button>
                    <p>Trial Class can be done only once in an account</p>
                </div>
            </div>
        </div >
    );
}

export default BookTrial;
