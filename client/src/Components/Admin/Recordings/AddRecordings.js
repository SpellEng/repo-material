import React, { useState } from "react";
import axios from "axios";
import Modal from "antd/lib/modal/Modal";
import { Button, Input } from "antd";
import { ErrorAlert, SuccessAlert } from "../../Messages/messages";

export const AddRecordings = ({ id, updateFunction }) => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [recording, setRecording] = useState("");


  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  /************************************************ Submit **********************************************/
  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    axios.put(`${process.env.REACT_APP_BACKEND_URL}/users/save-recording/${id}`, { recording }, {
      headers: {
        authorization: "Bearer " + localStorage.getItem("token")
      }
    }).then((res) => {
      setLoading(false);
      if (res.statusText === "OK") {
        SuccessAlert(res.data.successMessage);
        updateFunction();
        handleCancel();
      } else {
        ErrorAlert(res.data.errorMessage)
      }
    }).catch(err => {
      setLoading(false);
      console.log(err)
      ErrorAlert(err?.message);
    })
  };

  return (
    <div>
      <Button type="primary" onClick={showModal}>Add Recording</Button>
      <Modal destroyOnClose title="Add Recording Url" footer={false} visible={isModalVisible} onCancel={handleCancel}>
        <form onSubmit={submitHandler} className="text-center create-posts">
          <div className="mt-4">
            <Input
              required
              type="text"
              className="form-control"
              placeholder="Enter Recording Url"
              onChange={(e) => setRecording(e.target.value)}
            />
          </div>
          <div style={{ marginTop: '15px' }}>
            <Button type='primary' htmlType="submit" loading={loading} disabled={loading} className="mt-4">Submit</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};