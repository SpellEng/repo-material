import React, { useState } from "react";
import "./TutorRegistration.css";
import { Link, useNavigate } from "react-router-dom";
import logopic from "../../assets/favicon.ico";
import { Alert, Checkbox, Col, Divider, Input, Rate, Row } from "antd";
import OtpInput from "react-otp-input";
import { InputMask } from '@react-input/mask';
import loginpic from "../../assets/Book A Trial.webp";
import axios from "axios";
import { ErrorAlert, SuccessAlert } from "../../Components/Messages/messages";
import { setAuthentication } from "../../Components/Auth/auth";
import { CountdownTimer } from "../../Components/CountdownTimer";
import { getUserTimezone } from "../../Components/UserTimeZone";

const TutorRegistration = () => {
  const router = useNavigate();
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [validationError, setValidationError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    city: '',
    phoneNumber: '',
    termsAccepted: false,
    role: "tutor",
    orderId: ""
  });

  const { fullName, city, phoneNumber, email, password } = formData;

  const handleChange = (key, value) => {
    setFormData({
      ...formData,
      [key]: value
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (fullName, city, phoneNumber, email, password) {
      setLoading(true);
      if (otp) {
        formData.otp = otp;
        formData.timezone = getUserTimezone();
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/signup`, formData).then(res => {
          setLoading(false);
          if (res.status === 200) {
            setAuthentication(res.data?.user, res.data?.token);
            SuccessAlert(res.data.successMessage);
            router("/");
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
      } else {
        ErrorAlert("Please verify your OTP first to continue")
      }
    } else {
      setValidationError("All fields are required");
    }
  };

  const sendOtp = async () => {
    if (phoneNumber) {
      setLoading(true);
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/send-otp`, { phoneNumber }).then(res => {
        setLoading(false);
        if (res.status === 200) {
          setOtpSent(true);
          handleChange('orderId', res.data.orderId);
          SuccessAlert(res.data.successMessage);
        } else {
          ErrorAlert(res.data.errorMessage);
        }
      }).catch(err => {
        setLoading(false);
        console.log(err)
        ErrorAlert(err?.message);
      })
    } else {
      setValidationError("Please enter your phone number.");
    }
  };

  return (
    <div className="tutorRegistration">
      <Row gutter={[19, 19]}>
        <Col xs={24} md={13} className="leftTutorRegistration">
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
        <Col xs={24} md={11} className="rightTutorRegistration">
          <div className="d-flex align-items-center justify-content-start gap-3 mb-4">
            <Link to="/">
              <img className="logo" src={logopic} alt="" />
            </Link>
            <h2>Let's Go</h2>
          </div>
          <form className="form" onSubmit={submitHandler}>
            {
              validationError &&
              <Alert type="error">{validationError}</Alert>
            }
            <Row gutter={[19, 19]}>
              <Col xs={24} md={12} className="leftinput">
                <div className="item">
                  <label htmlFor="name" className="form-label">
                    Full Name
                  </label>
                  <Input
                    required
                    type="text"
                    placeholder="Enter your name"
                    value={formData.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                  />
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div className="item">
                  <label htmlFor="inputEmail" className="form-label">
                    Email
                  </label>
                  <Input
                    required
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                  />
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div className="item">
                  <label htmlFor="inputPassword" className="form-label">
                    Password
                  </label>
                  <Input.Password
                    required
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                  />
                </div>
              </Col>
              <Col xs={24} md={12} className="rightinput">
                <div className="item">
                  <label htmlFor="phoneNumber" className="form-label">
                    Phone number
                  </label>
                  <div className="PhoneBtnContainer">
                    <InputMask
                      placeholder="Enter phone number"
                      mask="+91__________"
                      replacement={{ _: /\d/ }}
                      onChange={(e) => handleChange('phoneNumber', e.target.value)}
                    />
                    <button onClick={sendOtp} type="button" className="codebtn btn">Send code</button>
                  </div>
                </div>
              </Col>
              {
                otpSent &&
                <Col xs={24}>
                  <div className="otpPart">
                    <div>
                      <h3 className="mb-2">OTP</h3>
                      <OtpInput
                        value={otp}
                        onChange={setOtp}
                        numInputs={6}
                        renderSeparator={<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>}
                        renderInput={(props) => <input {...props} />}
                      />
                    </div>
                  </div>
                  <CountdownTimer sendOtp={sendOtp} />
                </Col>
              }
              <Col xs={24}>
                <Checkbox
                  required
                  checked={formData.termsAccepted}
                  onChange={(e) => handleChange('termsAccepted', e.target.checked)}
                >
                  Accept terms of condition and privacy policy
                </Checkbox>
              </Col>
              <Col xs={24} className="otpBtn">
                <button type="submit">Submit</button>
              </Col>
            </Row>
          </form>
          <Divider>Or</Divider>
          <div className="loginOption">
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default TutorRegistration;
