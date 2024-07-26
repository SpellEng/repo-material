import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import logopic from "../../assets/favicon.ico";
import { Button, Col, Divider, Input, Rate, Row } from "antd";
import loginpic from "../../assets/Login.webp";
import axios from "axios";
import { ErrorAlert, SuccessAlert } from "../../Components/Messages/messages";
import { setAuthentication } from "../../Components/Auth/auth";

const Login = () => {
  const router = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;

  const handleChange = (key, value) => {
    setFormData({
      ...formData,
      [key]: value
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (email, password) {
      setLoading(true);
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/login`, formData).then(res => {
        setLoading(false);
        if (res.status === 200) {
          setAuthentication(res.data?.user, res.data?.token);
          SuccessAlert(res.data.successMessage);
          if (res.data?.user?.role === 0) {
            router("/student/upcoming-classes");
          } else if (res.data?.user?.role === 2) {
            router("/admin/dashboard");
          } else {
            router("/tutor/upcoming-classes");
          }
          setTimeout(() => {
            document.location.reload();
          }, 1000);
        } else {
          ErrorAlert(res.data.errorMessage);
        }
      }).catch(err => {
        setLoading(false);
        console.log(err)
        ErrorAlert(err?.message);
      })
    }
  };


  return (
    <div className="login">
      <Row>
        <Col xs={24} md={13} className="leftLogin col-md-7">
          <div>
            <img src={loginpic} alt="" />
            <div className="bgOpacity" />
            <div className="caption">
              <h3>
                "Learning English is crucial for career
                advancement and higher income potential. It opens global job
                opportunities, improves communication skills, and increases access
                to valuable educational resources."
              </h3>
              <div className="nameAndReviews">
                <div>
                  <h2>Parvej Khan</h2>
                  <span>Founder, SpellEng</span>
                </div>
                <Rate value={4.5} allowHalf disabled />
              </div>
            </div>
          </div>
        </Col>
        <Col xs={24} md={10} className="rightLogin">
          <div>
            <Link to="/">
              <img className="logo" src={logopic} alt="" />
            </Link>
            <h2>WELCOME BACK</h2>
            <p>Welcome back, please enter your email or phone number</p>
            <form onSubmit={submitHandler}>
              <div className="item">
                <label for="inputEmail" className="form-label">
                  Email
                </label>
                <Input
                  onChange={(e) => handleChange('email', e.target.value)}
                  type="email"
                  placeholder="Enter your email"
                />
              </div>
              <div className="item">
                <label for="inputEmail" className="form-label">
                  Password
                </label>
                <Input.Password
                  onChange={(e) => handleChange('password', e.target.value)}
                  type="password"
                  placeholder="Enter your password"
                />
              </div>
              <div>
                <Button loading={loading} htmlType="submit" className="h-auto py-2">Login</Button>
              </div>
            </form>
            <Divider>Or</Divider>
            <div className="bookTrail">
              <p>
                Not Registered Yet? &nbsp;
                <Link to="/signup">Book A Trial @ ₹99</Link>
              </p>
            </div>
            <div className="bookTrail">
              <p>
                Forgot Password? &nbsp;
                <Link to="/forgot-password">Click here</Link>
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </div >
  );
};

export default Login;
