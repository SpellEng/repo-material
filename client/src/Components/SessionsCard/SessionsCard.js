import React from 'react';
import { Card, Button, Avatar, Flex } from 'antd';
import './SessionsCard.css';
import { LuDownload } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';

const SessionCard = ({ removeScheduledClass, isTutor, id, studentId, tutor, date, time, isUpcoming, tutorLayout, recording }) => {
    const router = useNavigate();
    return (
        <Card className="SessionCard">
            <div className="sessionHeader">
                <Flex gap="10px" align="center">
                    <Avatar size={48} icon={<img src={tutor?.picture?.url} />} />
                    <span>Tutor: <b>{tutor?.fullName}</b></span>
                </Flex>
                {
                    !isUpcoming && isTutor &&
                    <button className='btn p-0' onClick={() => router(`/chats?receiver=${studentId}`)}>
                        <LuDownload />
                        <br />
                        <small>Session Notes</small>
                    </button>
                }
            </div>
            <Flex justify="space-between" className='my-2' align="center">
                <div className='text-start'>
                    <small>Date:</small>
                    <h6>{date}</h6>
                </div>
                <div className='text-end'>
                    <small>Time:</small>
                    <h6>{time}</h6>
                </div>
            </Flex>
            <Flex gap="19px" justify="end" align="center" className="sessionActions mt-3">
                {isUpcoming ? (
                    <div>
                        <Flex className='sessionBtns' gap="19px" justify="end" align="center">
                            <Button type="primary" danger onClick={() => removeScheduledClass(id, date, time)}>Cancel & Reschedule</Button>
                            <Button type="primary" onClick={() => router(`/video-class?roomID=${id}`)}>Join</Button>
                        </Flex>
                        <p>Only one demo can be resechuled with a 2-hour notice</p>
                    </div>
                ) : (
                    !tutorLayout &&
                    <>
                        <p className='text-center fs-6'>Download your class in your device within <u>30 days</u>. <u>After it, class is not available for download</u></p>
                        <a href={recording?.url} className="downloadBtn" download type="primary">Download Class</a>
                    </>
                )}
            </Flex>
        </Card>
    );
}

export default SessionCard;