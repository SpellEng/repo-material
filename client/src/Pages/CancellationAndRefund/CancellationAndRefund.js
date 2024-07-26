import React from 'react';
import "./CancellationAndRefund.css";

const CancellationAndRefund = () => {
    return (
        <div className='CancellationAndRefund container'>
            <h1>Cancellation and Refund Policy</h1>
            <p>
                At SpellEng, we strive to provide the best learning experience for our
                students. Below are the details of our cancellation and refund policy:
            </p>
            <ul>
                <li>No Refund or Cancellation for Trial Classes and Subscription Plans</li>
                <li>
                    <b>Trial Classes:</b> We do not offer any refunds or cancellations for trial
                    classes.
                </li>
                <li>
                    <b>Subscription Plans:</b> All subscription plans, once purchased, are non-
                    refundable and non-cancellable.
                </li>
            </ul>
            <div>
                <p>Contact Us for Assistance</p>
                <p>
                    If you encounter any issues or require assistance, please feel free to
                    reach out to our support team. We are here to help and ensure your
                    learning journey is smooth and successful.
                </p>
                <b>Contact Email:</b> <a href='mailto: team@spelleng.com'>team@spelleng.com</a>
                <p>
                    Thank you for understanding and for being a part of SpellEng.
                </p>
            </div>
        </div>
    )
}

export default CancellationAndRefund
