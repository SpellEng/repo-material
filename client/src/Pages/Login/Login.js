import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import logopic from "../../assets/logo.png";
import { Button, Col, Divider, Input, Rate, Row } from "antd";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import loginpic from "../../assets/Login.png";
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
    }
  };


  return (
    <div className="login">
      <Row>
        <Col xs={24} md={13} className="leftLogin col-md-7">
          <Swiper
            className="swiper"
            spaceBetween={50}
            slidesPerView={1}
            autoplay={{
              delay: 2000,
              disableOnInteraction: true,
            }}
            loop={true}
            modules={[Autoplay]}
          >
            <SwiperSlide className="swiperSlide">
              <div>
                <img src={loginpic} alt="" />
                <div className="bgOpacity" />
                <div className="caption">
                  <h3>
                    "An exceptional agency CEO is a visionary, constantly pushing the boundaries of creativity and pushing their team to new heights. They inspire with their passion and cultivate a culture of trust and respect."
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
            </SwiperSlide>
            <SwiperSlide className="swiperSlide">
              <div>
                <img src={loginpic} alt="" />
                <div className="bgOpacity" />
                <div className="caption">
                  <h3>
                    "An exceptional agency CEO is a visionary, constantly pushing the boundaries of creativity and pushing their team to new heights. They inspire with their passion and cultivate a culture of trust and respect."
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
            </SwiperSlide>
          </Swiper>
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
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <Button loading={loading} htmlType="submit" className="h-auto py-2">Login</Button>
              </div>
            </form>
            <Divider>Or</Divider>
            <div className="bookTrail">
              <p>
                Not registered yet? &nbsp;
                <Link to="/signup">Book a Trial @199</Link>
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </div >
  );
};

export default Login;
