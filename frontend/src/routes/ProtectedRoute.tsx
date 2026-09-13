import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const ProtectedRoute = () => {
    const { isLoggedIn, loading } = useAuth();

    // 2. Capture where the user was trying to go so we can redirect them back after they log in
    const location = useLocation();

    // 3. If not logged in, redirect to /login and preserve the intended destination in state
    // Wait for the refresh-cookie check before deciding that a user is logged out.
    if (loading) {
        return null;
    }

    if (!isLoggedIn) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 4. If logged in, render the child route (Dashboard, Transfers, KYC, etc.)
    return <Outlet />;
};

export default ProtectedRoute;
