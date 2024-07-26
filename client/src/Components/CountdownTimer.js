import { Button } from 'antd';
import React, { useState } from 'react';
import { useTimer } from 'react-timer-hook';

export const CountdownTimer = ({ sendOtp }) => {
    const [expired, setExpired] = useState(false);
    let expiryTimestamp = new Date().setSeconds(new Date().getSeconds() + 120);
    const {
        seconds,
        minutes,
        restart
    } = useTimer({ autoStart: true, expiryTimestamp, onExpire: () => setExpired(true) });

    const handleSendOTP = async () => {
        setExpired(false);
        await sendOtp();
        restart(expiryTimestamp);
    }

    return (
        <div style={{ textAlign: 'center' }}>
            {
                expired ?
                    <Button style={{ width: "130px" }} type='primary' onClick={handleSendOTP}>Resend OTP</Button>
                    :
                    <span>{minutes}:{seconds}</span>
            }
        </div>
    );
}