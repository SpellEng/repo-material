import React from 'react'
import Navbar from '../../Components/Navbar/Navbar';

export const StudentLayout = (props) => {
    const linksArray = [
        {
            title: "All Tutors",
            link: "/all-tutors"
        },
        {
            title: "Upcoming Sessions",
            link: "/student/upcoming-classes"
        },
        {
            title: "Profile setting",
            link: "/student/profile"
        },
    ];

    return (
        <div>
            {
                props.navbar ?
                    <div>
                        <Navbar tutorLayout linksArray={linksArray} />
                        <div>
                            {props.children}
                        </div>

                    </div>
                    :
                    props.children
            }

        </div>
    )
}
