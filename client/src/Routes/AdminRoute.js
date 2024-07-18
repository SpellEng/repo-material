import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../Components/Auth/auth';

const AdminRoutes = ({ children }) => {
    return (isAuthenticated() && isAuthenticated()?.role === 2) ? children : <Navigate to="/login" />;
};

export default AdminRoutes;
