import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute: React.FC = () => {
    // 1. Check if the user is authenticated (e.g., check for a token in localStorage)
    const token = localStorage.getItem("access_token");
    const isAuthenticated = Boolean(token);

    // 2. Capture where the user was trying to go so we can redirect them back after they log in
    const location = useLocation();

    // 3. If not logged in, redirect to /login and preserve the intended destination in state
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 4. If logged in, render the child route (Dashboard, Transfers, KYC, etc.)
    return <Outlet />;
};

export default ProtectedRoute;
