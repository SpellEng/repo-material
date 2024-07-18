import React from "react";
import "./ContactCard.css";

const ContactCard = ({ contactProps }) => {
  return (
    <div className="ContactCard">
      <div className="inner">
        <div className="icons">{contactProps.icon}</div>
        <h4>{contactProps.heading}</h4>
        {
          contactProps?.img &&
          <div className="flag">
            <img src={contactProps.img} alt="" />
            <h6>{contactProps.country}</h6>
          </div>
        }
        <p>{contactProps.para}</p>
        {
          contactProps.email &&
          <div className="email mt-3">
            <p>{contactProps.email}</p>
          </div>
        }
        {
          contactProps.number &&
          <div className="phoneNo mt-3">
            <p>{contactProps.number}</p>
          </div>
        }
      </div>
    </div>
  );
};

export default ContactCard;
