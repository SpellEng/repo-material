import React from "react";
import "./Header.css";
import heroImage from "../../assets/hero-finance.svg";
import { Col, Row } from "antd";
import { FaHeadphones, FaVideo } from "react-icons/fa";
import { GiVideoCamera } from "react-icons/gi";
import { Link } from "react-router-dom";
import { BsFillCameraReelsFill } from "react-icons/bs";

const Header = () => {
  return (
    <div className="mainHeader">
      <div className="subHeader">
        <Row gutter={[40, 40]}>
          <Col xs={24} md={12} className="leftSide">
            <h2>Speak English with Conﬁdence in Just Weeks</h2>
            <p className="mb-5">
              Improve Your English Fluency with Expert Tutors: Personalized 1-on-1 Video
              Calls in a Non-judgmental Environment to Boost Conﬁdence and Achieve Goals Faster.
              We use youtube video instead of right side illustraion don't worry I will provide you the video. Till
              then, you can use any random video from YouTube.
            </p>
            <div className="buttonPart">
              <div className="getBtn">
                <Link to="/all-tutors">Get started</Link>
              </div>
              <div className="trialBtn">
                <Link to="/subscription">Start a Trial @ 199</Link>
              </div>
            </div>
            <div className="iconsPart">
              <div>
                <BsFillCameraReelsFill />
                <p>1. 1-on-1 Video Classes</p>
              </div>
              <div>
                <FaVideo />
                <p> 2.  30-Day Recordings Access  </p>
              </div>
              <div>
                <FaHeadphones />
                <p>
                  3. 24/7 support
                </p>
              </div>
            </div>
          </Col>
          <Col xs={24} md={12} className="rightSide">
            <img
              src={heroImage}
              alt=""
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Header;
