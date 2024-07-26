import { Avatar, Select, Button, Input } from "antd";
import React, { useEffect, useState } from "react";
import "./TutorProfile.css";
import { FaRegUser } from "react-icons/fa";
import DragUpload from "../../../Components/DragUpload/DragUpload";
import TextArea from "antd/es/input/TextArea";
import { isAuthenticated } from "../../../Components/Auth/auth";
import axios from "axios";
import { ErrorAlert, SuccessAlert } from "../../../Components/Messages/messages";
import { getUserTimezone } from "../../../Components/UserTimeZone";

const TutorProfile = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    headline: "",
    email: '',
    address: '',
    city: '',
    state: '',
    phoneNumber: '',
    picture: {}, // Assuming profile photo is handled separately
    experience: '',
    education: '',
    specialities: [],
    languages: [],
    description: "",
    videoLink: ""
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


  useEffect(() => {
    if (isAuthenticated()) {
      setFormData(isAuthenticated());
    }

    return () => {

    }
  }, []);


  return (
    <div className="TutorProfile">
      <form onSubmit={handleSubmit} className="container">
        <div className="row mb-3">
          <label htmlFor="inputName" className="col-sm-2 col-form-label">Full Name</label>
          <div className="col-sm-10">
            <Input
              type="text"
              id="inputName"
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
              id="inputEmail"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputAddress" className="col-sm-2 col-form-label">Address</label>
          <div className="col-sm-10">
            <Input
              type="text"
              id="inputAddress"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Enter Your Address Here"
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputCity" className="col-sm-2 col-form-label">City</label>
          <div className="col-sm-10">
            <Input
              type="text"
              id="inputCity"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="Enter Your City Here"
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputState" className="col-sm-2 col-form-label">State</label>
          <div className="col-sm-10">
            <Input
              type="text"
              id="inputState"
              value={formData.state}
              onChange={(e) => handleChange('state', e.target.value)}
              placeholder="Enter Your State Here"
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputMobile" className="col-sm-2 col-form-label">Mobile Number</label>
          <div className="col-sm-10">
            <Input
              type="text"
              id="inputMobile"
              value={formData.phoneNumber}
              onChange={(e) => handleChange('phoneNumber', e.target.value)}
              placeholder="Enter Your Number Here"
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputPicture" className="col-sm-2 col-form-label d-flex align-items-center gap-3">
            Profile Photo
            <Avatar size="large" icon={<FaRegUser />} />
          </label>
          <div className="col-sm-10">
            <DragUpload accept="image/*" noMultiple value={[formData?.picture]} updateFiles={(val) => handleChange('picture', val[0])} />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputExperience" className="col-sm-2 col-form-label">Experience</label>
          <div className="col-sm-10">
            <Input
              type="text"
              id="inputExperience"
              value={formData.experience}
              onChange={(e) => handleChange('experience', e.target.value)}
              placeholder="Enter Your Experience Here"
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputEducation" className="col-sm-2 col-form-label">Education</label>
          <div className="col-sm-10">
            <Input
              type="text"
              id="inputEducation"
              value={formData.education}
              onChange={(e) => handleChange('education', e.target.value)}
              placeholder="Enter Your Education Here"
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputSpecialities" className="col-sm-2 col-form-label">Specialities</label>
          <div className="col-sm-10">
            <Select
              allowClear
              showSearch
              value={formData.specialities}
              placeholder="Specialities"
              style={{ width: "100%" }}
              mode="tags"
              onChange={(value) => handleChange('specialities', value)}
              options={[
                { value: "conversational english", label: "Conversational English" },
                { value: "business english", label: "Business English" },
                { value: "english for beginners", label: "English for beginners" },
                { value: "ielts", label: "IELTS" },
                { value: "english for kids", label: "English for kids" },
              ]}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputAlsoSpeaks" className="col-sm-2 col-form-label">Also Speaks</label>
          <div className="col-sm-10">
            <Select
              allowClear
              showSearch
              value={formData.languages}
              placeholder="Also Speaks"
              style={{
                width: "100%",
              }}
              mode="tags"
              onChange={(value) => handleChange('languages', value)}
              options={[
                {
                  value: "hindi",
                  label: "Hindi",
                },
                {
                  value: "tamil",
                  label: "Tamil",
                },
                {
                  value: "telugu",
                  label: "Telugu",
                },
                {
                  value: "kannada",
                  label: "Kannada",
                }
              ]}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputSpecialities" className="col-sm-2 col-form-label">Description</label>
          <div className="col-sm-10 mb-4">
            <TextArea showCount maxLength={200} value={formData?.description} required onChange={(e) => handleChange('description', e.target.value)} />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputVideo" className="col-sm-2 col-form-label">Video Embed Url</label>
          <div className="col-sm-10">
            <Input value={formData?.videoLink} required onChange={(e) => handleChange('videoLink', e.target.value)} />
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

export default TutorProfile;
