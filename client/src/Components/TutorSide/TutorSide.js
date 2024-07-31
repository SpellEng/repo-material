import React from "react";
import "./TutorSide.css";
import { Input, Select } from "antd";
import { staticAvailabilitesArray } from "../../Pages/Tutors/Availability/availabilitesArray";

const { Search } = Input;

const TutorSide = ({ handleSpChange, handleAvailChange, handleTutorNameChange, handleLangChange }) => {

  const trimmedAvailabilitesArray = staticAvailabilitesArray?.map(av => ({ value: av, label: av }));

  return (
    <div className="tutorSide">
      <div className="inner">
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
                value: "business english",
                label: "Business English",
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
            options={trimmedAvailabilitesArray}
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
