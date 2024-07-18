import React, { useEffect, useState } from "react";
import "./TeacherDetails.css";
import ratingstar from "../../assets/star-fill.svg";
import graduation from "../../assets/graduation.svg";
import person from "../../assets/person.svg";
import quote from "../../assets/quote.svg";
import calendarpic from "../../assets/calendar.svg";
import clockpic from "../../assets/clock.svg";
import graphpic from "../../assets/graph.svg";
import heartpic from "../../assets/heart.svg";
import sendpic from "../../assets/send.svg";
import starpic from "../../assets/star.svg";
import { Col, Divider, Row, Tabs, Tag } from "antd";
import TutorCard from "../../Components/TutorCard/TutorCard";
import ReviewsAndRatings from "../../Components/TeacherDetails/ReviewsAndRatings/ReviewsAndRatings";
import AboutTeacher from "../../Components/TeacherDetails/AboutTeacher/AbourTeacher";
import { Link, useLocation } from "react-router-dom";
import { ErrorAlert, SuccessAlert } from "../../Components/Messages/messages";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import moment from "moment";
import CalendarComp from "../../Components/CalendarComp/CalendarComp";
import Loading from "../../Components/Loading/Loading";
import { isAuthenticated } from "../../Components/Auth/auth";
import { MdVerified } from "react-icons/md";

const TeacherDetails = () => {
  const location = useLocation();
  const tutorId = location.pathname.split("tutor/")[1];
  const [loading, setLoading] = useState(false);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [tutorObject, setTutorObject] = useState({});
  const [availabilitesArray, setAvailabilitesArray] = useState([]);
  const [selectedDateAndTimes, setSelectedDateAndTimes] = useState();
  const [date, setDate] = useState(new Date());
  const [tutorsArray, setTutorsArray] = useState([]);
  const [reservedTimes, setReservedTimes] = useState([]);
  const [activeTab, setActiveTab] = useState("1");

  const onChange = (newDate) => {
    setDate(newDate);
    setSelectedDateAndTimes();
    filterTutorAvailabilites(moment(newDate).format("DD/MM/YYYY"));
  };

  const handleSelectTime = (time) => {
    setSelectedDateAndTimes({ date, time });
  };

  const filterTutorAvailabilites = async (dt) => {
    setScheduleLoading(true);
    const filteredTutors = await tutorObject?.availability?.filter(av => av?.date === dt);
    setAvailabilitesArray(filteredTutors);
    setScheduleLoading(false);
  };


  const getTutorById = async () => {
    await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/user/${tutorId}`).then(res => {
      setLoading(false);
      if (res.status === 200) {
        setTutorObject(res.data);
        getAllTutors(res.data?._id);
      } else {
        ErrorAlert(res.data.errorMessage);
      }
    }).catch(err => {
      setLoading(false);
      console.log(err)
      ErrorAlert(err?.message);
    })
  }


  const getAllTutors = async (id) => {
    await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/tutors`).then(res => {
      setLoading(false);
      if (res.status === 200) {
        setTutorsArray(res.data?.filter(t => t?._id !== id));
      } else {
        ErrorAlert(res.data.errorMessage);
      }
    }).catch(err => {
      setLoading(false);
      console.log(err)
      ErrorAlert(err?.message);
    })
  }

  const handleActiveTabChange = (val) => {
    setActiveTab(val);
    if (val === "2") {
      filterTutorAvailabilites(moment().format("DD/MM/YYYY"));
    }
  }

  const getTutorReservedClasses = async (dt) => {
    if (date) {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/scheduled-classes/reserved/${tutorId}`, {
        tutor: tutorId,
        date: moment(dt).format("DD/MM/YYYY")
      }, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      }).then(res => {
        setLoading(false);
        if (res.status === 200) {
          setReservedTimes(res.data);
        } else {
          ErrorAlert(res.data.errorMessage);
        }
      }).catch(err => {
        setLoading(false);
        console.log(err)
        ErrorAlert(err?.message);
      })
    }
  }

  const handleScheduleClasses = async () => {
    if (selectedDateAndTimes) {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/scheduled-classes/add-students`, {
        tutor: tutorId,
        student: isAuthenticated()?._id,
        date: moment(selectedDateAndTimes?.date).format("DD/MM/YYYY"),
        time: selectedDateAndTimes?.time
      }, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      }).then(res => {
        setLoading(false);
        if (res.status === 200) {
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
      ErrorAlert("Please select schedule first");
      handleActiveTabChange("2");
    }
  }

  useEffect(() => {
    getTutorById();

    return () => {

    }
  }, [tutorId]);

  useEffect(() => {
    getTutorReservedClasses(date);

    return () => {

    }
  }, [date]);


  const ScheduleComponent = () => {
    return (
      <div className="scheduleClass">
        <h3 className="mb-4">Schedule a Class</h3>
        <div>
          <div className="calenderPart">
            <CalendarComp date={date} onChange={onChange} />
          </div>
          <div className="timingPart">
            <h6 className="pl-3 pb-2">{moment(date).format("Do MMMM, YYYY")} {availabilitesArray?.length} available time(s)</h6>
            <div className="inner">
              <div className="lessonPart">
                <h3>Lesson</h3>
                <p>15May,2014 . 1:30PM-3:30PM</p>
                <Tag style={{ width: "fit-content" }}>Private</Tag>
              </div>
              <Divider />
              {
                scheduleLoading ?
                  <Loading />
                  :
                  <div className="timeBtns">
                    {
                      availabilitesArray?.map((availibility, index) => {
                        const isReserved = reservedTimes?.some(f => f?.time === availibility?.time);
                        return (
                          <button
                            key={index}
                            disabled={isReserved}
                            className={`btn ${isReserved && "selected"} ${selectedDateAndTimes?.date?.getTime() === date.getTime() && selectedDateAndTimes?.time === availibility?.time ? 'selected' : ''}`}
                            onClick={() => handleSelectTime(availibility?.time)}>
                            {isReserved ? "Reserved" : availibility?.time}
                          </button>
                        )
                      })
                    }
                  </div>
              }
            </div>
          </div>
        </div>
      </div>
    )
  }

  const items = [
    {
      key: '1',
      label: 'About',
      children: <AboutTeacher tutorObject={tutorObject} />,
    },
    {
      key: '2',
      label: 'Schedule',
      children: <ScheduleComponent />,
    },
    {
      key: '3',
      label: `Reviews (${tutorObject?.reviews?.length})`,
      children: <ReviewsAndRatings updateParent={getTutorById} reviews={tutorObject?.reviews} tutorId={tutorId} />,
    },
  ];

  const averageRating = tutorObject?.reviews?.reduce((acc, review) => acc + review?.rating, 0) / tutorObject?.reviews?.length;

  return (
    loading ?
      <Loading />
      :
      <div className="TeacherDetails">
        <div className="row">
          <div className="detailPart col-md-8">
            <div className="teacher">
              <div>
                <img className="teacherPic" src={tutorObject?.picture?.url} alt="" />
              </div>
              <div className="teacherInfo">
                <div className="nameRating">
                  <div className="name">
                    <h4>{tutorObject?.fullName}</h4>
                  </div>
                  <MdVerified />
                  <div className="d-flex align-items-center gap-2">
                    <FaStar /> {averageRating} ({tutorObject?.reviews?.length})
                  </div>
                </div>
                <div className="brief">
                  <p>
                    {tutorObject?.headline}
                  </p>
                </div>
                <div className="teacherItems">
                  <div className="lesson">
                    <img src={graduation} alt="" />
                    <p>Teaches {tutorObject?.specialities?.map((sp, index) => <span key={index}>{sp}, </span>)}</p>
                  </div>
                  <div className="native">
                    <img src={quote} alt="" />
                    <p>
                      Speaks {tutorObject?.languages?.map((lng, index) => <span key={index}>{lng}, </span>)}
                    </p>
                  </div>
                  <div className="person">
                    <img src={person} alt="" />
                    <p>588 lessons taught</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="aboutSchedule">
              <Tabs activeKey={activeTab} items={items} onChange={handleActiveTabChange} />
            </div>
            <Divider />
          </div>
          <div className="col-md-4">
            <div className="schedulePart py-4">
              <div className="videoPart">
                <iframe
                  width="560"
                  height="315"
                  src="https://www.youtube.com/embed/E7wJTI-1dvQ"
                  title="YouTube video player"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
              </div>
              <div className="reviewsLessons">
                <div>
                  <p className="d-flex align-items-center justify-content-center gap-1">
                    <img src={ratingstar} alt="" /><b>{averageRating}</b>
                  </p>
                  <p>{tutorObject?.reviews?.length} reviews</p>
                </div>
              </div>
              <div className="buttons">
                <button className="btn" onClick={handleScheduleClasses}>
                  <img src={calendarpic} alt="" />
                  Schedule a class
                </button>
                <Link to={`/chats?receiver=${tutorId}`} className="btn">
                  <img src={sendpic} alt="" />
                  Send message
                </Link>
                <button className="btn">
                  <img src={heartpic} alt="" />
                  Save to my list
                </button>
              </div>
              <div className="teacherItems">
                <div className="graph">
                  <img src={graphpic} alt="" />
                  <p>9 lessons booked in the last 48 hours</p>
                </div>
                <div className="star">
                  <img src={starpic} alt="" />
                  <p>
                    Super popular: 10 student contacted this tutor in the last 48
                    hours
                  </p>
                </div>
                <div className="time">
                  <img src={clockpic} alt="" />
                  <p>Usually responds in 4 hrs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h1 className="my-5">Other Similar Tutors You may Like</h1>
          <Row gutter={[40, 40]} align="middle">
            {tutorsArray.map((tutor, index) => {
              return (
                <Col key={index} xs={12} md={7} xl={5} xxl={3}>
                  <TutorCard tutorProps={tutor} />
                </Col>
              );
            })}
          </Row>
        </div>
      </div>
  );
};

export default TeacherDetails;
