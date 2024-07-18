import React, { useState } from 'react';
import { Col, Row } from 'antd';
import { GiCheckMark } from "react-icons/gi";
import "./Subscription.css";
import { isAuthenticated } from '../../Components/Auth/auth';
import { PricingCard } from '../../Components/PricingCard/PricingCard';
import axios from 'axios';
import { ErrorAlert, SuccessAlert } from '../../Components/Messages/messages';

const Subscription = () => {
  const [selectedClasses, setSelectedClasses] = useState(12);


  const handleTrialPayment = async () => {
    if (isAuthenticated() && isAuthenticated()?.trialActivated) {
      ErrorAlert("Trial can be activated once. You have already activated your free trial.")
    }
    else if (isAuthenticated() && !isAuthenticated()?.trialActivated) {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/subscriptions/create-order`, { amount: 99 }, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      }).catch(err => {
        console.log(err);
      })
      const { id: order_id } = res.data;

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: 99 * 100,
        currency: 'INR',
        name: 'SpellENg Trial Payment @99',
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
              amount: 99,
            }, {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
              }
            }).then(res => {
              if (res.status === 200) {
                SuccessAlert(res.data.successMessage);
                localStorage.setItem("user", JSON.stringify(res.data?.user));
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
    <div className="Subscription">
      <div className="inner">
        <h3>Join the thousands whose lives we've transformed. You could be next!</h3>
        <div className='header'>
          <div className="bookTrialPart">
            <div className="fee">
              <h2>Book A Trial Class @ 99</h2>
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
        </div>
        <h3>Can't Wait To Start Your English Journey? Just Begin With Subscribing A Plan</h3>
        <h5 className='mt-3'><GiCheckMark /> Choose Number of class per month you need:</h5>
        <div className="classesBtns">
          <div>
            <button className={selectedClasses === 12 && "active"} onClick={() => setSelectedClasses(12)}>12 Classes Per Month</button>
          </div>
          <div>
            <p className='popular'>MOST POPULAR</p>
            <button className={selectedClasses === 20 && "active"} onClick={() => setSelectedClasses(20)}>20 Classes Per Month</button>
          </div>
          <div>
            <button className={selectedClasses === 28 && "active"} onClick={() => setSelectedClasses(28)}>28 Classes Per Month</button>
          </div>
        </div>
        <div className="body">
          <div className="subscriptionContainer">
            <Row gutter={[28, 28]} align="bottom">
              <Col xs={24} md={8}>
                <p className='popular py-2 bg-transparent'></p>
                <PricingCard
                  id={1}
                  title='1 Month Plan'
                  totalPrice={selectedClasses === 28 ? 12000 : selectedClasses === 20 ? 10000 : 8000}
                  discountedPrice={selectedClasses === 28 ? 6000 : selectedClasses === 20 ? 5000 : 4000}
                  classesPerMonth={selectedClasses}
                  handleClassChange={(val) => setSelectedClasses(val)}
                  btnText='Choose Plan'
                  features={[
                    "1-1 Live Class",
                    `${selectedClasses} Classes Per Month`,
                    "30 Minutes Per Class",
                    "Class Recording",
                    "Expert Feedback",
                    "Flexible Timing",
                  ]}
                />
              </Col>
              <Col xs={24} md={8}>
                <p className='popular py-2'>Most Popular</p>
                <PricingCard
                  id={2}
                  title='3 Month Plan'
                  classesPerMonth={selectedClasses}
                  totalPrice={selectedClasses === 28 ? 18000 : selectedClasses === 20 ? 15000 : 12000}
                  discountedPrice={selectedClasses === 28 ? 5000 : selectedClasses === 20 ? 4000 : 3000}
                  handleClassChange={(val) => setSelectedClasses(val)}
                  btnText='Choose Plan'
                  features={[
                    "1-1 Live Class",
                    `${selectedClasses} Classes Per Month`,
                    "30 Minutes Per Class",
                    "Class Recording",
                    "Expert Feedback",
                    "Flexible Timing",
                  ]}
                />
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Subscription;
