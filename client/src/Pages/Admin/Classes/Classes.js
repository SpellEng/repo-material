import { Popconfirm, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { DeleteOutlined, RightOutlined } from '@ant-design/icons'
import axios from 'axios'
import { ErrorAlert, SuccessAlert } from '../../../Components/Messages/messages';
import AdminLayout from '../../../Layouts/Admin/AdminLayout';
import { IoEye } from 'react-icons/io5'
import { Link } from 'react-router-dom'

const AdminClassesList = () => {
    const [loading, setLoading] = useState(false);
    const [scheduledClasses, setScheduledClasses] = useState([]);
    const [current, setCurrent] = useState(1);
    const [totalScheduledClasses, setTotalScheduledClasses] = useState();

    const getAllScheduledClasses = async () => {
        setLoading(true);
        await axios.get(`${process.env.REACT_APP_BACKEND_URL}/scheduled-classes`, {
            headers: {
                authorization: 'Bearer ' + localStorage.getItem("token")
            }
        }).then(res => {
            setLoading(false);
            if (res.statusText === "OK") {
                setScheduledClasses(res.data);
                setTotalScheduledClasses(res.data.count);
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
        getAllScheduledClasses();
        return () => {
        }
    }, []);


    const deleteHandler = async (id) => {
        await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/scheduled-classes/delete/${id}`, {
            headers: {
                authorization: 'Bearer ' + localStorage.getItem("token")
            }
        }).then(res => {
            if (res.statusText === "OK") {
                SuccessAlert(res.data.successMessage)
                getAllScheduledClasses();
            } else {
                ErrorAlert(res.data.errorMessage)
            }
        }).catch(err => {
            console.log(err)
            ErrorAlert(err?.message);
        })
    }

    const deleteRecordingHandler = async (id) => {
        await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/scheduled-classes/recording/delete/${id}`, {
            headers: {
                authorization: 'Bearer ' + localStorage.getItem("token")
            }
        }).then(res => {
            if (res.statusText === "OK") {
                SuccessAlert(res.data.successMessage)
                getAllScheduledClasses();
            } else {
                ErrorAlert(res.data.errorMessage)
            }
        }).catch(err => {
            console.log(err)
            ErrorAlert(err?.message);
        })
    }

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
            title: 'Tutor',
            dataIndex: 'tutor',
            key: 'tutor',
            render: (_, { tutor }) => (
                <div className='d-flex gap-2 align-items-center'>
                    <img src={tutor?.picture?.url} height="60px" style={{ width: "60px" }} />
                    <div>
                        <h6>{tutor?.fullName}</h6>
                        <p>{tutor?.email}</p>
                        <p>{tutor?.phoneNumber}</p>
                    </div>
                </div>
            ),
        },
        {
            title: 'Student',
            dataIndex: 'students',
            key: 'students',
            render: (_, { students }) => (
                students[0]?.email ?
                    <div className='d-flex gap-2 align-items-center'>
                        <img src={students[0]?.picture?.url} height="60px" style={{ width: "60px" }} />
                        <div>
                            <h6>{students[0]?.fullName}</h6>
                            <p>{students[0]?.email}</p>
                            <p>{students[0]?.phoneNumber}</p>
                        </div>
                    </div>
                    :
                    <div>No student</div>
            ),
        },
        {
            title: "Date",
            dataIndex: 'date',
            key: 'date',
            sorter: (a, b) => new Date(a.date) - new Date(b.date),
        },
        {
            title: "Time",
            dataIndex: 'time',
            key: 'time',
        },
        {
            title: 'Recording',
            dataIndex: 'recording',
            key: 'recording',
            render: (_, b) => (
                b?.recording ?
                    <div className='d-flex gap-2'>
                        <a href={b?.recording?.url}>
                            Download
                        </a>
                        <Popconfirm
                            title="Delete"
                            description="Are you sure to delete?"
                            onConfirm={() => deleteRecordingHandler(b?._id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <DeleteOutlined style={{ verticalAlign: "middle" }} />
                        </Popconfirm>
                    </div>
                    :
                    <div>No recording</div>
            ),
        },
        {
            title: "Actions",
            render: (_, product) => (
                <>
                    <div className='d-flex align-items-center gap-2'>
                        <Link to="/">
                            <IoEye />
                        </Link>
                        <Popconfirm
                            title="Delete"
                            description="Are you sure to delete?"
                            onConfirm={() => deleteHandler(product?._id)}
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


    return (
        <AdminLayout sidebar>
            <div className='AdminPages'>
                <div className='d-md-flex justify-content-between flex-wrap align-items-start pb-5'>
                    <div>
                        <div className='d-flex gap-2 justify-content-start align-items-center pb-4'>
                            <span>Admin</span> <RightOutlined /> <div className=''>All Classes</div>
                        </div>
                        <h1 className=''>All Classes</h1>
                    </div>
                </div>
                <div className='d-hidden d-md-block bg-white'>
                    <Table loading={loading} showSorterTooltip columns={columns} pagination={false} dataSource={scheduledClasses} />
                </div>
            </div>
        </AdminLayout>
    )
}

export default AdminClassesList
