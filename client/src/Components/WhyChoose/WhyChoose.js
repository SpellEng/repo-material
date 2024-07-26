import React from "react";
import "./WhyChoose.css";
import choosepic from "../../assets/Choose.webp";
import spread from "../../assets/spread.svg";
import { Button, Col, Collapse, Row } from "antd";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const WhyChoose = () => {
  const router = useNavigate();
  const items = [
    {
      key: "1",
      label: "Personalized Learning",
      children: <p> Tailored sessions that focus on individual needs.</p>,
    },
    {
      key: "2",
      label: "Expert Tutors",
      children: (
        <p> Access to highly qualiﬁed and experienced English tutors</p>
      ),
    },
    {
      key: "3",
      label: "Convenience",
      children: (
        <p>
          Easy booking and automated scheduling for a smooth learning experience
        </p>
      ),
    },
    {
      key: "4",
      label: "Affordable",
      children: (
        <p>
          Cost-effective subscription model with clear value for both students and tutors.
        </p>
      ),
    },
  ];
  return (
    <div className="WhyChoose">
      <Row gutter={[40, 40]} className="container m-auto">
        <Col xs={24} md={12} className="imgPart">
          <img src={spread} alt="" className="spread" />
          <img src={choosepic} alt="" />
        </Col>
        <Col xs={24} md={12} className="questionPart">
          <h2>Why Choose SpellEng?</h2>
          <div className="collapseWhyChoose">
            <Collapse ghost expandIcon={<FaPlus />} accordion items={items} />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default WhyChoose;
