import React from "react";
import "./Contact.css";
import { Link } from "react-router-dom";
import ContactCard from "../../Components/ContactCard/ContactCard";
import fb from "../../assets/fb.png";
import insta from "../../assets/insta.png";
import tw from "../../assets/tw.png";
import yt from "../../assets/yt.png";
import Li from "../../assets/Li.png";
import { Col, Row } from "antd";
import flagimg from "../../assets/flag.png";
import ContactForm from "../../Components/ContactForm/ContactForm";
import { FaLocationDot } from "react-icons/fa6";
import { FaPhone } from "react-icons/fa";
import { LuMail } from "react-icons/lu";
import { SuccessAlert } from "../../Components/Messages/messages";

const Contact = () => {
  const contactArray = [
    {
      icon: <FaLocationDot />,
      heading: "Office Address",
      img: flagimg,
      country: "Indian Office",
      para: "Near BDI Ananda, Jhiwana Road,Tapukara, Rajasthan, 301707",
    },
    {
      icon: <LuMail />,
      heading: "Email Us:",
      para: "We're committed to prompt responses and strive to address all inquiries within 24 hours.",
      email: <Link to="/team@spelleng.com">team@spelleng.com</Link>,
    },
    {
      icon: <FaPhone />,
      heading: "WhatsApp Us:",
      para: "Feel free to send us a message, and we'll be happy to assist you promptly.",
      number: "(+91) 9982117398",
    },
  ];


  return (
    <div className="contact">
      <div className="innerContact">
        <Row gutter={[40, 40]} justify="center">
          <Col xs={24} md={12} className="contactleft ">
            <h2>
              Get in Touch with SpellEng for More<span>Information</span>
            </h2>
            <p className="my-3">
              You can reach us anytime via
              <Link to="/team@spelleng.com"> team@spelleng.com</Link>
            </p>
            <div className="followUs">
              <h6>Follow On:</h6>
              <p>
                <Link to="https://www.facebook.com/profile.php?id=61560545361689">
                  <img src={fb} alt="" />
                </Link>
                <Link to="https://www.instagram.com/spellengeducation/">
                  <img src={insta} alt="" />
                </Link>
                <Link to="https://www.youtube.com/@SpellEng">
                  <img src={yt} alt="" />
                </Link>
                <Link to="https://x.com/spell_eng">
                  <img src={tw} alt="" />
                </Link>
                <Link to="https://www.facebook.com/profile.php?id=61560545361689">
                  <img src={Li} alt="" />
                </Link>
              </p>
            </div>
          </Col>
          <Col xs={24} md={12} className="contactForm">
            <ContactForm />
          </Col>
        </Row>
        <div className="mt-5">
          <Row gutter={[40, 40]}>
            {contactArray.map((card, index) => {
              return (
                <Col key={index} xs={24} md={8} className="CardComp">
                  <ContactCard contactProps={card} />
                </Col>
              );
            })}
          </Row>
        </div>
      </div>
    </div>
  );
};

export default Contact;
