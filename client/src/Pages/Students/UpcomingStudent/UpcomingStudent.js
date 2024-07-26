import React, { useEffect, useState } from "react";
import "./UpcomingStudent.css";
import { Col, Row, Tabs } from "antd";
import SessionCard from "../../../Components/SessionsCard/SessionsCard";
import { isAuthenticated } from "../../../Components/Auth/auth";
import { ErrorAlert, SuccessAlert } from "../../../Components/Messages/messages";
import axios from "axios";
import moment from "moment";

const UpcomingStudent = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const [futureClasses, setFutureClasses] = useState([]);
  const [previousClasses, setPreviousClasses] = useState([]);
  const [user, setUser] = useState({});

  const getUserById = async () => {
    await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/user/${isAuthenticated()?._id}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    }).then(res => {
      setLoading(false);
      if (res.status === 200) {
        setUser(res.data);
      } else {
        ErrorAlert(res.data.errorMessage);
      }
    }).catch(err => {
      setLoading(false);
      console.log(err)
      ErrorAlert(err?.message);
    })
  }

  const getFutureClasses = async () => {
    await axios.get(`${process.env.REACT_APP_BACKEND_URL}/scheduled-classes/student/future/${isAuthenticated()?._id}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    }).then(res => {
      setLoading(false);
      if (res.status === 200) {
        setFutureClasses(res.data);
      } else {
        ErrorAlert(res.data.errorMessage);
      }
    }).catch(err => {
      setLoading(false);
      console.log(err)
      ErrorAlert(err?.message);
    })
  }

  const getPreviousClasses = async () => {
    await axios.get(`${process.env.REACT_APP_BACKEND_URL}/scheduled-classes/student/past/${isAuthenticated()?._id}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    }).then(res => {
      setLoading(false);
      if (res.status === 200) {
        setPreviousClasses(res.data);
      } else {
        ErrorAlert(res.data.errorMessage);
      }
    }).catch(err => {
      setLoading(false);
      console.log(err)
      ErrorAlert(err?.message);
    })
  }

  const removeScheduledClass = async (id, tm, dt) => {
    await axios.put(`${process.env.REACT_APP_BACKEND_URL}/scheduled-classes/cancel-and-reschedule/${id}`, { student: true, date: moment(dt).format("DD/MM/YYYY"), time: tm }, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    }).then(res => {
      if (res.status === 200) {
        SuccessAlert(res.data.successMessage);
        getFutureClasses();
      } else {
        ErrorAlert(res.data.errorMessage);
      }
    }).catch(err => {
      console.log(err)
      ErrorAlert(err?.message);
    });
  };

  useEffect(() => {
    getFutureClasses();
    getUserById();

    return () => {

    }
  }, []);

  const items = [
    {
      key: '1',
      label: 'Upcoming Classes',
      children:
        <Row gutter={[23, 23]}>
          {
            futureClasses?.map((classes, index) => {
              return (
                <Col xs={24} md={12} lg={8}>
                  <SessionCard
                    key={index}
                    id={classes?._id}
                    tutor={classes?.tutor}
                    date={classes?.date}
                    time={classes?.time}
                    isUpcoming={true}
                    meetingUrl={classes?.meetingUrl}
                    type="Tutor"
                    removeScheduledClass={removeScheduledClass}
                  />
                </Col>
              )
            })
          }
        </Row>
    },
    {
      key: '2',
      label: 'Previous Classes',
      children:
        <Row gutter={[23, 23]}>
          {
            previousClasses?.map((classes, index) => {
              return (
                <Col xs={24} md={12} lg={8}>
                  <SessionCard
                    key={index}
                    id={classes?._id}
                    tutor={classes?.tutor}
                    date={classes?.date}
                    time={classes?.time}
                    isUpcoming={false}
                    type="Tutor"
                  />
                </Col>
              )
            })
          }
        </Row>
    },
  ];

  const handleTabChange = (val) => {
    setActiveTab(val);
    val === "1" ? getFutureClasses() : val === "2" && getPreviousClasses();
  }

  return (
    <div className="UpcomingStudent">
      <div className="container">
        {
          activeTab === "2" && user?.recording &&
          <a href={user?.recording} className="downloadBtn" target="_blank">Download Recordings</a>
        }
        <Tabs defaultActiveKey="1" onChange={handleTabChange}
          items={items}
        />
      </div>
    </div>
  );
};

export default UpcomingStudent;
