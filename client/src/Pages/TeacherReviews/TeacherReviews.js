import React, { useEffect, useState } from 'react';
import { Rate, Button, Input, List, Card } from 'antd';
import { ErrorAlert, SuccessAlert } from '../../Components/Messages/messages';
import axios from 'axios';
import { isAuthenticated } from '../../Components/Auth/auth';
import { useLocation, useNavigate } from 'react-router-dom';

const { TextArea } = Input;

const TeacherReviews = () => {
    const location = useLocation();
    const router = useNavigate();
    const roomId = location.state?.roomId;
    const [currentReview, setCurrentReview] = useState('');
    const [currentRating, setCurrentRating] = useState(0);
    const [tutorId, setTutorId] = useState(null);
    const [classObject, setClassObject] = useState(null);
    const [student, setStudent] = useState(null);

    const getScheduledClass = async () => {
        if (isAuthenticated()?.role == 0 && roomId)
            await axios.get(`${process.env.REACT_APP_BACKEND_URL}/scheduled-classes/class/${roomId}`, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            }).then(res => {
                if (res.status === 200) {
                    if (isAuthenticated()?.role === 0) {
                        setStudent(res.data?.students?.filter(f => f?._id === isAuthenticated()?._id)[0]);
                        setClassObject(res.data);
                    } else {
                        router("/");
                    }
                } else {
                    ErrorAlert(res.data.errorMessage);
                }
            }).catch(err => {
                ErrorAlert(err?.message);
            })
        else {
            router("/");
        }
    };

    console.log(classObject);

    const handleReviewChange = (e) => {
        setCurrentReview(e.target.value);
    };

    const handleRatingChange = (value) => {
        setCurrentRating(value);
    };

    const handleSubmit = async () => {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/tutor/add-reviews`, {
            tutorId: classObject?.tutor?._id,
            classId: classObject?._id,
            userId: isAuthenticated()?._id,
            message: currentReview,
            rating: currentRating
        }, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        }).then(res => {
            if (res.status === 200) {
                SuccessAlert(res.data.successMessage);
                setCurrentReview('');
                setCurrentRating([0]);
                router("/");
            } else {
                ErrorAlert(res.data.errorMessage);
            }
        }).catch(err => {
            console.log(err)
            ErrorAlert(err?.message);
        })
    }

    useEffect(() => {
        getScheduledClass();

        return () => {

        }
    }, [roomId])


    return (
        student && student?.email &&
        <div className="TeacherReviews mt-3">
            <Card className="p-4">
                <h2 className="mb-4">Leave a Review</h2>
                <Rate onChange={handleRatingChange} value={currentRating} />
                <TextArea
                    rows={4}
                    value={currentReview}
                    onChange={handleReviewChange}
                    placeholder="Write your review here"
                    className="my-3"
                />
                <Button type="primary" onClick={handleSubmit} disabled={!currentReview || !currentRating}>
                    Submit
                </Button>
            </Card>
        </div>
    );
};

export default TeacherReviews;