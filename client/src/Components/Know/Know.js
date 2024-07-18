import React from "react";
import "./Know.css";

const Know = ({ knowProps }) => {
  return (
    <div className="Know">
      <div className="row">
        <div className="leftKnow col-md-6">
          <h3>{knowProps?.heading}</h3>
          <p>{knowProps.para}</p>
        </div>
        <div className="rightKnow col-md-6">
          <h3>Know About SpellEng</h3>
          <h4>Our Story</h4>
          <p>
            SpellEng was founded with a clear vision: to bridge the gap between
            learners and English fluency. As founders, we enrolled in an
            institute with over 50 students and had to travel 30 minutes to get
            there. Despite our efforts, we did not receive the teacher's
            attention we needed. Recognizing the challenges we faced in learning
            English, we created a platform that connects students with skilled
            tutors for personalized, one-on-one video sessions, accessible
            anytime from the comfort of their homes.
          </p>
          <h4>Our Mission</h4>
          <p>
            At SpellEng, our mission is to empower learners by providing
            exceptional English tutoring that fosters confidence and
            proficiency. We strive to create an environment where students can
            thrive, improving their language skills to succeed in their personal
            and professional lives.
          </p>
          <h4>What We Do</h4>
          <p>
            SpellEng offers a seamless platform where English learners can find
            and book sessions with experienced tutors. Our system automates
            scheduling and meetings, ensuring a hassle-free experience for both
            tutors and students. With a subscription model that is both
            affordable and valuable, we make top-tier English education
            accessible to all.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Know;
