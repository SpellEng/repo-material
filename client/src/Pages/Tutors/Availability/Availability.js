import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { FaClock } from "react-icons/fa";
import { isAuthenticated } from "../../../Components/Auth/auth";
import CalendarComp from "../../../Components/CalendarComp/CalendarComp";
import { ErrorAlert, SuccessAlert } from "../../../Components/Messages/messages";
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

  const timingsArray = [
    "8:00am - 8:30am",
    "8:40am - 9:10am",
    "9:20am - 9:50am",
    "10:00am - 10:30am",
    "10:40am - 11:10am",
    "11:20am - 11:50am",
    "12:00pm - 12:30pm",
    "12:40pm - 1:10pm",
    "1:20pm - 1:50pm",
    "2:00pm - 2:30pm",
    "2:40pm - 3:10pm",
    "3:20pm - 3:50pm",
    "4:00pm - 4:30pm",
    "4:40pm - 5:10pm",
    "5:20pm - 5:50pm",
    "6:00pm - 6:30pm",
    "6:40pm - 7:10pm",
    "7:20pm - 7:50pm",
    "8:00pm - 8:30pm",
    "8:40pm - 9:10pm",
    "9:20pm - 9:50pm",
    "10:00pm - 10:30pm",
    "10:30pm - 11:00pm",
  ];


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
      filterTutorAvailabilites(moment(new Date()).format("DD/MM/YYYY"));
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
                timingsArray?.map((time, index) => {
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
