import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Input, Checkbox, Card, Table } from "antd";
import { FaInfoCircle } from "react-icons/fa";
import CurrencySign from "../../../Components/CurrencySign";
import axios from "axios";
import "./Earning.css";
import { isAuthenticated } from "../../../Components/Auth/auth";
import { ErrorAlert } from "../../../Components/Messages/messages";
import { teacherCommission } from "../../../Components/TeacherCommission";

const TutorEarnings = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formType, setFormType] = useState("");
  const [user, setUser] = useState({});
  const [classes, setClasses] = useState([]);
  const [form] = Form.useForm();

  const showModal = (type) => {
    setFormType(type);
    setIsModalVisible(true);
  };

  const getUserById = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/user/${isAuthenticated()?._id}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error getting user details:', error);
      ErrorAlert(error?.message);
    }
  };

  const getPreviousClasses = async () => {
    await axios.get(`${process.env.REACT_APP_BACKEND_URL}/scheduled-classes/tutor/past/${isAuthenticated()?._id}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    }).then(res => {
      if (res.status === 200) {
        setClasses(res.data);
      } else {
        ErrorAlert(res.data.errorMessage);
      }
    }).catch(err => {
      console.log(err)
      ErrorAlert(err?.message);
    })
  }

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const userId = isAuthenticated()?._id; // Replace with actual user ID
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/users/tutors/add-payment-details`, { ...values, userId, type: formType }, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      }).then(res => {
        if (res.status === 200) {
          getUserById();
          setIsModalVisible(false);
        } else {
          ErrorAlert(res.data?.errorMessage);
        }
      })
    } catch (error) {
      console.error('Error saving payment details:', error);
      ErrorAlert(error?.message);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    getUserById();
    getPreviousClasses();

    return () => {

    }
  }, []);

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'For',
      dataIndex: 'student',
      key: 'student',
      render: (a, b) => (
        <div>1 on 1 class with {b?.students[0]?.fullName}</div>
      )
    },
    {
      title: 'Amount',
      key: '30',
      render: (a, b) => (
        <div><CurrencySign />{teacherCommission()}</div>
      )
    },
  ];

  return (
    <div className="TutorEarnings">
      <h4>Revenue Earned</h4>
      <header>
        <FaInfoCircle />
        You can get your available revenue Every Week in your
        preferred payment method.
      </header>
      <div className="amountContainer">
        <div>
          <p>Withdrawals</p>
          <h4><CurrencySign />{user?.withdrawals?.reduce((a, b) => a + b?.amount, 0)}</h4>
        </div>
        <div>
          <p>Available Income</p>
          <h4><CurrencySign />{classes?.length * 125}</h4>
        </div>
      </div>
      <div className="withdrawBtns">
        <p>Withdraw To:</p>
        <Button onClick={() => showModal('bank')} className="btn h-auto">Bank</Button>
        <Button onClick={() => showModal('upi')} className="btn h-auto">UPI</Button>
      </div>
      {
        user?.paymentDetails?.map((detail, index) => {
          return (
            <Card key={index} title={`${detail?.type?.toUpperCase()} Payment Details`} className="paymentDetailsCard mb-3">
              {
                detail?.type === "bank" ?
                  <div key={index}>
                    <p><strong>Account Holder Name:</strong> {detail?.accountHolderName}</p>
                    <p><strong>Account Number:</strong> {detail?.accountNumber}</p>
                    <p><strong>IFSC Code:</strong> {detail?.ifscCode}</p>
                    <p><strong>Preferred:</strong> {detail?.isPreferred ? 'Yes' : 'No'}</p>
                  </div>
                  :
                  <div>
                    <p><strong>UPI ID:</strong> {detail?.upiId}</p>
                    <p><strong>Preferred:</strong> {detail?.isPreferred ? 'Yes' : 'No'}</p>
                  </div>
              }
            </Card>
          )
        })
      }
      <div className="fullDetail mt-4">
        <h1>Payment history:</h1>
        <Table pagination={false} dataSource={classes} columns={columns} />
      </div>
      <Modal title="Enter Payment Details" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Form form={form} layout="vertical">
          {formType === 'bank' ? (
            <>
              <Form.Item name="accountHolderName" label="Account Holder Name" rules={[{ required: true, message: 'Please enter account holder name' }]}>
                <Input />
              </Form.Item>
              <Form.Item name="accountNumber" label="Account Number" rules={[{ required: true, message: 'Please enter account number' }]}>
                <Input />
              </Form.Item>
              <Form.Item name="ifscCode" label="IFSC Code" rules={[{ required: true, message: 'Please enter IFSC code' }]}>
                <Input />
              </Form.Item>
            </>
          ) : (
            <Form.Item name="upiId" label="UPI ID" rules={[{ required: true, message: 'Please enter UPI ID' }]}>
              <Input />
            </Form.Item>
          )}
          <Form.Item name="isPreferred" valuePropName="checked">
            <Checkbox>Preferred Payment Method</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TutorEarnings;
