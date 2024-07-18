import React from "react";
import "./StudentForm.css";
import profilepic from "../../assets/profile.svg";
import Link from "antd/es/typography/Link";
import { Input } from "antd";
const { TextArea } = Input;

const StudentForm = () => {
  return (
    <div className="studentForm">
      <form>
        <div className="row mb-3">
          <label for="inputEmail3" className="col-sm-2 col-form-label">
            Full Nmae
          </label>
          <div className="col-sm-10">
            <input type="text" className="form-control" id="inputname3" />
          </div>
        </div>
        <div className="row mb-3">
          <label for="inputEmail3" className="col-sm-2 col-form-label">
            Email
          </label>
          <div className="col-sm-10">
            <input type="email" className="form-control" id="inputEmail3" />
          </div>
        </div>
        <div className="row mb-3">
          <label for="inputCity3" className="col-sm-2 col-form-label">
            City
          </label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              id="inputCity3"
              placeholder="Enter Your City Here"
            />
          </div>
        </div>
        <div className="row mb-3">
          <label for="inputNumber3" className="col-sm-2 col-form-label">
            Mobile number
          </label>
          <div className="col-sm-10">
            <input
              type="number"
              className="form-control"
              id="inputnumber3"
              placeholder="Enter Your Mobile Number"
            />
          </div>
        </div>
        <div className="photo">
          <div className="row mb-3">
            <label for="inputPhoto3" className="col-sm-2 col-form-label">
              Profile Photo
            </label>
            <img src={profilepic} alt="" />
            <div className="col-sm-10">
              <input
                type="select"
                className="form-control"
                id="inputPhoto3"
                placeholder="No file chosen"
              />
              <button>Choose file</button>
            </div>
          </div>
        </div>
        <fieldset className="row mb-3">
          <legend className="col-form-label col-sm-2 pt-0">Level</legend>
          <div className="col-sm-10">
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="gridRadios"
                id="gridRadios1"
                value="option1"
                checked
              />
              <label className="form-check-label" for="gridRadios1">
                No proficiency
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="gridRadios"
                id="gridRadios2"
                value="option2"
              />
              <label className="form-check-label" for="gridRadios2">
                Low proficiency
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="gridRadios"
                id="gridRadios2"
                value="option2"
              />
              <label className="form-check-label" for="gridRadios2">
                Intermediate proficiency
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="gridRadios"
                id="gridRadios2"
                value="option2"
              />
              <label className="form-check-label" for="gridRadios2">
                Upper Intermediate proficiency
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="gridRadios"
                id="gridRadios2"
                value="option2"
              />
              <label className="form-check-label" for="gridRadios2">
                High proficiency
              </label>
            </div>
          </div>
        </fieldset>
        <div className="learningGoal row mb-3">
          <div className="heading col-sm-2">
            <h5>Learning Goals</h5>
          </div>
          <div className="learningLinks col-sm-10">
            <Link to="Grow your career">Grow your career</Link>
            <Link to="Thrive at university">Thrive at university</Link>
            <Link to="Prepare for a test">Prepare for a test</Link>
            <Link to="Just for fun">Just for fun</Link>
            <Link to="Travel abroad">Travel abroad</Link>
            <Link to="Something else...">Something else...</Link>
          </div>
        </div>
        <div className="textArea row mb-3">
          <div className="heading col-sm-2">
            <h5>Headline</h5>
          </div>
          <div className="text col-sm-10">
            <>
              <TextArea rows={4} placeholder="Working Professional" />
            </>
          </div>
          <div className="heading col-sm-2">
            <h5>Description</h5>
          </div>
          <div className="text col-sm-10">
            <>
              <TextArea
                rows={4}
                placeholder="Tell us something about yourself..."
              />
            </>
          </div>
        </div>

        <button type="submit" className="btn btn-primary">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default StudentForm;
