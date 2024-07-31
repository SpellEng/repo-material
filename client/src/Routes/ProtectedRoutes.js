import axios from 'axios';
import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { isAuthenticated, logout } from '../Components/Auth/auth';

const ProtectedRoutes = ({ children }) => {
    useEffect(() => {
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/verify-token`, {
            token: localStorage.getItem("token")
        }, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        }).then(res => {
            if (res.status === 200) {

            } else {
                logout();
                document.location.reload();
            }
        }).catch(err => {
            console.log(err);
        })

        return () => {

        }
    }, [])

    return isAuthenticated() ? children : <Navigate to="/login" />;
};

export default ProtectedRoutes;
