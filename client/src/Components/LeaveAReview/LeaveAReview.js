import React, { useState } from 'react';
import { Rate, Button, Input } from 'antd';
import { ErrorAlert, SuccessAlert } from '../../Components/Messages/messages';
import axios from 'axios';
import { isAuthenticated } from '../../Components/Auth/auth';

const { TextArea } = Input;

const LeaveAReview = ({ previousClass, updateParent }) => {
    const [currentReview, setCurrentReview] = useState('');
    const [currentRating, setCurrentRating] = useState(1.5);

    const handleReviewChange = (e) => {
        setCurrentReview(e.target.value);
    };

    const handleRatingChange = (value) => {
        setCurrentRating(value);
    };

    const handleSubmit = async () => {
        await axios.put(`${process.env.REACT_APP_BACKEND_URL}/scheduled-classes/add-review`, {
            classId: previousClass?._id,
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
                updateParent();
            } else {
                ErrorAlert(res.data.errorMessage);
            }
        }).catch(err => {
            console.log(err)
            ErrorAlert(err?.message);
        })
    }


    return (
        <div className="LeaveAReview mt-3">
            <div>
                <h4 className="mb-1">How was your last class experience with {previousClass?.tutor?.fullName}?</h4>
                <p className='mb-4'>You attended this class on {previousClass?.date} at {previousClass?.time}</p>
                <Rate allowHalf onChange={handleRatingChange} value={currentRating} />
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
            </div>
        </div>
    );
};

export default LeaveAReview;