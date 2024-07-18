import React from 'react'
import Navbar from '../../Components/Navbar/Navbar';

export const TeacherLayout = (props) => {

    return (
        <div>
            {
                props.navbar ?
                    <div>
                        <Navbar tutorLayout />
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
