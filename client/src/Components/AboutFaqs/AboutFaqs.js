import React from "react";
import "./AboutFaqs.css";
import indianFlag from "../../assets/flag.png";
import { Col, Collapse, Row } from "antd";
import { BiSupport } from "react-icons/bi";
import { FaLocationDot } from "react-icons/fa6";

const AboutFaqs = () => {
  const Faqs = [
    {
      key: "1",
      label: "What is SpellEng?",
      children: (
        <p>
          SpellEng is an online platform that connects students with skilled
          English tutors for personalized, one-on-one video sessions. Our
          mission is to make high-quality English education accessible to
          everyone.
        </p>
      ),
    },
    {
      key: "2",
      label: "How did SpellEng start?",
      children: (
        <p>
          SpellEng was founded by individuals who faced challenges in learning
          English in traditional settings. Our founders experienced the
          difficulties of large class sizes and lack of personalized attention,
          which inspired them to create a more effective and convenient solution
          for English learners.
        </p>
      ),
    },
    {
      key: "3",
      label:
        "What makes SpellEng different from other English learning platforms?",
      children: (
        <p>
          SpellEng offers personalized, one-on-one tutoring sessions tailored to
          each student's unique needs. Our platform is user-friendly, allowing
          students to schedule sessions at their convenience from the comfort of
          their homes. We also ensure that our tutors are highly qualified and
          experienced.
        </p>
      ),
    },
    {
      key: "4",
      label: "Who can use SpellEng?",
      children: (
        <p>
          SpellEng is designed for anyone looking to improve their English
          fluency, regardless of their current proficiency level or background.
          Our platform is suitable for students, professionals, and anyone else
          who wants to enhance their English skills.
        </p>
      ),
    },
    {
      key: "5",
      label: "How do I get started with SpellEng?",
      children: (
        <p>
          Getting started with SpellEng is easy. Simply sign up on our website, choose your tutor, and schedule your first session. Our platform is designed to be intuitive and straightforward, ensuring a seamless experience.
        </p>
      ),
    },
  ];
  return (
    <div className="aboutFaqs">
      <div className="aboveFaqs">
        <h2>We're expanding and reaching more learners every day.</h2>
        <p>
          Reach Us Through Multiple Channels: Call, Email, WhatsApp, and More!
        </p>
      </div>
      <div className="aboutCard">
        <img src={indianFlag} alt="" />
        <h5>India</h5>
        <div className="addressSection">
          <FaLocationDot />
          <p>Near BDI Ananda, Jhiwana Road, Tapukara, Rajasthan, 301707</p>
        </div>
        <div className="callSection">
          <BiSupport />
          <p>(+91) 9982117398</p>
        </div>
      </div>
      <div className="mainFaqs">
        <Row gutter={{ xs: 40, md: 80 }}>
          <Col xs={24} md={12} className="headingFAqs">
            <h1>
              You have questions we have answers
            </h1>
          </Col>
          <Col xs={24} md={12} className="QA">
            <Collapse bordered={false} accordion items={Faqs} />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AboutFaqs;
