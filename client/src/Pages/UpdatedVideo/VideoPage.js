import { Button, Card } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../../Components/Auth/auth';
import { ErrorAlert } from '../../Components/Messages/messages';
import VideoCallComp from './VideoCallComp';
import moment from 'moment-timezone';
import "./VideoCallComp.css";

const VideoPage = () => {
    const location = useLocation();
    const router = useNavigate();
    const user = isAuthenticated();
    const roomId = new URLSearchParams(location.search).get("roomID");
    const [classObject, setClassObject] = useState(null);
    const [originalClassObject, setOriginalClassObject] = useState(null);
    const [joinMeeting, setJoinMeeting] = useState(false);
    const [classStatus, setClassStatus] = useState("");

    const getScheduledClass = async () => {
        await axios.get(`${process.env.REACT_APP_BACKEND_URL}/scheduled-classes/class/${roomId}`, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        }).then(res => {
            if (res.status === 200) {
                setOriginalClassObject(res.data);
                if (user?.role === 0) {
                    setClassObject(res.data?.students?.filter(f => f?._id === user?._id));
                } else {
                    setClassObject(res.data?.tutor?._id === user?._id);
                }
                checkClassStartTime(res.data);
            } else {
                ErrorAlert(res.data.errorMessage);
            }
        }).catch(err => {
            ErrorAlert(err?.message);
        })
    };

    const checkClassStartTime = (classData) => {
        const classTime = classData?.time.split(' - ')[0]; // Get start time
        const classEndTime = classData?.time.split(' - ')[1]; // Get start time
        // const classTime = "12:55am"; // Get start time
        const classDate = classData?.date; // Get class date
        const tutorTimezone = classData?.tutor?.timezone;
        const userTimezone = user?.timezone;

        // Combine date and time for class start in the tutor's timezone
        const classStartDateTime = moment.tz(`${classDate} ${classTime}`, 'DD/MM/YYYY h:mma', tutorTimezone);
        const classEndDateTime = moment.tz(`${classDate} ${classEndTime}`, 'DD/MM/YYYY h:mma', tutorTimezone);

        // Get the current time in the user's timezone
        const userCurrentMoment = moment.tz(userTimezone);

        // Check if the current time in the user's timezone is after the class start time in the tutor's timezone

        if (userCurrentMoment.isAfter(classEndDateTime)) {
            setClassStatus("ended");
        }
        else if (userCurrentMoment.isSameOrAfter(classStartDateTime)) {
            setClassStatus("started");
        } else {
            setClassStatus("not_started");
        }
    };

    const getStudentActiveSubscriptionStatus = async () => {
        if (user?.trialActivated && !user?.trialUsed) {
            return;
        } else {
            await axios.get(`${process.env.REACT_APP_BACKEND_URL}/subscriptions/active-subscription`, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            }).then(res => {
                if (res.status === 200) {
                    if (res.data?.status === "active") {

                    } else {
                        router("/student/subscriptions")
                    }
                } else {
                    ErrorAlert(res.data.errorMessage);
                }
            }).catch(err => {
                ErrorAlert(err?.message);
            })
        }
    };

    useEffect(() => {
        if (roomId) {
            getScheduledClass()
        }
        if (user?.role === 0) {
            getStudentActiveSubscriptionStatus();
        }
        return () => {
        };
    }, [roomId]);

    return (
        <div className='VideoPage text-center'>
            <div className='container'>
                {
                    classObject ?
                        (
                            joinMeeting ?
                                <VideoCallComp classObject={originalClassObject} />
                                :
                                <div className='mt-5' style={{ minHeight: "60vh" }}>
                                    <Card
                                        style={{ margin: "0px auto" }}
                                        title="Meeting"
                                    >
                                        {

                                            classStatus === 'ended' ?
                                                <h4>The class has ended!</h4>
                                                :
                                                classStatus === 'started' ?
                                                    <Button className="w-100" type='primary' onClick={() => setJoinMeeting(true)}>Join Now</Button>
                                                    :
                                                    classStatus === 'not_started' &&
                                                    <h4>The class is not started yet!</h4>
                                        }
                                    </Card>
                                </div>
                        )
                        :
                        <h4 className='my-5'>No class is scheduled</h4>
                }
            </div>
        </div>
    )
}

export default VideoPage;
