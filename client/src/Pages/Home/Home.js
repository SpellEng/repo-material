import React, { lazy, Suspense, useState } from "react";
import "./Home.css";
import Header from "../../Components/Header/Header";
import { Col, Rate, Row } from "antd";
import { FaHeadphones, FaQuoteLeft, FaRocket, FaSearch } from "react-icons/fa";
import { GiTargetShot } from "react-icons/gi";
import RahulPic from "../../assets/RahulPic.webp";
import NeerajPic from "../../assets/NeerajPic.webp";
import AdityaPic from "../../assets/AdityaPic.webp";
import { Helmet } from "react-helmet";
import Digital from "../../Components/Digital/Digital";

const StepsCard = lazy(() => import("../../Components/StepsCard/StepsCard"));
const WhyChoose = lazy(() => import("../../Components/WhyChoose/WhyChoose"));
const Testimonial = lazy(() => import("../../Components/Testimonial/Testimonial"));

const Home = () => {
  const [selectedTestimonial, setSelectedTestimonial] = useState({
    photo: RahulPic,
    name: " Rahul Kumar",
    post: "Marketing Manager",
    rating: 4,
    description:
      "SpellEng empowered me to confidently speak English in meetings and deliver presentations by reducing my hesitation. Now, as a Marketing Manager, I excel in communication thanks to their personalized sessions.",
  });

  const cardArray = [
    {
      icon: <FaSearch />,
      heading: "Book a Trial Session",
      para: "Begin with a ₹99 trial session to experience SpellEng and receive personalized feedback.",
    },
    {
      icon: <GiTargetShot />,
      heading: " Choose Your Subscription Plan",
      para: "Choose a subscription plan tailored to your needs. We recommend 20 classes/month for 3  months at least.",
    },
    {
      icon: <FaRocket />,
      heading: " Practice Fluency and Build Conﬁdence",
      para: "Receive personalized guidance from our experienced tutors in 1-on-1 classes.",
    },
    {
      icon: <FaHeadphones />,
      heading: "Access Recordings and Review Progress",
      para: "Track your progress and areas for improvement by revisiting past sessions with recorded videos.",
    },
  ];


  const testimonialArray = [
    {
      photo: RahulPic,
      name: " Rahul Kumar",
      post: "Marketing Manager",
      rating: 4,
      description:
        "SpellEng empowered me to confidently speak English in meetings and deliver presentations by reducing my hesitation. Now, as a Marketing Manager, I excel in communication thanks to their personalized sessions.",
    },
    {
      photo: NeerajPic,
      name: " Neeraj Gupta ",
      post: "Civil Engineer",
      rating: 5,
      description:
        "Before SpellEng, I didn't know much English. But with their help, I learned from the beginning. My tutor was patient and taught me simple words and sentences. Now, I feel more confident when I speak English.",
    },
    {
      photo: AdityaPic,
      name: " Aditya Aggarwal ",
      post: "Law Student",
      rating: 4.5,
      description:
        "I used to employ very basic words and often mispronounced them. SpellEng significantly enhanced my vocabulary and pronunciation skills. I now express myself confidently in English. Thank you, SpellEng, for making learning enjoyable.",
    },
  ];

  return (
    <div className="mainHome">
      <Helmet>
        <meta charSet="utf-8" />
        <title>SpellEng: Expert English Tutors via 1-on-1 Video Calls</title>
        <meta name="description" content="SpellEng offers 1-on-1 video calls with expert English tutors to improve your spoken English. Enjoy flexible scheduling, personalized feedback, and a ₹99 trial." />
        <link rel="canonical" href="https://www.spelleng.com/" />
      </Helmet>
      <div>
        <Header />
      </div>
      <div>
        <Digital />
      </div>
      <div className="stepPart mt-5 container">
        <h2 className="mb-5 text-center">How SpellEng works in <span>4</span> easy steps</h2>
        <Row gutter={[40, 40]}>
          {cardArray.map((stepCard, index) => {
            return (
              <Col key={index} xs={24} md={12} lg={6} className="componentImport">
                <Suspense fallback={<div></div>}>
                  <StepsCard stepProps={stepCard} />
                </Suspense>
              </Col>
            );
          })}
        </Row>
      </div>
      <div className="testimonialPart my-5">
        <h2 className="mb-5 text-center">Our Testimonials</h2>
        <div className="container">
          <Row>
            <Col xs={24} md={12} className="rightTestimonail">
              <img src={selectedTestimonial?.photo} alt="" />
              <div className="mainHeading">
                <h2>
                  Success Stories with
                  <br /> SpellEng
                </h2>
                <p className="mt-3">
                  Real Voices, Real Results: Experience the power of personalized
                  English tutoring <br />
                  through the stories of our satisfied users.
                </p>
              </div>
            </Col>
            <Col xs={24} md={12} className="leftTestimonial">
              <button className="btn quoteTestimonial">
                <FaQuoteLeft />
              </button>
              <div className="mapTestimonial">
                <div>
                  <Rate disabled allowHalf value={selectedTestimonial?.rating} />
                </div>
                <h3 className="my-2 mt-3">"Transformed My SpellEng's Results"</h3>
                <p>{selectedTestimonial?.description}</p>
                <div className="testimonialArray">
                  {testimonialArray.map((testimonial, index) => {
                    return (
                      <button key={index} className="btn" onClick={() => setSelectedTestimonial(testimonial)}>
                        <Testimonial testimonialProps={testimonial} />
                      </button>
                    )
                  })}
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <div className="testimonialVideos">
          <div className="container">
            <Row gutter={[23, 23]}>
              <Col xs={24} md={12} lg={8} className="rightTestimonail">
                <iframe
                  width="560"
                  height="300"
                  src="https://www.youtube.com/embed/g32qUM-Gb7Q?si=PnJASqmLrzf-K8dU"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </Col>
              <Col xs={24} md={12} lg={8} className="rightTestimonail">
                <iframe
                  width="560"
                  height="300"
                  src="https://www.youtube.com/embed/9X5WdHbSrBA?si=8vSgjcnlQ9mVN5Dl"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </Col>
              <Col xs={24} md={12} lg={8} className="rightTestimonail">
                <iframe
                  width="560"
                  height="300"
                  src="https://www.youtube.com/embed/DlDNU7lMWYE?si=TOrVCKPEyZsVoT8v"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </Col>
            </Row>
          </div>
        </div>
      </div>
      <div>
        <Suspense fallback={<div></div>}>
          <WhyChoose />
        </Suspense>
      </div>
    </div>
  );
};

export default Home;
