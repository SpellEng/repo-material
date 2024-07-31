import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { FaClock } from "react-icons/fa";
import { isAuthenticated } from "../../../Components/Auth/auth";
import CalendarComp from "../../../Components/CalendarComp/CalendarComp";
import { ErrorAlert, SuccessAlert } from "../../../Components/Messages/messages";
import { staticAvailabilitesArray } from "./availabilitesArray";
import "./Availability.css";

const Availability = () => {
  const [date, setDate] = useState(new Date());
  const [availabilitesArray, setAvailabilitesArray] = useState([]);
  const [tutorObject, setTutorObject] = useState({});

  const createMeeting = async (time, startTime) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/scheduled-classes/create-meeting`, {
        startTime,
        email: isAuthenticated()?.email,
        timezone: isAuthenticated()?.timezone,
      });
      if (response.status === 200) {
        handleScheduleClasses(time, response.data.meetingLink);
      } else {
        ErrorAlert(response.data.errorMessage);
      }
      // setMeetingLink(response.data.meetingLink);
    } catch (error) {
      // console.error('Error creating meeting', error.response ? error.response.data : error.message);
      ErrorAlert(error.message);
    }
  };

  const getTutorById = async () => {
    await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/user/${isAuthenticated()?._id}`).then(res => {
      if (res.status === 200) {
        setTutorObject(res.data);
      } else {
        ErrorAlert(res.data.errorMessage);
      }
    }).catch(err => {
      console.log(err)
      ErrorAlert(err?.message);
    })
  }

  const addTimeSlot = async (time) => {
    await axios.put(`${process.env.REACT_APP_BACKEND_URL}/users/tutors/add/time-slot`, { date: moment(date).format("DD/MM/YYYY"), time }, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    }).then(res => {
      if (res.status === 200) {
        SuccessAlert(res.data.successMessage);
        getTutorById();
      } else {
        ErrorAlert(res.data.errorMessage);
      }
    }).catch(err => {
      console.log(err)
      ErrorAlert(err?.message);
    });
  };

  const handleAddTimeSlot = (time) => {
    const startTime = moment(`${moment(date).format("YYYY/MM/DD")} ${time.split(" - ")[0]}`, "YYYY/MM/DD h:mm a").toISOString(); // Convert to ISO format
    createMeeting(time, startTime);
  }

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
        getTutorById();
        filterTutorAvailabilites(moment(date).format("DD/MM/YYYY"));
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
    filterTutorAvailabilites(moment(newDate).format("DD/MM/YYYY"));
  };

  const filterTutorAvailabilites = async (dt) => {
    const filteredTutors = await tutorObject?.availability?.filter(av => av?.date === dt);
    setAvailabilitesArray(filteredTutors);
  };


  const handleScheduleClasses = async (time, meetingUrl) => {
    await axios.post(`${process.env.REACT_APP_BACKEND_URL}/scheduled-classes/add`, {
      tutor: isAuthenticated()?._id,
      date: moment(date).format("DD/MM/YYYY"),
      time,
      meetingUrl
    }, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    }).then(res => {
      if (res.status === 200) {
        SuccessAlert(res.data.successMessage);
        addTimeSlot(time);
      } else {
        ErrorAlert(res.data.errorMessage);
      }
    }).catch(err => {
      console.log(err)
      ErrorAlert(err?.message);
    })
  }

  useEffect(() => {
    getTutorById();

    return () => {

    }
  }, []);

  useEffect(() => {
    if (tutorObject) {
      filterTutorAvailabilites(moment(new Date(date)).format("DD/MM/YYYY"));
    }

    return () => {

    }
  }, [tutorObject]);


  console.log(availabilitesArray);
  return (
    <div className="Availability">
      <div className="container">
        <div className="text-end">
          <a className="btn ant-btn-primary" target="_blank" href={`${process.env.REACT_APP_BACKEND_URL}/auth/authorize`}>Authorize Zoom</a>
        </div>
        <div className="row">
          <div className="clockSide col-md-4 my-4">
            <CalendarComp date={date} onChange={onChange} />
          </div>
          <div className="timeSelect col-md-8">
            <p className="d-flex gap-2 mb-4">
              {moment(date).format("Do MMMM, YYYY")} <b>Please select your time slot from following:</b>
            </p>
            <div className="items">
              {
                staticAvailabilitesArray?.map((time, index) => {
                  const isAdded = availabilitesArray?.some(f => f?.time === time);

                  return (
                    <div key={index} className="item">
                      <div>
                        <FaClock />
                        <span>{time}</span>
                      </div>
                      <div className="buttons">
                        {
                          !isAdded ?
                            <button className="btn" onClick={() => handleAddTimeSlot(time)}>ADD</button>
                            :
                            <button className="btn removeBtn" onClick={() => removeTimeSlot(time)}>REMOVE</button>
                        }
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Availability;
