import { Rate } from "antd";
import React from "react";
import "./Testimonial.css";

const Testimonial = ({ testimonialProps }) => {
  return (
    <div className="testimonial">
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

export default Testimonial;
