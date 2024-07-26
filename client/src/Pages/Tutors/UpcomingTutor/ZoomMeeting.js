import React, { useState } from 'react';
import axios from 'axios';

const ZoomMeeting = () => {
    const [startTime, setStartTime] = useState('');
    const [meetingLink, setMeetingLink] = useState('');

    const authorizeZoom = () => {
        window.location.href = `${process.env.REACT_APP_BACKEND_URL}/auth/authorize`;
    };

    const createMeeting = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/scheduled-classes/create-meeting`, {
                startTime,
            });
            setMeetingLink(response.data.meetingLink);
        } catch (error) {
            console.error('Error creating meeting', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div>
            <h1>Zoom Integration</h1>
            <button onClick={authorizeZoom}>Authorize Zoom</button>
            <h1>Create Zoom Meeting</h1>
            <form onSubmit={(e) => { e.preventDefault(); createMeeting(); }}>
                <div>
                    <label>Start Time:</label>
                    <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                </div>
                <button type="submit">Create Meeting</button>
            </form>
            {meetingLink && (
                <div>
                    <h2>Meeting Link:</h2>
                    <a href={meetingLink} target="_blank" rel="noopener noreferrer">{meetingLink}</a>
                </div>
            )}
        </div>
    );
};

export default ZoomMeeting;
