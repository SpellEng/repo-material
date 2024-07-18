import React from 'react';
import { useStopwatch } from 'react-timer-hook';

export const CallTimer = () => {
    const {
        seconds,
        minutes,
        hours,
    } = useStopwatch({ autoStart: true });

    const formatTime = (time) => {
        return time < 10 ? `0${time}` : time;
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '43px' }}>
                <span>{formatTime(hours)}</span>:<span>{formatTime(minutes)}</span>:<span>{formatTime(seconds)}</span>
            </div>
        </div>
    );
};
