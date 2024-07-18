import React, { useEffect, useState } from "react";
import "./UpcomingStudent.css";
import { Tabs } from "antd";
import SessionCard from "../../../Components/SessionsCard/SessionsCard";
import { isAuthenticated } from "../../../Components/Auth/auth";
import { ErrorAlert, SuccessAlert } from "../../../Components/Messages/messages";
import axios from "axios";
import moment from "moment";

const UpcomingStudent = () => {
  const [loading, setLoading] = useState(false);
  const [futureClasses, setFutureClasses] = useState([]);
  const [previousClasses, setPreviousClasses] = useState([]);

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

    return () => {

    }
  }, []);

  const items = [
    {
      key: '1',
      label: 'Upcoming Classes',
      children:
        <div className="d-flex flex-wrap gap-3">
          {
            futureClasses?.map((classes, index) => {
              return (
                <SessionCard
                  key={index}
                  id={classes?._id}
                  tutor={classes?.tutor}
                  date={classes?.date}
                  time={classes?.time}
                  isUpcoming={true}
                  removeScheduledClass={removeScheduledClass}
                />
              )
            })
          }
        </div>
    },
    {
      key: '2',
      label: 'Previous Classes',
      children:
        <div className="d-flex flex-wrap gap-3">
          {
            previousClasses?.map((classes, index) => {
              return (
                <SessionCard
                  key={index}
                  id={classes?._id}
                  tutor={classes?.tutor}
                  date={classes?.date}
                  time={classes?.time}
                  isUpcoming={false}
                  recording={classes?.recording}
                />
              )
            })
          }
        </div>
    },
  ];

  return (
    <div className="UpcomingStudent">
      <div>
        <Tabs defaultActiveKey="1" onChange={(val) =>
          val === "1" ? getFutureClasses() : val === "2" && getPreviousClasses()}
          items={items}
        />
      </div>
    </div>
  );
};

export default UpcomingStudent;
