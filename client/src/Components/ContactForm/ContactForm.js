import React, { useState } from "react";
import "./ContactForm.css";
import { Button, Select } from "antd";
import { Input } from "antd";
import contactIcon from "../../assets/contact.svg";
import axios from "axios";
import { ErrorAlert, SuccessAlert } from "../Messages/messages";

const { TextArea } = Input;

const ContactForm = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    type: '',
    message: ''
  });

  const handleChange = (key, value) => {
    setFormData({
      ...formData,
      [key]: value
    });
  }

  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    axios.put(`${process.env.REACT_APP_BACKEND_URL}/users/send-contact-email`, formData, {
      headers: {
        authorization: 'Bearer ' + localStorage.getItem('token')
      }
    }).then(res => {
      setLoading(false);
      if (res.status === 200) {
        SuccessAlert(res.data.successMessage);
      }
      else {
        ErrorAlert(res.data.errorMessage);
      }
    }).catch(err => {
      setLoading(false);
      console.log(err)
      ErrorAlert(err?.message);
    })
  }

  return (
    <div className="ContactForm">
      <form onSubmit={submitHandler} className="row">
        <div className="leftForm col-6">
          <label for="inputEmail4" class="form-label">
            Your Name *
          </label>
          <Input
            type="text"
            required
            id="textl4"
            placeholder="Full name"
            onChange={(e) => handleChange("fullName", e.target.value)}
          />
          <label for="inputEmail4" class="form-label">
            Phone Number *
          </label>
          <Input
            required
            type="text"
            id="textl4"
            placeholder="(xxx)xx xxx"
            onChange={(e) => handleChange("phoneNumber", e.target.value)}
          />
        </div>
        <div className="rightForm col-6">
          <div>
            <label for="inputemail4" class="form-label">
              Email address *
            </label>
            <Input
              required
              type="email"
              id="inputPassword4"
              placeholder="name@example.com"
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>
          <div className="mt-4">
            <label>Are You? *</label>
            <Select
              required
              className="w-100"
              defaultValue="student"
              onChange={(value) => handleChange("type", value)}
              options={[
                {
                  value: 'student',
                  label: 'Student',
                },
                {
                  value: 'tutor',
                  label: 'Tutor',
                }
              ]}
            />
          </div>
        </div>
        <div className="textareaPart col-12">
          <label for="inputPassword4" class="form-label">
            Message *
          </label>
          <div>
            <TextArea
              required
              rows={5}
              placeholder="Write your message here..."
              onChange={(e) => handleChange("message", e.target.value)}
            />
          </div>
        </div>
        <div className="formbtn mt-4">
          <Button loading={loading} disabled={loading} className="py-2 h-auto" htmlType="submit">Send a message</Button>
        </div>
      </form>
      <img className="arrowImage" src={contactIcon} />
    </div>
  );
};

export default ContactForm;
