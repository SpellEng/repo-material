import React from "react";
import "./Footer.css";
import { Link, useNavigate } from "react-router-dom";
import fb from "../../assets/fb.png";
import insta from "../../assets/insta.png";
import tw from "../../assets/tw.png";
import yt from "../../assets/yt.png";
import Li from "../../assets/Li.png";
import { Divider } from "antd";
import logo from "../../assets/logo.png";
import { LuClock, LuMail, LuMapPin, LuPhone } from "react-icons/lu";
import { isAuthenticated } from "../Auth/auth";

const Footer = () => {
  const router = useNavigate();

  return (
    <div className="footer">
      <div className="container">
        <div className="footerTop">
          <h2>
            Get started on your path to <span>success with us</span>
          </h2>
          <button onClick={() => router(isAuthenticated() ? "/student/book-trial" : "/signup")}>Book A Trial @ ₹99</button>
        </div>
        <Divider />
        <section>
          <div className="quick">
            <h4>Quick Links</h4>
            <Link to="/">Homepage</Link>
            <Link to="/about-us">About Us</Link>
            <Link to="/contact-us">Contact Us</Link>
            <Link to="/all-tutors">All Tutors</Link>
            <Link to={isAuthenticated() ? "/student/book-trial" : "/signup"}>Book a Trial</Link>
          </div>
          <div className="legal">
            <h4>Legal Pages</h4>
            <Link to="/terms">Terms & Conditions</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/faqs">FAQS</Link>
            <Link to="/cancellation-and-refund-policy">Cancellation and Refund Policy</Link>
            <Link to="/shipping-policy">Shipping Policy</Link>
          </div>
          <div className="contactLinks">
            <h4>Contact Details</h4>
            <Link to="/">
              <LuMapPin />
              <p>Near BDI Ananda, Jhiwana Road, Tapukara, Rajasthan, 301707</p>
            </Link>
            <a href="tel:(+91) 9982117398 ">
              <LuPhone />
              <p>(+91) 9982117398</p>
            </a>
            <a href="mailto: Team@spelleng.com">
              <LuMail />
              <p>team@spelleng.com</p>
            </a>
            <Link to="#">
              <LuClock />
              <p>Mon - Fri: 09:00 AM - 05:00 PM Sat - Sun: Closed</p>
            </Link>
          </div>
          <div className="socialMedia">
            {/* <h4>App available on</h4>
            <p>Apps Coming Soon!</p>
            <Row gutter={[10, 10]} className="appsImages my-3">
              <Col xs={24} md={12}>
                <img src={android} alt="Google Play Store" />
              </Col>
              <Col xs={24} md={12}>
                <img src={ios} alt="App Store" />
              </Col>
            </Row> */}
            <div className="followPart">
              <h4>Follow On</h4>
              <div className="followLink mt-2">
                <Link target="_blank" to="https://www.facebook.com/profile.php?id=61560545361689">
                  <img src={fb} alt="" />
                </Link>
                <Link target="_blank" to="https://www.instagram.com/spellengeducation/">
                  <img src={insta} alt="" />
                </Link>
                <Link target="_blank" to="https://www.youtube.com/@SpellEng">
                  <img src={yt} alt="" />
                </Link>
                <Link target="_blank" to="https://x.com/spell_eng">
                  <img src={tw} alt="" />
                </Link>
                <Link target="_blank" to="https://www.linkedin.com/company/spelleng/">
                  <img src={Li} alt="" />
                </Link>
              </div>
            </div>
          </div>
        </section>
        <Divider />
        <div className="copyright">
          <img src={logo} alt="" />
          <p>Copyrights @2024 SpellEng</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
