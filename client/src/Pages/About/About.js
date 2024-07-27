import React, { lazy, Suspense } from "react";
import "./About.css";
import { Col, Divider, Rate, Row } from "antd";
import { FaLocationDot } from "react-icons/fa6";
import { IoMdMailOpen } from "react-icons/io";
import { SiKnowledgebase } from "react-icons/si";
import { BsUniversalAccessCircle } from "react-icons/bs";
import { GiPowerLightning, GiTreeGrowth } from "react-icons/gi";
import { Helmet } from "react-helmet";

const AboutTestimonials = lazy(() => import("../../Components/AboutTestimonials/AboutTestimonials"));
const AboutFaqs = lazy(() => import("../../Components/AboutFaqs/AboutFaqs"));

const About = () => {
  return (
    <div className="aboutus">
      <Helmet>
        <title>About SpellEng - Your Online English Learning Platform</title>
        <meta name="description" content="Learn about SpellEng and our mission to connect you with expert English tutors for personalized 1-on-1 video lessons, enhancing your spoken English skills." />
        <link rel="canonical" href="https://www.spelleng.com/about-us" />
      </Helmet>
      <div className="container">
        <Row gutter={{ xs: 40, md: 80 }}>
          <Col xs={24} md={12} className="leftAbout">
            <h1>
              Discover the Story Behind <span>SpellEng</span>
            </h1>
            <p>
              Experience How SpellEng Connects Learners to Success. Discover our
              journey to see how we make language learning accessible and
              effective for all.
            </p>
            <div className="ratingPart">
              <Rate allowHalf disabled value={4.5} />
            </div>
            <div className="commentPart">
              <p>
                "Our platform empowers learners to master English fluency,
                regardless of their background. There's nothing better than
                educating others and helping them grow in their lives. Join us on
                this transformative journey."
              </p>
              <h5>
                Parvej Khan<span>CEO of SpellEng</span>
              </h5>
            </div>
            <div className="infoPart">
              <Row gutter={[23, 23]}>
                <Col xs={12} md={12} className="infoItem">
                  <Divider />
                  <FaLocationDot />
                  <p>
                    Near BDI Ananda, Jhiwana Road, Tapukara, Rajasthan, 301707
                  </p>
                </Col>
                <Col xs={12} md={12} className="infoItem">
                  <Divider />
                  <IoMdMailOpen />
                  <p>Team@Spelleng.com</p>
                </Col>
              </Row>
            </div>
          </Col>
          <Col xs={24} md={12} className="rightAbout">
            <iframe width="560" height="300" src="https://www.youtube.com/embed/H9uSOlEnZhc?si=thGcy7J81ZtnQulq" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
          </Col>
        </Row>
        <div className="knowAbout">
          <Row gutter={{ xs: 20, md: 40 }}>
            <Col xs={24} md={12} className="cardRender d-md-flex gap-4">
              <Row dir="vertical" gutter={{ xs: 20, md: 40 }} className="VerticalRow mt-5">
                <Col xs={24} md={24}>
                  <div className="items">
                    <SiKnowledgebase />
                    <h5>Quality Education</h5>
                    <p>
                      We believe in delivering the highest quality of tutoring to
                      ensure our students achieve their goals
                    </p>
                  </div>
                </Col>
                <Col xs={24} md={24}>
                  <div className="items">
                    <BsUniversalAccessCircle />
                    <h5>Accessibility</h5>
                    <p>
                      Education should be within reach for everyone, which is why we
                      offer a user-friendly platform and affordable pricing.
                    </p>
                  </div>
                </Col>
              </Row>
              <Row gutter={{ xs: 20, md: 40 }} className="VerticalRow">
                <Col xs={24} md={24}>
                  <div className="items">
                    <GiPowerLightning />
                    <h5>Empowerment</h5>
                    <p>
                      We aim to empower our students, giving them the confidence to
                      communicate effectively in English.
                    </p>
                  </div>
                </Col>
                <Col xs={24} md={24}>
                  <div className="items">
                    <GiTreeGrowth />
                    <h5>Growth</h5>
                    <p>
                      Continuous improvement is at the heart of what we do, for both
                      our students and our platform.
                    </p>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col xs={24} md={12} className="infoScetion ">
              <h2>Know About SpellEng</h2>
              <h4>Our Story</h4>
              <p>
                SpellEng was founded with a clear vision: to bridge the gap
                between learners and English fluency. As founders, we enrolled in
                an institute with over 50 students and had to travel 30 minutes to
                get there. Despite our efforts, we did not receive the teacher's
                attention we needed. Recognizing the challenges we faced in
                learning English, we created a platform that connects students
                with skilled tutors for personalized, one-on-one video sessions,
                accessible anytime from the comfort of their homes.
              </p>
              <h4>Our Mission</h4>
              <p>
                At SpellEng, our mission is to empower learners by providing
                exceptional English tutoring that fosters confidence and
                proficiency. We strive to create an environment where students can
                thrive, improving their language skills to succeed in their
                personal and professional lives.
              </p>
              <h4>What We Do</h4>
              <p>
                SpellEng offers a seamless platform where English learners can
                find and book sessions with experienced tutors. Our system
                automates scheduling and meetings, ensuring a hassle-free
                experience for both tutors and students. With a subscription model
                that is both affordable and valuable, we make top-tier English
                education accessible to all.
              </p>
            </Col>
          </Row>
        </div>
      </div>
      <div className="noPadding">
        <Suspense fallback={<div></div>}>
          <AboutTestimonials />
        </Suspense>
      </div>
      <div className="faqsPart container">
        <Suspense fallback={<div></div>}>
          <AboutFaqs />
        </Suspense>
      </div>
    </div>
  );
};

export default About;
