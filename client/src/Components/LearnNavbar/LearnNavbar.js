import React from "react";
import "./LearnNavbar.css";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

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
          <Link to="/signup" className="btn">Book A Trial @ ₹99</Link>
        </div>
      </div>
    </nav>
  );
};

export default LearnNavbar;
