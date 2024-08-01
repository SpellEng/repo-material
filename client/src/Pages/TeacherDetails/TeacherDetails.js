import React, { useEffect, useState } from "react";
import "./TeacherDetails.css";
import { Button, Col, Divider, Row, Tabs, Tag } from "antd";
import TutorCard from "../../Components/TutorCard/TutorCard";
import ReviewsAndRatings from "../../Components/TeacherDetails/ReviewsAndRatings/ReviewsAndRatings";
import AboutTeacher from "../../Components/TeacherDetails/AboutTeacher/AbourTeacher";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ErrorAlert, SuccessAlert } from "../../Components/Messages/messages";
import axios from "axios";
import { FaQuoteLeft, FaStar } from "react-icons/fa";
import moment from "moment";
import CalendarComp from "../../Components/CalendarComp/CalendarComp";
import Loading from "../../Components/Loading/Loading";
import { isAuthenticated } from "../../Components/Auth/auth";
import { MdVerified } from "react-icons/md";
import { Calendar, GraduationCap, Star, User } from "lucide-react";
import { BsFillSendArrowDownFill } from "react-icons/bs";

const TeacherDetails = () => {
  const location = useLocation();
  const router = useNavigate();
  const tutorId = location.pathname.split("tutor/")[1];
  const tabKey = location.state;
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

  const filterTutorAvailabilites = async (dt) => {
    console.log(dt);
    setScheduleLoading(true);
    const filteredTutors = await tutorObject?.availability?.filter(av => av?.date === dt);
    setAvailabilitesArray(filteredTutors);
    setScheduleLoading(false);
  };

  const handleSelectTime = (time) => {
    setSelectedDateAndTimes({ date, time });
  };


  const getTutorById = async () => {
    await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/user/${tutorId}`).then(res => {
      setLoading(false);
      if (res.status === 200) {
        setTutorObject(res.data);
        getAllTutors(res.data?._id);
        setActiveTab(tabKey);
        const filteredTutors = res.data?.availability?.filter(av => av?.date === moment().format("DD/MM/YYYY"));
        setAvailabilitesArray(filteredTutors);
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
      setDate(new Date());
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
          getTutorReservedClasses(date);
          setSelectedDateAndTimes();
          router("/student/upcoming-classes");
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
  }, [tutorId, tabKey]);

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
                {/* <p>15May,2014 . 1:30PM-3:30PM</p> */}
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
              {
                selectedDateAndTimes?.time &&
                <Button style={{ maxWidth: "200px" }} className="py-4" onClick={handleScheduleClasses}>Confirm Booking</Button>
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

  const totalRatings = tutorObject?.reviews?.reduce((acc, review) => acc + review?.rating, 0);
  const averageRating = parseFloat((totalRatings / tutorObject?.reviews?.length).toFixed(2));
  // const averageRating = tutorObject?.reviews?.reduce((acc, review) => acc + review?.rating, 0) / tutorObject?.reviews?.length;

  return (
    loading ?
      <Loading />
      :
      <div className="TeacherDetails">
        <div className="container">
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
                      <FaStar /> {averageRating || 0} ({tutorObject?.reviews?.length})
                    </div>
                  </div>
                  <div className="brief">
                    <p>
                      {tutorObject?.headline}
                    </p>
                  </div>
                  <div className="teacherItems">
                    <div className="lesson">
                      <GraduationCap />
                      <p>Teaches {tutorObject?.specialities?.map((sp, index) => <span key={index}>{sp}, </span>)}</p>
                    </div>
                    <div className="native d-flex align-items-center">
                      <FaQuoteLeft />
                      <p>
                        Speaks {tutorObject?.languages?.map((lng, index) => <span key={index}>{lng}, </span>)}
                      </p>
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
                    src={tutorObject?.videoLink ? tutorObject?.videoLink : "https://www.youtube.com/embed/E7wJTI-1dvQ"}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="reviewsLessons">
                  <div>
                    <p className="d-flex align-items-center justify-content-center gap-1">
                      <Star /><b>{averageRating || 0}</b>
                    </p>
                    <b>({tutorObject?.reviews?.length} reviews)</b>
                  </div>
                </div>
                <div className="buttons">
                  <button className="btn" onClick={handleScheduleClasses}>
                    <Calendar />
                    Schedule a class
                  </button>
                  <Link to={`/chats?receiver=${tutorId}`} className="btn">
                    <BsFillSendArrowDownFill />
                    Send message
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h2 className="my-5">Other Similar Tutors You may Like</h2>
            <Row gutter={[40, 40]} align="middle">
              {tutorsArray.map((tutor, index) => {
                return (
                  <Col key={index} xs={24} md={12} lg={8} xl={6} xxl={4}>
                    <TutorCard tutorProps={tutor} />
                  </Col>
                );
              })}
            </Row>
          </div>
        </div>
      </div>
  );
};

export default TeacherDetails;
