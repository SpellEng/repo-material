import React from 'react';
import { Card } from 'antd';
import './AboutTeacher.css';

const AboutTeacher = ({ tutorObject }) => {

    return (
        <div className="AboutTeacher">
            <div className="mt-3">
                <Card className="p-4 about-card">
                    <h4 className="section-title">Bio</h4>
                    <p className="section-content">{tutorObject?.description}</p>
                    <h4 className="section-title">Specialities Taught</h4>
                    <ul className="section-content">
                        {tutorObject?.specialities?.map((subject, index) => (
                            <li className='text-capitalize' key={index}>{subject}</li>
                        ))}
                    </ul>
                    <h4 className="section-title">Experience</h4>
                    <p className="section-content">{tutorObject?.experience}</p>
                </Card>
            </div>
        </div>
    );
};

export default AboutTeacher;