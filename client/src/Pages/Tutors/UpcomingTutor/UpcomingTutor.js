import React, { useEffect, useState } from "react";
import "./UpcomingTutor.css";
import { Tabs } from "antd";
import SessionCard from "../../../Components/SessionsCard/SessionsCard";
import axios from "axios";
import { ErrorAlert, SuccessAlert } from "../../../Components/Messages/messages";
import { isAuthenticated } from "../../../Components/Auth/auth";

const UpcomingTutor = () => {
  const [loading, setLoading] = useState(false);
  const [futureClasses, setFutureClasses] = useState([]);
  const [previousClasses, setPreviousClasses] = useState([]);

  const getFutureClasses = async () => {
    await axios.get(`${process.env.REACT_APP_BACKEND_URL}/scheduled-classes/tutor/future/${isAuthenticated()?._id}`, {
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
    await axios.get(`${process.env.REACT_APP_BACKEND_URL}/scheduled-classes/tutor/past/${isAuthenticated()?._id}`, {
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

  const removeTimeSlot = async (tm, dt) => {
    await axios.put(`${process.env.REACT_APP_BACKEND_URL}/users/tutors/remove/time-slot`, { date: dt, time: tm }, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    }).then(res => {
      if (res.status === 200) {
        SuccessAlert(res.data.successMessage);
      } else {
        ErrorAlert(res.data.errorMessage);
      }
    }).catch(err => {
      console.log(err)
      ErrorAlert(err?.message);
    });
  };

  const removeScheduledClass = async (id, dt, tm) => {
    await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/scheduled-classes/delete/${id}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    }).then(res => {
      if (res.status === 200) {
        SuccessAlert(res.data.successMessage);
        getFutureClasses();
        removeTimeSlot(dt, tm);
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
                  tutor={classes.tutor}
                  date={classes.date}
                  time={classes.time}
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
                  tutor={classes.tutor}
                  date={classes.date}
                  time={classes.time}
                  isUpcoming={false}
                  recording={classes?.recording}
                  isTutor={true}
                  studentId={classes?.students[0]?._id}
                />
              )
            })
          }
        </div>
    },
  ];

  return (
    <div className="UpcomingTutor">
      <div>
        <Tabs defaultActiveKey="1" onChange={(val) =>
          val === "1" ? getFutureClasses() : val === "2" && getPreviousClasses()}
          items={items}
        />
      </div>
    </div>
  );
};

export default UpcomingTutor;
