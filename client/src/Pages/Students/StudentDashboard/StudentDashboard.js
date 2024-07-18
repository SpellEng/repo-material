import React from "react";
import "./StudentDashboard.css";
import profile from "../../../assets/profile.svg";
import { Col, Row, Tabs } from "antd";
import { GiCheckMark } from "react-icons/gi";
import SessionCard from "../../../Components/SessionsCard/SessionsCard";


const StudentDashboard = () => {

  const items = [
    {
      key: '1',
      label: 'Upcoming Sessions',
      children: <SessionCard
        tutor="Aarti Agnihotri"
        date="12 May 2024"
        time="05:00 PM - 05:15 PM"
        isUpcoming={true}
      />,
    },
    {
      key: '2',
      label: 'Previous Sessions',
      children: <SessionCard
        tutor="Aarti Agnihotri"
        date="12 May 2024"
        time="05:00 PM - 05:15 PM"
        isUpcoming={true}
      />,
    },
  ];



  return (
      <div className="StudentDashboard">
        <Row gutter={[23, 23]} className="p-3">
          <Col xs={23} md={6}>
            <section className="firstPart">
              <img src={profile} alt="" />
              <h3>
                Welcome ack,<br />Parvej Khan!
              </h3>
              <h2>Statistics</h2>
              <div className="stats">
                <div>
                  <small>
                    lessons
                  </small>
                  <h5>17</h5>
                </div>
                <div>
                  <small>
                    Minutes with tutors
                  </small>
                  <h5>455</h5>
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
                You have 1 month in which get 1 on 1 class with tutors and
                <span> Your Plan Expire on 27 June</span>
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
              <iframe
                width="560"
                height="230"
                src="https://www.youtube.com/embed/E7wJTI-1dvQ"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </section>
          </Col>
        </Row>
        <div>
          <Tabs defaultActiveKey="1" items={items} />
        </div>
      </div>
  );
};

export default StudentDashboard;