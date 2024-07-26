import { Avatar } from "antd";
import React from "react";
import { FaStar } from "react-icons/fa";
import { GiCalendar } from "react-icons/gi";
import { LuSend } from "react-icons/lu";
import { Link } from "react-router-dom";
import "./TutorCard.css";

const TutorCard = ({ tutorProps }) => {
  const averageRating = tutorProps?.reviews?.reduce((acc, review) => acc + review?.rating, 0) / tutorProps?.reviews?.length;

  return (
    <div className="tutorCard">
      <div className="mainPic">
        <img src={tutorProps?.picture?.url} alt="" />
      </div>
      <div className="nameSection">
        <div className="name">
          <Avatar icon={<img src={tutorProps?.picture?.url} alt="" />} />
          <div>
            <h4>
              {tutorProps?.fullName}
            </h4>
            <div className="mobileRating">
              <FaStar />
              <span>{averageRating || 0}</span>
              <b>{tutorProps?.rating}({tutorProps?.reviews?.length})</b>
            </div>
          </div>
        </div>
        <div className="rating">
          <div className="star d-flex gap-1 align-items-center">
            <FaStar /> <span>{averageRating || 0}</span>
          </div>
          <div>
            <b>{tutorProps?.rating}({tutorProps?.reviews?.length})</b>
          </div>
        </div>
      </div>
      <div className="buttons">
        <Link to={`/tutor/${tutorProps?._id}`} className="btn">
          <GiCalendar />
          <div>Book a Class</div>
        </Link>
        <Link to={`/tutor/${tutorProps?._id}`} className="btn">
          <LuSend />
          <div>View Profile</div>
        </Link>
      </div>
    </div>
  );
};

export default TutorCard;
