import { Button, Card, List, Popconfirm, Table, Tag, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { DeleteOutlined, RightOutlined } from '@ant-design/icons'
import axios from 'axios'
import moment from 'moment'
import { ErrorAlert, SuccessAlert } from '../../../Components/Messages/messages';
import AdminLayout from '../../../Layouts/Admin/AdminLayout';
import { IoEye } from 'react-icons/io5'
import { Link } from 'react-router-dom';
import CurrencySign from '../../../Components/CurrencySign'
import { AddRecordings } from '../../../Components/Admin/Recordings/AddRecordings'

const { Text } = Typography;

const AdminStudentsList = () => {
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [current, setCurrent] = useState(1);
    const [totalUsers, setTotalUsers] = useState();
    const [classes, setClasses] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [expandedRowKey, setExpandedRowKey] = useState(null);
    const [futureClasses, setFutureClasses] = useState([]);
    const [previousClasses, setPreviousClasses] = useState([]);

    const getFutureClasses = async (id) => {
        await axios.get(`${process.env.REACT_APP_BACKEND_URL}/scheduled-classes/student/future/${id}`, {
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
        await axios.get(`${process.env.REACT_APP_BACKEND_URL}/scheduled-classes/student/past/${id}`, {
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

    const getAllUsers = async () => {
        setLoading(true);
        await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users`, {
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

    const deleteRecording = async (id) => {
        await axios.put(`${process.env.REACT_APP_BACKEND_URL}/users/recording/delete/${id}`, { ss: "" }, {
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

    const fetchSubscriptions = async (id) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/subscriptions/user/${id}`, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            });
            setSubscriptions(response.data);
        } catch (error) {
            console.error('Error fetching subscriptions:', error);
        }
    };

    const handleExpand = async (expanded, record) => {
        if (expanded) {
            await fetchSubscriptions(record?._id)
            await getFutureClasses(record._id);
            await getPreviousClasses(record._id);
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
            render: (_, user) => (
                <>
                    <div className='d-flex align-items-center gap-2'>
                        {
                            !user?.recording ?
                                <AddRecordings id={user?._id} updateFunction={getAllUsers} />
                                :
                                <Button onClick={() => deleteRecording(user?._id)} type="danger">Remove Recording</Button>
                        }
                        <Popconfirm
                            title="Delete"
                            description="Are you sure to delete?"
                            onConfirm={() => deleteHandler(user?._id)}
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

    return (
        <AdminLayout sidebar>
            <div className='AdminPages'>
                <div className='d-md-flex justify-content-between flex-wrap align-items-start pb-5'>
                    <div>
                        <div className='d-flex gap-2 justify-content-start align-items-center pb-4'>
                            <span>Admin</span> <RightOutlined /> <div className=''>All Students</div>
                        </div>
                        <h1 className=''>All Students</h1>
                    </div>
                </div>
                <div className='d-hidden d-md-block bg-white'>
                    <Table
                        rowKey="_id"
                        expandable={{
                            expandedRowKeys: [expandedRowKey],
                            onExpand: handleExpand,
                            expandedRowRender: (record) => {

                                return (
                                    <div>
                                        <div className='d-flex flex-wrap gap-2'>
                                            <Card title="Future Classes Scheduled">
                                                <h3>
                                                    {futureClasses?.length}
                                                </h3>
                                            </Card>
                                            <Card title="Total Classes Attended">
                                                <h3>
                                                    {previousClasses?.length}
                                                </h3>
                                            </Card>
                                        </div>
                                        <h2 className='mt-5'>Subscriptions Bought:</h2>
                                        <List
                                            grid={{ gutter: 16, column: 1 }}
                                            dataSource={subscriptions}
                                            className="mt-2"
                                            renderItem={subscription => (
                                                <List.Item>
                                                    <Card
                                                        style={{ margin: "0px auto" }}
                                                        title={subscription.plan}
                                                        extra={<Tag color={subscription.status === 'expired' ? 'red' : 'green'} style={{ textTransform: "capitalize" }}>{subscription.status}</Tag>}
                                                    >
                                                        <Text strong>Expiry Date: </Text>
                                                        <Text>{new Date(subscription.expiryDate).toLocaleDateString()}</Text>
                                                        <br />
                                                        <Text strong>Amount: </Text>
                                                        <Text><CurrencySign />{subscription.amount}</Text>
                                                    </Card>
                                                </List.Item>
                                            )}
                                        />
                                    </div>
                                )
                            },
                            rowExpandable: (record) => record.name !== 'Not Expandable',
                        }}
                        loading={loading}
                        showSorterTooltip
                        columns={columns}
                        pagination={false}
                        dataSource={users}
                    />
                </div>
            </div>
        </AdminLayout>
    )
}

export default AdminStudentsList
