import React from "react";
import "./SubscriptionCard.css";
import tickpic from "../../assets/tick.svg";
import { Divider } from "antd";

const SubscriptionCard = () => {
  return (
    <div className="subscriptionCard">
      <div className="row ">
        <div className="leftCard col-md-6">
          <h1>1 Month Plan</h1>
          <div className="discount">
            <div className="8000">
              <p>8000</p>
            </div>
            <div className="save">
              <p>SAVE 67%</p>
            </div>
          </div>
          <h1>4000/mo</h1>
          <div className="planBtn">
            <button>Choose Plan</button>
          </div>
          <Divider />
          <div className="pointPart">
            <div className="1">
              <img src={tickpic} alt="" />
              <p>1-1 Live Class</p>
            </div>
            <div className="1">
              <img src={tickpic} alt="" />
              <p>1-1 Live Class</p>
            </div>
            <div className="2">
              <img src={tickpic} alt="" />
              <p>12 Classes Per Month</p>
            </div>
            <div className="3">
              <img src={tickpic} alt="" />
              <p>30 Minutes Per Class</p>
            </div>
            <div className="4">
              <img src={tickpic} alt="" />
              <p>Class Recording</p>
            </div>
            <div className="5">
              <img src={tickpic} alt="" />
              <p>Expert Feedback</p>
            </div>
            <div className="6">
              <img src={tickpic} alt="" />
              <p>Flexible</p>
            </div>
          </div>
        </div>
        <div className="rightCard col-md-6">
            <div className="popular">
                <h4>MOST POPULAR</h4>

            </div>
          <h1>3 Month Plan</h1>
          <div className="discount">
            <div className="8000">
              <p>12000</p>
            </div>
            <div className="save">
              <p>SAVE 61%</p>
            </div>
          </div>
          <h1>4000/mo</h1>
          <div className="planBtn">
            <button>Choose Plan</button>
          </div>
          <Divider />
          <div className="pointPart">
            <div className="1">
              <img src={tickpic} alt="" />
              <p>1-1 Live Class</p>
            </div>
            <div className="1">
              <img src={tickpic} alt="" />
              <p>1-1 Live Class</p>
            </div>
            <div className="2">
              <img src={tickpic} alt="" />
              <p>12 Classes Per Month</p>
            </div>
            <div className="3">
              <img src={tickpic} alt="" />
              <p>30 Minutes Per Class</p>
            </div>
            <div className="4">
              <img src={tickpic} alt="" />
              <p>Class Recording</p>
            </div>
            <div className="5">
              <img src={tickpic} alt="" />
              <p>Expert Feedback</p>
            </div>
            <div className="6">
              <img src={tickpic} alt="" />
              <p>Flexible</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCard;
