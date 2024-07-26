import React, { useEffect, useState } from "react";
import "./AllTutors.css";
import TutorCard from "../../Components/TutorCard/TutorCard";
import TutorSide from "../../Components/TutorSide/TutorSide";
import { Col, Row } from "antd";
import { ErrorAlert } from "../../Components/Messages/messages";
import axios from "axios";

const AllTutors = () => {
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [tutorsArray, setTutorsArray] = useState([]);
  const [availability, setAvailability] = useState("");
  const [specialities, setSpecialities] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [tutorName, setTutorName] = useState("");

  const getAllTutors = async () => {
    await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/tutors`, { availability, specialities, languages, showAll, fullName: tutorName }).then(res => {
      setLoading(false);
      if (res.status === 200) {
        setTutorsArray(res.data)
      } else {
        ErrorAlert(res.data.errorMessage);
      }
    }).catch(err => {
      setLoading(false);
      console.log(err)
      ErrorAlert(err?.message);
    })
  }

  useEffect(() => {
    getAllTutors();

    return () => {

    }
  }, [availability, specialities, languages, tutorName, showAll]);

  return (
    <div className="AllTutors">
      <div className="innerTutors container">
        <div className="header">
          <h1>Find tutors for 1-On-1 classes.</h1>
          {/* <h5>
            Find private tutors for lessons in over 350 subjects. Choose yoour
            tutor based on their location, subjects, the level they teach, and
            whether they offer classes in person or online.
          </h5> */}
        </div>
        <Row gutter={[40, 40]}>
          <Col xs={24} md={6}>
            <TutorSide
              handleLangChange={(val) => setLanguages(val)}
              handleSpChange={(val) => setSpecialities(val)}
              handleAvailChange={(val) => setAvailability(val)}
              handleTutorNameChange={(val) => setTutorName(val)}
            />
          </Col>
          <Col xs={24} md={18}>
            <Row gutter={[43, 43]}>
              {tutorsArray.map((tutor) => {
                return (
                  <Col xs={24} md={8} lg={6} xl={6} className="tutorComponent">
                    <TutorCard tutorProps={tutor} />
                  </Col>
                );
              })}
            </Row>
            {
              !showAll &&
              <div className="text-center mt-4">
                <button className="btn" onClick={() => setShowAll(true)}>Show All</button>
              </div>
            }
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AllTutors;
