import React from "react";
import "./LearnNavbar.css";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { FaPhone } from "react-icons/fa";

const LearnNavbar = () => {
  return (
    <nav className="navbar navbar-expand-lg learnNavbar container">
      <div className="container-fluid px-0">
        <div className="logo navbar-brand">
          <Link to="/">
            <img src={logo} alt="" />
          </Link>
        </div>
        <div className="trialBtn">
          <a href="tel: 9982117398" className="btn">
            <FaPhone />
            <span>9982117398</span>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default LearnNavbar;
