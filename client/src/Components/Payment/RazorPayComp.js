import React from 'react';
import axios from 'axios';
import { ErrorAlert, SuccessAlert } from '../Messages/messages';
import { isAuthenticated } from '../Auth/auth';

const RazorPayComp = ({ studentId, plan, amount, classesPerMonth, btnText }) => {
    let updatedRazorPayAmount = plan === "3 Month Plan" ? amount * 3 * 100 : amount * 100;
    let updatedDbAmount = plan === "3 Month Plan" ? amount * 3 : amount;

    const handlePayment = async () => {
        if (isAuthenticated()) {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/subscriptions/create-order`, { amount: updatedDbAmount }, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            }).catch(err => {
                console.log(err);
            })
            const { id: order_id } = res.data;

            const options = {
                key: process.env.REACT_APP_RAZORPAY_KEY_ID,
                amount: updatedRazorPayAmount,
                currency: 'INR',
                name: 'SpellENg Subscription',
                description: 'Subscription Payment',
                order_id: order_id,
                handler: async function (response) {
                    try {
                        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/subscriptions/create-subscription`, {
                            studentId,
                            plan,
                            name: isAuthenticated()?.fullName,
                            email: isAuthenticated()?.email,
                            classesPerMonth,
                            razorpayPaymentId: response.razorpay_payment_id,
                            amount: updatedDbAmount,
                        }, {
                            headers: {
                                Authorization: "Bearer " + localStorage.getItem("token")
                            }
                        });
                        SuccessAlert('Subscription created and activated successfully');
                    } catch (error) {
                        console.error(error);
                        ErrorAlert('Failed to create subscription');
                    }
                },
                theme: {
                    color: '#F37254'
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } else {
            ErrorAlert("Please login first to buy plans")
        }
    };

    return (
        <button onClick={handlePayment}>
            {btnText}
        </button>
    );
};

export default RazorPayComp;
