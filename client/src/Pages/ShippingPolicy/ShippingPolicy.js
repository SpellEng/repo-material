import React from 'react';
import "./ShippingPolicy.css";

const ShippingPolicy = () => {
    return (
        <div className='ShippingPolicy container'>
            <h1>Shipping Policy</h1>
            <p>
                At SpellEng, we specialize in providing online English learning
                services where tutors and students connect with each other through
                one-on-one video calls. As our services are entirely digital, we do not
                offer or require any physical shipping.
            </p>
            <div>
                <b>Digital Services Only</b>
                <p>
                    Service Nature: Our services are provided exclusively online via
                    one-on-one video calls, allowing students to learn spoken English
                    from the comfort of their own homes.
                </p>
            </div>
            <div>
                <b>No Physical Shipping</b>
                <p>
                    Shipping: Since our services are digital, there is no shipping
                    involved. All interactions and lessons are conducted online.
                </p>
            </div>
            <p>Contact Us for Assistance</p>
            <p>
                If you encounter any issues or require assistance, please feel free to
                reach out to our support team. We are here to help and ensure your
                learning journey is smooth and successful.
            </p>
            <b>For any inquiries or support, please contact our team at</b> <a href='mailto: team@spelleng.com'>team@spelleng.com</a>
            <p>
                Thank you for choosing SpellEng for your English learning journey.
            </p>
        </div>
    )
}

export default ShippingPolicy
