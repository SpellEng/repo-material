import React from "react";
import "./Digital.css";
import digitalpic from "../../assets/digital.webp";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "antd";

const Digital = () => {
  const router = useNavigate();

  return (
    <div className="Digital container">
      <div className="inner">
        <Row className="row">
          <Col xs={{ span: 24, order: 1 }} md={{ span: 12, order: 0 }} className="picSide col-md-6">
            <img src={digitalpic} alt="" />
          </Col>
          <Col xs={{ span: 24, order: 0 }} md={{ span: 12, order: 1 }} className="optionSide col-md-6">
            <h2>Accelerate Your English Learning with 1-on-1 Video Classes</h2>
            <p className="mb-4">
              Personalized Instruction, Flexible Scheduling, Expert Guidance, and Access to Class Recordings!
            </p>
            <div className="digitalButton">
              <button onClick={() => router("/all-tutors")}>Book A Trial @₹99</button>
            </div>
            <div className="options">
              <ul className="leftOption">
                <li><FaCheckCircle />Fluency in Speaking</li>
                <li><FaCheckCircle />Listening Skills</li>
                <li><FaCheckCircle />Expanding Vocabulary</li>
                <li><FaCheckCircle />Mastering Pronunciation</li>
              </ul>
              <ul className="rightOption">
                <li><FaCheckCircle />Reduce Native Accent </li>
                <li><FaCheckCircle />Reduce Inﬂuence of Mother Tongue</li>
                <li><FaCheckCircle />Remove Filler Words</li>
                <li><FaCheckCircle />No Fear of Making Mistakes</li>
              </ul>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Digital;
