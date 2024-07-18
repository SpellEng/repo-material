import React from 'react'
import { Link, useLocation } from "react-router-dom";
import { logout } from '../../Components/Auth/auth';
import { HomeIcon, LogOutIcon, SchoolIcon, UserCogIcon, UserPenIcon } from 'lucide-react';

const AdminSidebar = () => {
    const location = useLocation();

    return (
        <div className='AdminSidebar py-4'>
            <div>
                <div className='mt-8 relative'>
                    <div>
                        <Link to="/admin/dashboard">
                            <button className={`btn ${location.pathname === "/admin/dashboard" ? "activeLink" : ""}`}>
                                <HomeIcon />
                                <span>Dashboard</span>
                            </button>
                        </Link>
                    </div>
                    <div>
                        <Link to="/admin/students">
                            <button className={`btn ${location.pathname === "/admin/students" ? "activeLink" : ""}`}>
                                <UserPenIcon />
                                <span>Students</span>
                            </button>
                        </Link>
                    </div>
                    <div>
                        <Link to="/admin/tutors">
                            <button className={`btn ${location.pathname === "/admin/tutors" ? "activeLink" : ""}`}>
                                <UserCogIcon />
                                <span>Tutors</span>
                            </button>
                        </Link>
                    </div>
                    <div>
                        <Link to="/admin/classes">
                            <button className={`btn ${location.pathname === "/admin/classes" ? "activeLink" : ""}`}>
                                <SchoolIcon />
                                <span>Classes</span>
                            </button>
                        </Link>
                    </div>
                </div>
                <div>
                    <a href="/login" onClick={logout}>
                        <button className='btn'>
                            <LogOutIcon />
                            <span>Logout</span>
                        </button>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default AdminSidebar
