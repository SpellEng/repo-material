import React from "react";
import "./TutorSide.css";
import { Input, Select } from "antd";

const { Search } = Input;

const TutorSide = ({ handleSpChange, handleAvailChange, handleTutorNameChange, handleLangChange }) => {

  return (
    <div className="tutorSide">
      <div className="inner">
        <div className="specialities">
          <Select
            allowClear
            showSearch
            placeholder="Specialities"
            style={{
              width: "100%",
            }}
            mode="tags"
            onChange={handleSpChange}
            options={[
              {
                value: "conversational english",
                label: "Conversational English",
              },
              {
                value: "busniess english",
                label: "Busniess English",
              },
              {
                value: "english for beginners",
                label: "English for beginners",
              },
              {
                value: "ielts",
                label: "IELTS",
              },
              {
                value: "english for kids",
                label: "English for kids",
              },
            ]}
          />
        </div>
        <div className="availability">
          <Select
            placeholder="Availability"
            allowClear
            style={{
              width: "100%",
            }}
            onChange={handleAvailChange}
            options={[
              {
                value: "8:00am - 8:30am",
                label: "8:00am - 8:30am",
              },
              {
                value: "8:40am - 9:10am",
                label: "8:40am - 9:10am",
              },
              {
                value: "9:20am - 9:50am",
                label: "9:20am - 9:50am",
              },
              {
                value: "10:00am - 10:30am",
                label: "10:00am - 10:30am",
              },
              {
                value: "10:40am - 11:00am",
                label: "10:40am - 11:00am",
              },
            ]}
          />
        </div>
        <div className="tutorCategories">
          <Search
            className="w-100"
            placeholder="Enter Tutor Name to Search"
            allowClear
            size="large"
            onSearch={(val) => handleTutorNameChange(val)}
            enterButton="Search"
          />
        </div>
        <div className="specialities">
          <Select
            allowClear
            showSearch
            placeholder="Also Speaks"
            style={{
              width: "100%",
            }}
            mode="tags"
            onChange={handleLangChange}
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
    </div>
  );
};

export default TutorSide;
