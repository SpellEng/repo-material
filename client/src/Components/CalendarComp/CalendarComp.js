import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CalendarComp = ({ onChange, date }) => {
    const disablePastDates = ({ date }) => {
        const today = new Date();
        return date < today.setHours(0, 0, 0, 0); // Disable dates before today
    };
    return (
        <div>
            <Calendar
                tileDisabled={disablePastDates}
                onChange={onChange}
                value={date}
            />
        </div>
    )
}

export default CalendarComp
