import React from 'react';
import { Card, Button, Avatar, Flex } from 'antd';
import './SessionsCard.css';
import { LuDownload } from 'react-icons/lu';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const SessionCard = ({ meetingUrl, type, removeScheduledClass, isTutor, id, studentId, tutor, date, time, isUpcoming, tutorLayout, recording }) => {
    const router = useNavigate();
    // Function to open a URL in a new tab
    const openInNewTab = (url) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    // Function to check if the current time is within the scheduled meeting time
    const isMeetingTime = () => {
        const now = moment();
        const meetingStart = moment(`${date} ${time.split(' - ')[0]}`, 'DD/MM/YYYY h:mm a');
        const meetingEnd = moment(`${date} ${time.split(' - ')[1]}`, 'DD/MM/YYYY h:mm a');

        return now.isBetween(meetingStart, meetingEnd, null, '[)');
    };

    return (
        <Card className="SessionCard">
            <div className="sessionHeader">
                <Flex gap="10px" align="center">
                    <Avatar size={48} icon={<img src={tutor?.picture?.url} />} />
                    <span>{type}: <b>{tutor?.fullName}</b></span>
                </Flex>
                {
                    !isUpcoming && isTutor &&
                    <button className='btn p-0' onClick={() => router(`/chats?receiver=${studentId}`)}>
                        <LuDownload />
                        <br />
                        <small>Message Me</small>
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
            <Flex gap="19px" justify="space-between" align="center" className="sessionActions mt-3">
                {isUpcoming ? (
                    <div className='w-100'>
                        <Flex className='sessionBtns' gap="10px" justify="space-between" align="center">
                            <Button type="primary" danger onClick={() => removeScheduledClass(id, date, time)}>Cancel</Button>
                            <Button type="primary" disabled={!isMeetingTime()} onClick={() => openInNewTab(meetingUrl)}>
                                Join
                            </Button>
                        </Flex>
                        <p>Only 3 classes can be cancelled every month 2 hours before the class</p>
                    </div>
                ) : null
                }
                {/* <a href={recording?.url} className="downloadBtn" download type="primary">Download Class</a> */}
            </Flex>
        </Card>
    );
}

export default SessionCard;
