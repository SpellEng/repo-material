import { Avatar, Select, Button, Input, Space, Radio } from "antd";
import React, { useEffect, useState } from "react";
import "./StudentProfile.css";
import { FaGlobe, FaGraduationCap, FaRegUser } from "react-icons/fa";
import DragUpload from "../../../Components/DragUpload/DragUpload";
import TextArea from "antd/es/input/TextArea";
import { MdOutlineCastForEducation } from "react-icons/md";
import { FaPencil } from "react-icons/fa6";
import { TbConfetti } from "react-icons/tb";
import { ErrorAlert, SuccessAlert } from "../../../Components/Messages/messages";
import axios from "axios";
import { isAuthenticated } from "../../../Components/Auth/auth";
import { getUserTimezone } from "../../../Components/UserTimeZone";

const StudentProfile = () => {
  const [loading, setLoading] = useState(false);
  const [learningGoals, setLearningGoals] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    city: '',
    phoneNumber: '',
    picture: {},
    proficiency: '',
    headline: "",
    description: "",
    proficiency: "No Proficiency"
  });

  const handleChange = (key, value) => {
    setFormData({
      ...formData,
      [key]: value
    });
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      formData.learningGoals = learningGoals;
      formData.timezone = getUserTimezone();
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/users/update-profile`, formData, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      }).then(res => {
        setLoading(false);
        if (res.status === 200) {
          SuccessAlert(res.data.successMessage);
          localStorage.setItem("user", JSON.stringify(res.data?.user))
        } else {
          ErrorAlert(res.data.errorMessage);
        }
      }).catch(err => {
        setLoading(false);
        console.log(err)
        ErrorAlert(err?.message);
      })
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  }

  // Static array of button texts
  const learningGoalsArray = [
    { icon: <MdOutlineCastForEducation />, text: 'Grow your career' },
    { icon: <FaGraduationCap />, text: 'Thrive at University' },
    { icon: <FaPencil />, text: 'prepare for a test' },
    { icon: <TbConfetti />, text: 'Just for fun' },
    { icon: <FaGlobe />, text: 'Travel abroad' },
    { text: 'Something else...' }
  ];

  const handleButtonClick = (buttonId) => {
    // Check if button is already selected
    const isSelected = learningGoals?.includes(buttonId);

    // Toggle selection
    if (isSelected) {
      setLearningGoals(learningGoals.filter(id => id !== buttonId));
    } else {
      setLearningGoals([...learningGoals, buttonId]);
    }
  };

  useEffect(() => {
    if (isAuthenticated()) {
      setFormData(isAuthenticated());
      if (isAuthenticated()?.learningGoals) {
        setLearningGoals(isAuthenticated()?.learningGoals)
      }
    }

    return () => {

    }
  }, []);

  console.log(getUserTimezone())


  return (
    <div className="StudentProfile">
      <form onSubmit={handleSubmit} className="container">
        <div className="row mb-3">
          <label htmlFor="inputName" className="col-sm-2 col-form-label">Full Name</label>
          <div className="col-sm-10">
            <Input
              required
              type="text"
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputEmail" className="col-sm-2 col-form-label">Email</label>
          <div className="col-sm-10">
            <Input
              type="text"
              required
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputCity" className="col-sm-2 col-form-label">City</label>
          <div className="col-sm-10">
            <Input
              type="text"
              required
              id="inputCity"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="Enter Your City Here"
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputMobile" className="col-sm-2 col-form-label">Mobile Number</label>
          <div className="col-sm-10">
            <Input
              type="text"
              required
              id="inputMobile"
              value={formData.phoneNumber}
              onChange={(e) => handleChange('phoneNumber', e.target.value)}
              placeholder="Enter Your Number Here"
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputPictupicture" className="col-sm-2 col-form-label d-flex align-items-center gap-3">
            Profile Photo
            <Avatar size="large" icon={<FaRegUser />} />
          </label>
          <div className="col-sm-10">
            <DragUpload accept="image/*" noMultiple value={[formData?.picture]} updateFiles={(val) => handleChange('picture', val[0])} />
          </div>
        </div>
        <div className="row my-4">
          <label htmlFor="inputSpecialities" className="col-sm-2 col-form-label">Proficiency</label>
          <div className="col-sm-10">
            <Radio.Group onChange={(e) => handleChange('proficiency', e.target.value)} value={formData?.proficiency}>
              <Space direction="vertical">
                <Radio value="No Proficiency">No Proficiency</Radio>
                <Radio value="Low Proficiency">Low Proficiency</Radio>
                <Radio value="Intermediate Proficiency">Intermediate Proficiency</Radio>
                <Radio value="Upper Intermediate Proficiency">Upper Intermediate Proficiency</Radio>
                <Radio value="High Proficiency">High Proficiency</Radio>
              </Space>
            </Radio.Group>
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputSpecialities" className="col-sm-2 col-form-label">Learning Goals</label>
          <div className="col-sm-10">
            <div className="learningGoalsBtns">
              {learningGoalsArray.map((button, key) => (
                <button
                  type="button"
                  key={key}
                  className={learningGoals?.includes(button?.text) ? 'selectedButton btn' : 'button btn'}
                  onClick={() => handleButtonClick(button?.text)}
                >
                  <span>
                    {button.icon}
                  </span>
                  <span>
                    {button.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputHeadline" className="col-sm-2 col-form-label">Headline</label>
          <div className="col-sm-10 mb-4">
            <TextArea showCount maxLength={200} value={formData?.headline} required onChange={(e) => handleChange('headline', e.target.value)} />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputSpecialities" className="col-sm-2 col-form-label">Description</label>
          <div className="col-sm-10 mb-4">
            <TextArea showCount maxLength={500} value={formData?.description} required onChange={(e) => handleChange('description', e.target.value)} />
          </div>
        </div>
        <div className="row mb-3 mt-5">
          <div className="col-sm-10 offset-sm-2">
            <Button type="primary" className="w-100 h-auto py-2" loading={loading} htmlType="submit">
              Submit
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default StudentProfile;
