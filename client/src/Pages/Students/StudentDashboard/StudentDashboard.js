import React, { useEffect } from "react";
import "./StudentDashboard.css";
import { Col, Row } from "antd";
import { GiCheckMark } from "react-icons/gi";
import { isAuthenticated } from "../../../Components/Auth/auth";
import { useState } from "react";
import axios from "axios";
import moment from "moment";
import { ErrorAlert } from "../../../Components/Messages/messages";
import { FaUser } from "react-icons/fa";


const StudentDashboard = () => {
  const user = isAuthenticated();
  const [classes, setClasses] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);

  const getPreviousClasses = async () => {
    await axios.get(`${process.env.REACT_APP_BACKEND_URL}/scheduled-classes/student/past/${user?._id}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    }).then(res => {
      if (res.status === 200) {
        setClasses(res.data);
      } else {
        ErrorAlert(res.data.errorMessage);
      }
    }).catch(err => {
      console.log(err)
      ErrorAlert(err?.message);
    })
  }

  const fetchSubscriptions = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/subscriptions/user/${user?._id}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      });
      setSubscriptions(response.data);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    }
  };

  useEffect(() => {
    const checkExpiry = async () => {
      const now = new Date();
      for (let subscription of subscriptions) {
        const expiryDate = new Date(subscription.expiryDate);
        if (expiryDate < now && subscription.status !== 'expired') {
          try {
            await axios.put(`${process.env.REACT_APP_BACKEND_URL}/subscriptions/update-status/${subscription._id}`, { status: "expired" }, {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
              }
            }).then(res => {
              if (res.status === 200) {
                fetchSubscriptions();
              }
            })
          } catch (error) {
            console.error('Error updating subscription status:', error);
          }
        }
      }
    };

    checkExpiry();
  }, [subscriptions]);

  useEffect(() => {
    getPreviousClasses();
    fetchSubscriptions();

    return () => {

    }
  }, [])


  return (
    <div className="StudentDashboard">
      <div className="container">
        <Row gutter={[23, 23]}>
          <Col xs={23} md={6}>
            <section className="firstPart">
              {
                user?.picture?.url ?
                  <img src={user?.picture?.url} alt="" className="userPicture" />
                  :
                  <FaUser />
              }
              <h3>
                Welcome ack,<br />{user?.fullName}!
              </h3>
              <h2>Statistics</h2>
              <div className="stats">
                <div>
                  <small>
                    lessons
                  </small>
                  <h5>{classes?.length}</h5>
                </div>
                <div>
                  <small>
                    Minutes with tutors
                  </small>
                  <h5>{classes?.length * 30}</h5>
                </div>
              </div>
            </section>
          </Col>
          <Col xs={24} md={18}>
            <section className="secondSection">
              <h3>
                Get access to 100%
                <br /> English speaking tutors, 24/7 scheduling, and more.
              </h3>
              <h3>Subscribed plan</h3>
              <p>
                You have&nbsp;
                {
                  subscriptions?.slice(-1)[0]?.plan === "1 Month Plan" ?
                    "1 month"
                    :
                    "3 months"
                }
                &nbsp;in which get 1 on 1 class with tutors and
                <span> Your Plan Expire on {moment(subscriptions?.slice(-1)[0]?.expiryDate).format("DD MMMM")}</span>
              </p>
            </section>
          </Col>
          <Col xs={24} md={8}>
            <section className="howitworks">
              <h4 className="mb-3">How SpellEng Works</h4>
              <div>
                <GiCheckMark />
                <p>
                  Talk live with native tutors in every lesson
                </p>
              </div>
              <div>
                <GiCheckMark />
                <p>
                  Schedule lessons ahead of time, or talk when you're free, 24/7
                </p>
              </div>
              <div>
                <GiCheckMark />
                <p>
                  All tutors, courses, and tools are
                  included in every subscription
                </p>
              </div>
            </section>
          </Col>
          <Col xs={24} md={16}>
            <section className="studentDashboardVideo text-center">
              <iframe width="560" height="230" src="https://www.youtube.com/embed/H9uSOlEnZhc?si=axozlwnQsI1CgjLT" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
            </section>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default StudentDashboard;