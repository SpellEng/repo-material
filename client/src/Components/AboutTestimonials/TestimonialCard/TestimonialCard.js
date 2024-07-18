import { Rate } from "antd";
import React from "react";
import { FaQuoteLeft } from "react-icons/fa6";
import "./TestimonialCard.css";

const TestimonialCard = ({ testimonialProps }) => {
  return (
    <div className="TestimonialCard">
      <button className="btn quoteTestimonial">
        <FaQuoteLeft />
      </button>
      <p className="desc">{testimonialProps?.description}</p>
      <Rate disabled allowHalf value={testimonialProps?.rating} />
      <div className="userTestimonial">
        <div className="userImg">
          <img src={testimonialProps.photo} alt="" />
        </div>
        <div className="postName">
          <h4>{testimonialProps.name}</h4>
          <small>{testimonialProps.post}</small>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
