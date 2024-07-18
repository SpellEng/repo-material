import axios from "axios";
import moment from "moment";
import React, { useState } from "react";
import Calendar from "react-calendar";
import { FaClock } from "react-icons/fa";
import { isAuthenticated } from "../../../Components/Auth/auth";
import CalendarComp from "../../../Components/CalendarComp/CalendarComp";
import { ErrorAlert, SuccessAlert } from "../../../Components/Messages/messages";
import "./Availability.css";

const Availability = () => {
  const [date, setDate] = useState(new Date());

  const addTimeSlot = async (time) => {
    await axios.put(`${process.env.REACT_APP_BACKEND_URL}/users/tutors/add/time-slot`, { date: moment(date).format("DD/MM/YYYY"), time }, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    }).then(res => {
      if (res.status === 200) {
        SuccessAlert(res.data.successMessage);
        handleScheduleClasses(time);
      } else {
        ErrorAlert(res.data.errorMessage);
      }
    }).catch(err => {
      console.log(err)
      ErrorAlert(err?.message);
    });
  };

  const removeTimeSlot = async (time) => {
    await axios.put(`${process.env.REACT_APP_BACKEND_URL}/users/tutors/remove/time-slot`, { date: moment(date).format("DD/MM/YYYY"), time }, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    }).then(res => {
      if (res.status === 200) {
        SuccessAlert(res.data.successMessage);
        removeScheduledClass(time);
      } else {
        ErrorAlert(res.data.errorMessage);
      }
    }).catch(err => {
      console.log(err)
      ErrorAlert(err?.message);
    });
  };

  const removeScheduledClass = async (time) => {
    await axios.put(`${process.env.REACT_APP_BACKEND_URL}/scheduled-classes/delete-class-and-availability/${isAuthenticated()?._id}`, { date: moment(date).format("DD/MM/YYYY"), time }, {
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

  const onChange = (newDate) => {
    setDate(newDate);
  };

  const timingsArray = [
    "8:00am - 8:30am",
    "8:40am - 9:10am",
    "9:20am - 9:50am",
    "10:00am - 10:30am",
    "10:40am - 11:00am"
  ]

  const handleScheduleClasses = async (time) => {
    await axios.post(`${process.env.REACT_APP_BACKEND_URL}/scheduled-classes/add`, {
      tutor: isAuthenticated()?._id,
      date: moment(date).format("DD/MM/YYYY"),
      time
    }, {
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
    })
  }


  return (
    <div className="Availability">
      <div className="row">
        <div className="clockSide col-md-4">
          <CalendarComp date={date} onChange={onChange} />
        </div>
        <div className="timeSelect col-md-8">
          <p className="d-flex gap-2 mb-4">
            {moment(date).format("Do MMMM, YYYY")} <b>Please select your time slot from following:</b>
          </p>
          <div className="items">
            {
              timingsArray?.map((time, index) => {
                return (
                  <div key={index} className="item">
                    <div>
                      <FaClock />
                      <span>{time}</span>
                    </div>
                    <div className="buttons">
                      <button className="btn" onClick={() => addTimeSlot(time)}>ADD</button>
                      <span>Or</span>
                      <button className="btn" onClick={() => removeTimeSlot(time)}>REMOVE</button>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Availability;
