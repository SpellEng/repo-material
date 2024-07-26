import React from "react";
import "./Header.css";
import { Col, Row } from "antd";
import { FaHeadphones, FaVideo } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BsFillCameraReelsFill } from "react-icons/bs";

const Header = () => {
  return (
    <div className="mainHeader container">
      <div className="subHeader">
        <Row gutter={[40, 40]}>
          <Col xs={24} md={12} className="leftSide">
            <h1>Speak English With <br /> Confience In Weeks</h1>
            <p className="my-4">
              Improve Your English Fluency with Expert Tutors: Personalized 1-on-1 Video
              Calls in a Non-judgmental Environment to Boost Conﬁdence and Achieve Goals Faster.
            </p>
            <div className="buttonPart">
              <div className="trialBtn">
                <Link to="/student/book-trial" className="btn">Book A Trial @ ₹99</Link>
              </div>
            </div>
            <div className="iconsPart mt-4">
              <div>
                <BsFillCameraReelsFill />
                <p>1-on-1 Video Classes</p>
              </div>
              <div>
                <FaVideo />
                <p>Recording Access</p>
              </div>
              <div>
                <FaHeadphones />
                <p>
                  24/7 support
                </p>
              </div>
            </div>
          </Col>
          <Col xs={24} md={12} className="rightSide">
            {/* <img
              src={heroImage}
              alt=""
            /> */}
            <iframe
              width="560"
              height="347"
              src="https://www.youtube.com/embed/H9uSOlEnZhc?si=QBKqBNl-71NAKYcj"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Header;
