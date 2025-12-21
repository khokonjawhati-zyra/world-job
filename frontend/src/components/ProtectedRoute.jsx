import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const location = useLocation();
    const userStr = localStorage.getItem('user');

    if (!userStr) {
        // Not logged in
        if (location.pathname.startsWith('/admin')) {
            return <Navigate to="/admin-login" replace />;
        }
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    try {
        const user = JSON.parse(userStr);
        // Allow ADMIN to access everything (Superuser)
        if (user.role !== 'ADMIN' && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
            // Role not authorized
            // Redirect to their appropriate dashboard if possible, or home
            let target = '/';
            if (user.role === 'WORKER') target = '/worker';
            if (user.role === 'EMPLOYER') target = '/employer';
            if (user.role === 'INVESTOR') target = '/investor';
            if (user.role === 'ADMIN') target = '/admin';

            // Prevent infinite loop if they are already there?
            // Actually, if we are here, it means they tried to access a route they aren't allowed to.
            // So redirecting them to their dashboard is safe.
            return <Navigate to={target} replace />;
        }
        return children;
    } catch (e) {
        // JSON parse error
        localStorage.removeItem('user');
        return <Navigate to="/auth" replace />;
    }
};

export default ProtectedRoute;
