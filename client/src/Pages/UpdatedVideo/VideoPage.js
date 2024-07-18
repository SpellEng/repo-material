import { Button, Card } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../../Components/Auth/auth';
import { ErrorAlert } from '../../Components/Messages/messages';
import VideoCallComp from './VideoCallComp';
import "./VideoCallComp.css";

const VideoPage = () => {
    const location = useLocation();
    const router = useNavigate();
    const roomId = new URLSearchParams(location.search).get("roomID");
    const [classObject, setClassObject] = useState(null);
    const [originalClassObject, setOriginalClassObject] = useState(null);
    const [joinMeeting, setJoinMeeting] = useState(false);

    const getScheduledClass = async () => {
        await axios.get(`${process.env.REACT_APP_BACKEND_URL}/scheduled-classes/class/${roomId}`, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        }).then(res => {
            if (res.status === 200) {
                setOriginalClassObject(res.data);
                if (isAuthenticated()?.role === 0) {
                    setClassObject(res.data?.students?.filter(f => f?._id === isAuthenticated()?._id));
                } else {
                    setClassObject(res.data?.tutor?._id === isAuthenticated()?._id);
                }
            } else {
                ErrorAlert(res.data.errorMessage);
            }
        }).catch(err => {
            ErrorAlert(err?.message);
        })
    };

    const getStudentActiveSubscriptionStatus = async () => {
        if (isAuthenticated()?.trialActivated && !isAuthenticated()?.trialUsed) {
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
        if (isAuthenticated()?.role === 0) {
            getStudentActiveSubscriptionStatus();
        }
        return () => {
        };
    }, [roomId]);
    return (
        <div className='VideoPage text-center'>
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
                                    <Button className="w-100" type='primary' onClick={() => setJoinMeeting(true)}>Join Now</Button>
                                </Card>
                            </div>
                    )
                    :
                    <h4 className='my-5'>No class is scheduled</h4>
            }

        </div>
    )
}

export default VideoPage
