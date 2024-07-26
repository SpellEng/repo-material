import { Alert, Button, Card, Form, Input, Modal, Popconfirm, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { DeleteOutlined, RightOutlined } from '@ant-design/icons'
import axios from 'axios'
import moment from 'moment'
import { ErrorAlert, SuccessAlert } from '../../../Components/Messages/messages';
import AdminLayout from '../../../Layouts/Admin/AdminLayout';
import { IoEye } from 'react-icons/io5'
import { Link } from 'react-router-dom'
import CurrencySign from '../../../Components/CurrencySign'
import { teacherCommission } from '../../../Components/TeacherCommission'

const AdminTutorsList = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [users, setUsers] = useState([]);
    const [current, setCurrent] = useState(1);
    const [totalUsers, setTotalUsers] = useState();
    const [expandedRowKey, setExpandedRowKey] = useState(null);
    const [classes, setClasses] = useState([]);
    const [futureClasses, setFutureClasses] = useState([]);
    const [previousClasses, setPreviousClasses] = useState([]);

    const getFutureClasses = async (id) => {
        await axios.get(`${process.env.REACT_APP_BACKEND_URL}/scheduled-classes/tutor/future/${id}`, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        }).then(res => {
            setLoading(false);
            setFutureClasses(res.data);
        }).catch(err => {
            setLoading(false);
            console.log(err)
            ErrorAlert(err?.message);
        })
    }

    const getPreviousClasses = async (id) => {
        await axios.get(`${process.env.REACT_APP_BACKEND_URL}/scheduled-classes/tutor/past/${id}`, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        }).then(res => {
            setLoading(false);
            setPreviousClasses(res.data);
        }).catch(err => {
            setLoading(false);
            console.log(err)
            ErrorAlert(err?.message);
        })
    }

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const getAllUsers = async (curr) => {
        setLoading(true);
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/tutors`, { ss: "" }, {
            headers: {
                authorization: 'Bearer ' + localStorage.getItem("token")
            }
        }).then(res => {
            setLoading(false);
            if (res.statusText === "OK") {
                setUsers(res.data);
                setTotalUsers(res.data.count);
            } else {
                ErrorAlert(res.data.errorMessage);
            }
        }).catch(err => {
            setLoading(false);
            console.log(err)
            ErrorAlert(err?.message);
        })
    }

    useEffect(() => {
        getAllUsers(current);
        return () => {
        }
    }, []);


    const deleteHandler = async (id) => {
        await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/users/delete/${id}`, {
            headers: {
                authorization: 'Bearer ' + localStorage.getItem("token")
            }
        }).then(res => {
            if (res.statusText === "OK") {
                SuccessAlert(res.data.successMessage)
                getAllUsers();
            } else {
                ErrorAlert(res.data.errorMessage)
            }
        }).catch(err => {
            console.log(err)
            ErrorAlert(err?.message);
        })
    }

    const handleExpand = async (expanded, record) => {
        if (expanded) {
            await getPreviousClasses(record._id);
            await getFutureClasses(record._id);
            setExpandedRowKey(record._id);
        } else {
            setExpandedRowKey(null);
            setPreviousClasses([]);
            setFutureClasses([]);
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: '_id',
            key: '_id',
            sorter: (a, b) => a?._id > b?._id,
            render: (_, { _id }) => (
                <>
                    <div>{_id}</div>
                </>
            ),
        },
        {
            title: 'Picture',
            dataIndex: '_picture',
            key: 'picture',
            render: (_, { picture }) => (
                <>
                    <img src={picture?.url} width="43px" height="43px" />
                </>
            ),
        },
        {
            title: "Name",
            dataIndex: 'fullName',
            key: 'name',
            sorter: (a, b) => a?.fullName?.localeCompare(b?.fullName)
        },
        {
            title: "Email",
            dataIndex: 'email',
            key: 'email',
            sorter: (a, b) => a?.email?.localeCompare(b?.email),
        },
        {
            title: "Phone Number",
            dataIndex: 'phoneNumber',
            key: 'phoneNumber'
        },
        {
            title: "Headline",
            dataIndex: 'headline',
            key: 'headline'
        },
        {
            title: "Signed Up Date",
            dataIndex: 'createdAt',
            key: 'createdAt',
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
            render: (_, { createdAt }) => (
                <p>
                    {moment(createdAt).format("DD/MM/YYYY")}
                </p>
            ),
        },
        {
            title: "Actions",
            render: (_, tutor) => (
                <>
                    <div className='d-flex align-items-center gap-2'>
                        <Link to={`/tutor/${tutor?._id}`}>
                            <IoEye />
                        </Link>
                        <Popconfirm
                            title="Delete"
                            description="Are you sure to delete?"
                            onConfirm={() => deleteHandler(tutor?._id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <DeleteOutlined style={{ verticalAlign: "middle" }} />
                        </Popconfirm>
                    </div>
                </>
            ),
        },
    ];

    // Function to parse DD/MM/YYYY date string to Date object
    const parseDate = (dateString) => {
        const [day, month, year] = dateString.split('/').map(Number);
        return new Date(year, month - 1, day); // Month is zero-based in Date object
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);


    const handleOk = async (id) => {
        try {
            const values = await form.validateFields();
            await axios.put(`${process.env.REACT_APP_BACKEND_URL}/users/tutors/withdraw-tutor-payments/${id}`, { ...values, date: moment().format("DD/MM/YYYY") }, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            }).then(res => {
                if (res.status === 200) {
                    getAllUsers();
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

    return (
        <AdminLayout sidebar>
            <div className='AdminPages'>
                <div className='d-md-flex justify-content-between flex-wrap align-items-start pb-5'>
                    <div>
                        <div className='d-flex gap-2 justify-content-start align-items-center pb-4'>
                            <span>Admin</span> <RightOutlined /> <div className=''>All Tutors</div>
                        </div>
                        <h1 className=''>All Tutors</h1>
                    </div>
                </div>
                <div className='d-hidden d-md-block bg-white'>
                    <Table
                        rowKey="_id"
                        expandable={{
                            expandedRowKeys: [expandedRowKey],
                            onExpand: handleExpand,
                            expandedRowRender: (record) => {
                                let earnings = previousClasses?.length * teacherCommission()
                                let withdrawals = record?.withdrawals?.reduce((a, b) => a + b?.amount, 0);

                                return (
                                    <div>
                                        <Card title={record?.fullName}>
                                            <div className='mb-2'>
                                                <h5 className='mb-1'>Description:</h5>
                                                <p>{record?.description}</p>
                                            </div>
                                            <div className='mb-2'>
                                                <h5 className='mb-1'>Address:</h5>
                                                <p>{record?.city}, {record?.state}</p>
                                            </div>
                                            <div className='mb-2'>
                                                <h5 className='mb-1'>Experience:</h5>
                                                <p>{record?.experience}</p>
                                            </div>
                                            <div className='mb-2'>
                                                <h5 className='mb-1'>Education:</h5>
                                                <p>{record?.education}</p>
                                            </div>
                                            <div className='mb-2'>
                                                <h5 className='mb-1'>Address:</h5>
                                                <p>{record?.city}, {record?.state}</p>
                                            </div>
                                            <div className='mb-2'>
                                                <h5 className='mb-1'>Specialities:</h5>
                                                <div className='d-flex gap-2'>
                                                    {
                                                        record?.specialities?.map((sp, index) => {
                                                            return (
                                                                <Alert className='max-w-[130px]' message={sp} key={index} />
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                            <div className='mb-2'>
                                                <h5 className='mb-1'>Languages:</h5>
                                                <div className='d-flex flex-wrap gap-2'>
                                                    {
                                                        record?.languageslanguages?.map((sp, index) => {
                                                            return (
                                                                <Alert className='max-w-[130px]' message={sp} key={index} />
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </Card>
                                        <div className='d-flex flex-wrap gap-4 mt-3'>
                                            <Card title="All Classes">
                                                <h3>
                                                    {futureClasses?.length + previousClasses?.length}
                                                </h3>
                                            </Card>
                                            <Card title="Future Classes Scheduled">
                                                <h3>
                                                    {futureClasses?.length}
                                                </h3>
                                            </Card>
                                            <Card title="Classes Attended">
                                                <h3>
                                                    {previousClasses?.length}
                                                </h3>
                                            </Card>
                                            <Card title="Total Earnings">
                                                <h3>
                                                    <CurrencySign />
                                                    {earnings}
                                                </h3>
                                            </Card>
                                            <Card title="Earnings Withdrawn">
                                                <h3>
                                                    <CurrencySign />
                                                    {withdrawals}
                                                </h3>
                                            </Card>
                                            <Card title="Total payment left to pay">
                                                <h3>
                                                    <CurrencySign />
                                                    {earnings - withdrawals}
                                                </h3>
                                            </Card>
                                        </div>
                                        <div className='d-flex flex-wrap gap-4 mt-4'>
                                            <div className='d-flex flex-wrap gap-4'>
                                                {
                                                    record?.paymentDetails?.map((detail, index) => {
                                                        return (
                                                            detail?.type === "bank" ?
                                                                <Card title="Bank Payment Details" key={index}>
                                                                    <p><strong>Account Holder Name:</strong> {detail?.accountHolderName}</p>
                                                                    <p><strong>Account Number:</strong> {detail?.accountNumber}</p>
                                                                    <p><strong>IFSC Code:</strong> {detail?.ifscCode}</p>
                                                                    <p><strong>Preferred:</strong> {detail?.isPreferred ? 'Yes' : 'No'}</p>
                                                                </Card>
                                                                :
                                                                <Card title="UPI Payment Details">
                                                                    <p><strong>UPI ID:</strong> {detail?.upiId}</p>
                                                                    <p><strong>Preferred:</strong> {detail?.isPreferred ? 'Yes' : 'No'}</p>
                                                                </Card>
                                                        )
                                                    })
                                                }
                                                <Card title="Send Payments">
                                                    <Button onClick={showModal}>Add Payment</Button>
                                                </Card>
                                            </div>
                                        </div>
                                        <Modal title="Enter Payments" visible={isModalVisible} onOk={() => handleOk(record?._id)} onCancel={handleCancel}>
                                            <Form form={form} layout="vertical">
                                                <Form.Item name="title" label="Title of amount" rules={[{ required: true, message: 'Please enter title' }]}>
                                                    <Input />
                                                </Form.Item>
                                                <Form.Item name="amount" label="Amount sent to tutor" rules={[{ required: true, message: 'Please enter amount sent to tutor' }]}>
                                                    <Input type='number' />
                                                </Form.Item>
                                            </Form>
                                        </Modal>
                                    </div>
                                )
                            },
                            rowExpandable: (record) => record.name !== 'Not Expandable',
                        }}
                        loading={loading}
                        showSorterTooltip
                        columns={columns}
                        pagination={false}
                        dataSource={users} />
                </div>
            </div>
        </AdminLayout>
    )
}

export default AdminTutorsList
