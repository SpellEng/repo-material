import React from "react";
import "./Faqs.css";
import { Col, Collapse, Row } from "antd";
import { EditOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import FaqIcon from "../../assets/FaqIcon";


const Faqs = () => {
  const router = useNavigate();

  const items = [
    {
      key: "1",
      label: "What is SpellEng?",
      children: (
        <p>
          SpellEng is an online platform that connects students with experienced
          English tutors for personalized, one-on-one video sessions.
        </p>
      ),
    },
    {
      key: "2",
      label: "How do I get started with SpellEng?",
      children: (
        <p>
          To get started, simply sign up for a trial class @₹1, choose your
          tutor, and schedule your first session.
          <br />
          Registration and Account:
        </p>
      ),
    },
    {
      key: "3",
      label: "How do I create an account on SpellEng?",
      children: (
        <p>
          Visit our website, click on the 'Take First Class @ ₹1' button, and follow the
          prompts to create your account. You will need to provide some basic
          information and set up a payment method.
        </p>
      ),
    },
    {
      key: "4",
      label: "Is there a registration fee?",
      children: (
        <p>

          No, there is no registration fee. You only pay for trial class and
          then monthly subscription fee.
          <br />
          Trial and Subscription
        </p>
      ),
    },
    {
      key: "5",
      label: "Does SpellEng offer a free trial?",
      children: (
        <p>
          No, we don't offer a free trial session. But we offer a trial class at
          a minimal fee of ₹1, so you can experience our tutoring services
          before committing to a subscription.
        </p>
      ),
    },
    {
      key: "6",
      label: "What is the cost of a subscription?",
      children: (
        <p>

          The subscription fee starts ₹3,000 per month (if bought quarterly),
          which includes personalized tutoring sessions and access to our
          platform.
        </p>
      ),
    },
    {
      key: "7",
      label: "Is there a discount for long-term subscriptions?",
      children: (
        <p>

          Yes, we offer discounts for long-term commitments. Contact our support
          team for more details . <br />
          Tutors and Sessions
        </p>
      ),
    },
    {
      key: "8",
      label: "How do I choose a tutor?",
      children: (
        <p>

          You can browse tutor profiles, read reviews, and select a tutor who
          matches your learning style and needs. If you're a beginner, we
          recommend learning from one tutor only.
        </p>
      ),
    },
    {
      key: "9",
      label: "Can I switch tutors if I'm not satisfied?",
      children: (
        <p>
          Yes, you can switch tutors at any time if you feel another tutor might
          better meet your needs.
        </p>
      ),
    },
    {
      key: "10",
      label: "How long is each tutoring session?",
      children: <p> Each session lasts for 30 minutes. </p>,
    },
    {
      key: "11",
      label: "How do I schedule a session? ",
      children: (
        <p>
          Log into your account, go to the all tutors page, choose your tutor,
          and select an available time slot that suits you.
        </p>
      ),
    },
    {
      key: "12",
      label: "Can I book multiple sessions at once?",
      children: (
        <p>
          Yes, you can switch tutors at any time if you feel another tutor might
          better meet your needs.
        </p>
      ),
    },
    {
      key: "13",
      label: "How are the tutors selected",
      children: (
        <p>
          Our tutors are carefully selected based on their qualifications,
          experience, and ability to provide high-quality English instruction.
        </p>
      ),
    },
    {
      key: "14",
      label: "Can I get a tutor who speaks my native language?",
      children: (
        <p>
          While our focus is on English immersion, we may have tutors who speak
          your native language. Check tutor profiles for language skills.
          <br />
          Rescheduling and Cancellation
        </p>
      ),
    },
    {
      key: "15",
      label: "What if I need to reschedule a session?",
      children: (
        <p>
          You can reschedule a session through your account dashboard. Please
          try to reschedule at least 12 hours in advance to avoid any penalties.
        </p>
      ),
    },
    {
      key: "15",
      label: "Can I book multiple sessions at once?",
      children: (
        <p>
          Yes, you can schedule multiple sessions in advance to secure your preferred time slots. But remember, you can take only one session everyday.
        </p>
      ),
    },
    {
      key: "16",
      label: "Can I cancel a session?",
      children: (
        <p>
          Yes, you can cancel a session through your account. Make sure to cancel at least 12 hours before the session to avoid any charges.
        </p>
      ),
    },
    {
      key: "17",
      label: "Will I get a refund if I cancel a session?",
      children: (
        <p>
          If you cancel a session at least 12 hours in advance, you will not be
          charged for that session, and it can be rescheduled.
          <br />
          Technical Issues:
        </p>
      ),
    },
    {
      key: "18",
      label:
        "What do I do if I experience technical issues during a session? ",
      children: (
        <p>
          Contact our support team immediately through the platform. We will
          help resolve the issue as quickly as possible.
        </p>
      ),
    },
    {
      key: "19",
      label: "What equipment do I need for the sessions?",
      children: (
        <p>
          You need a computer or mobile device with a stable internet
          connection, a webcam, and a microphone.
          <br />
          Payments and Renewals:
        </p>
      ),
    },
    {
      key: "20",
      label: "How do I pay for my subscription?",
      children: (
        <p>
          You can pay using a credit/debit card or through other available
          payment methods like QR, UPI, PhonePe, GooglePay, etc. on our
          platform.
        </p>
      ),
    },
    {
      key: "21",
      label: "Will my subscription automatically renew?",
      children: (
        <p>
          Yes, your subscription will automatically renew each month unless you
          cancel it before the renewal date.
          <br />
          Learning Experience:
        </p>
      ),
    },
    {
      key: "22",
      label: "What topics can I cover in my sessions?",
      children: (
        <p>

          You can cover a wide range of topics, including grammar, vocabulary,
          pronunciation, speaking, listening, reading, and writing skills.
        </p>
      ),
    },
    {
      key: "23",
      label: "Can I focus on specific exam preparation (IELTS, TOEFL, etc.)?",
      children: (
        <p>
          Yes, you can request sessions tailored to specific exams like IELTS,
          TOEFL, and more.
        </p>
      ),
    },
    {
      key: "24",
      label: "Are the sessions personalized?",
      children: (
        <p>

          Yes, each session is tailored to your individual needs and learning
          goals.
        </p>
      ),
    },
    {
      key: "25",
      label: "Can I provide feedback on my sessions? ",
      children: (
        <p>
          Yes, after each session, you can rate your tutor and provide feedback
          to help us improve our services.
          <br />
          Additinal Features:
        </p>
      ),
    },
    {
      key: "27",
      label: " Does SpellEng offer group sessions? ",
      children: (
        <p>
          Currently, we focus on one-on-one sessions to provide personalized
          attention. Group sessions may be offered in the future.
        </p>
      ),
    },
    {
      key: "28",
      label: " Can I access learning materials on SpellEng?",
      children: (
        <p>
          Yes, tutors may provide additional learning materials and resources to
          help you improve your English skills.
          <br />
          Security and Privacy:
        </p>
      ),
    },
    {
      key: "29",
      label: " Is my personal information safe on SpellEng? ",
      children: (
        <p>
          Yes, we use advanced security measures to protect your personal
          information and ensure your privacy.
        </p>
      ),
    },
    {
      key: "31",
      label: "How do I update my account information?",
      children: (
        <p>
          You can update your account information by logging into your account
          and going to the 'Profile' section.
          <br />
          Support:
        </p>
      ),
    },
    {
      key: "32",
      label: "How can I contact SpellEng support? ",
      children: (
        <p>
          You can reach us through email, phone, or WhatsApp. Visit our "Contact
          Us" page for more details.
        </p>
      ),
    },
    {
      key: "33",
      label: "What if I have a complaint about a tutor? ",
      children: (
        <p>
          If you have any issues with a tutor, please contact our support team,
          and we will address your concerns promptly.
          <br />
          Miscellaneous:
        </p>
      ),
    },

    {
      key: "34",
      label: "Can I refer a friend to SpellEng?",
      children: (
        <p>
          Yes, we encourage you to refer friends. Contact our support team to
          learn about any referral programs we may have.
        </p>
      ),
    },
    {
      key: "35",
      label: "How do I get refund?",
      children: (
        <p>
          No, we don't offer refund as we have to compensate our tutors. That's
          why, we offer a trial class at a minimal rate to make sure you buy the
          right thing.
        </p>
      ),
    },
    {
      key: "37",
      label: "Can I record my sessions for future reference?",
      children: (
        <p>
          Recording sessions is supported directly on the platform. It is
          available for 30 days. However, you can download them from your
          dashboard.
        </p>
      ),
    },
    {
      key: "38",
      label: "Do you offer certifications upon completion?",
      children: (
        <p>
          We currently do not offer formal certifications, but you can request a
          progress report from your tutor.
        </p>
      ),
    },
    {
      key: "39",
      label: "What if I need help outside of tutoring sessions?",
      children: (
        <p>
          You can use our platform's messaging feature to ask your tutor
          questions or seek clarification on lessons.
        </p>
      ),
    },
  ];
  return (
    <div className="faqs">
      <div className="container">
        <Row className="upperSection">
          <Col xs={24} md={12}>
            <h1>Frequently Asked Questions</h1>
          </Col>
          <Col xs={24} md={12}>
            <FaqIcon />
          </Col>
        </Row>
        <div className="faqsPart">
          <Collapse bordered={false} accordion items={items} />
        </div>
        <div className="stilQuestions">
          <Avatar.Group>
            <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
            <Avatar
              style={{
                backgroundColor: "#f56a00",
              }}
            >
              K
            </Avatar>
            <Tooltip title="SpellEng User" placement="top">
              <Avatar
                style={{
                  backgroundColor: "#87d068",
                }}
                icon={<UserOutlined />}
              />
            </Tooltip>
            <Avatar
              style={{
                backgroundColor: "#1677ff",
              }}
              icon={<EditOutlined />}
            />
          </Avatar.Group>
          <h2>Still have a question?</h2>
          <p>
            We're here to help! Whether it's about our services, scheduling, or
            anything else, just let us know.
            <br /> Our team is ready to assist you in any way we can.
          </p>
          <div className="faqsbtn mt-4">
            <button onClick={() => router("/contact-us")}>Contact us</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faqs;
