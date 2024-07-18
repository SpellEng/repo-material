import React from 'react';
import { Card, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './AboutTeacher.css';

const AboutTeacher = ({ tutorObject }) => {
    // Example teacher data
    // const tutorObject? = {
    //     name: 'John Doe',
    //     avatar: null,
    //     bio: 'John Doe has over 10 years of experience teaching mathematics and science. He is passionate about helping students understand complex concepts and achieve their academic goals.',
    //     subjects: ['Mathematics', 'Science', 'Physics'],
    //     experience: '10 years',
    //     email: 'john.doe@example.com',
    //     phone: '+1234567890',
    //     location: 'New York, USA',
    // };

    return (
        <div className="AboutTeacher">
            <div className="mt-3">
                <Card className="p-4 about-card">
                    <h4 className="section-title">Bio</h4>
                    <p className="section-content">{tutorObject?.description}</p>
                    <h4 className="section-title">Subjects Taught</h4>
                    <ul className="section-content">
                        {tutorObject?.specialities?.map((subject, index) => (
                            <li className='text-capitalize' key={index}>{subject}</li>
                        ))}
                    </ul>
                    <h4 className="section-title">Experience</h4>
                    <p className="section-content">{tutorObject?.experience}</p>
                    <h4 className="section-title">Contact Information</h4>
                    <p className="section-content contact-info">
                        Email: <a href={`mailto:${tutorObject?.email}`}>{tutorObject?.email}</a>
                    </p>
                    <p className="section-content contact-info">
                        Phone: <a href={`tel:${tutorObject?.phoneNumber}`}>{tutorObject?.phoneNumber}</a>
                    </p>
                    <h4 className="section-title">Location</h4>
                    <p className="section-content">{tutorObject?.address}, {tutorObject?.city}</p>
                </Card>
            </div>
        </div>
    );
};

export default AboutTeacher;