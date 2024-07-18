import { Card} from 'antd'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { ErrorAlert } from '../../../Components/Messages/messages';
import AdminLayout from '../../../Layouts/Admin/AdminLayout';
import CurrencySign from '../../../Components/CurrencySign';
import { teacherCommission } from '../../../Components/TeacherCommission';

const AdminDashboard = () => {
    const [loading, setLoading] = useState(false);
    const [classes, setClasses] = useState([]);
    const [students, setStudents] = useState([]);
    const [tutors, setTutors] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [totalScheduledClasses, setTotalScheduledClasses] = useState();


    const getAllUsers = async () => {
        setLoading(true);
        await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users`, {
            headers: {
                authorization: 'Bearer ' + localStorage.getItem("token")
            }
        }).then(res => {
            setLoading(false);
            if (res.statusText === "OK") {
                setStudents(res.data);
            } else {
                ErrorAlert(res.data.errorMessage);
            }
        }).catch(err => {
            setLoading(false);
            console.log(err)
            ErrorAlert(err?.message);
        })
    }

    const getAllUsersSubsctiptions = async () => {
        setLoading(true);
        await axios.get(`${process.env.REACT_APP_BACKEND_URL}/subscriptions`, {
            headers: {
                authorization: 'Bearer ' + localStorage.getItem("token")
            }
        }).then(res => {
            setLoading(false);
            if (res.statusText === "OK") {
                setSubscriptions(res.data);
            } else {
                ErrorAlert(res.data.errorMessage);
            }
        }).catch(err => {
            setLoading(false);
            console.log(err)
            ErrorAlert(err?.message);
        })
    }

    const getAllTutors = async () => {
        setLoading(true);
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/tutors`, { ss: "" }, {
            headers: {
                authorization: 'Bearer ' + localStorage.getItem("token")
            }
        }).then(res => {
            setLoading(false);
            if (res.statusText === "OK") {
                setTutors(res.data);
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
        getAllUsers();
        getAllTutors();
        getAllScheduledClasses();
        getAllUsersSubsctiptions();

        return () => {
        }
    }, []);

    const getAllScheduledClasses = async () => {
        setLoading(true);
        await axios.get(`${process.env.REACT_APP_BACKEND_URL}/scheduled-classes`, {
            headers: {
                authorization: 'Bearer ' + localStorage.getItem("token")
            }
        }).then(res => {
            setLoading(false);
            if (res.statusText === "OK") {
                setClasses(res.data);
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

    // Function to parse DD/MM/YYYY date string to Date object
    const parseDate = (dateString) => {
        const [day, month, year] = dateString.split('/').map(Number);
        return new Date(year, month - 1, day); // Month is zero-based in Date object
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let pastClasses = classes?.filter(item => {
        const itemDate = parseDate(item.date);
        return itemDate < today;
    });

    let futureClasses = classes?.filter(item => {
        const itemDate = parseDate(item.date);
        return itemDate > today;
    });

    function sumAmounts(tutors) {
        let totalSum = 0;

        // Iterate over tutors array
        for (let i = 0; i < tutors.length; i++) {
            const withdrawals = tutors[i].withdrawals;

            // Check if withdrawals array exists and is an array
            if (withdrawals && Array.isArray(withdrawals)) {
                // Iterate over withdrawals array for each tutor
                for (let j = 0; j < withdrawals.length; j++) {
                    totalSum += withdrawals[j].amount;
                }
            }
        }

        return totalSum;
    }

    let withdrawals = sumAmounts(tutors);

    let totalEarningsThroughSubscriptions = subscriptions?.reduce((a, b) => a + parseInt(b?.amount), 0)

    let earnings = pastClasses?.length * teacherCommission()

    return (
        <AdminLayout sidebar>
            <div className='AdminPages'>
                <h1 className=''>Dashboard</h1>
                <div className=''>
                    <div className='d-flex flex-wrap gap-4 mt-3'>
                        <Card title="Total earnings through subscriptions">
                            <h3>
                                <CurrencySign />{totalEarningsThroughSubscriptions}
                            </h3>
                        </Card>
                        <Card title="All Tutors Registered">
                            <h3>
                                {tutors?.length}
                            </h3>
                        </Card>
                        <Card title="All Students Registered">
                            <h3>
                                {students?.length}
                            </h3>
                        </Card>
                        <Card title="All Future Classes Scheduled">
                            <h3>
                                {futureClasses?.length}
                            </h3>
                        </Card>
                        <Card title="All Classes Attended">
                            <h3>
                                {classes?.length}
                            </h3>
                        </Card>
                        <Card title="Total Earnings of Tutors">
                            <h3>
                                <CurrencySign />
                                {earnings}
                            </h3>
                        </Card>
                        <Card title="Total Earnings Withdrawn by Tutors">
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
                </div>
            </div>
        </AdminLayout>
    )
}

export default AdminDashboard;
