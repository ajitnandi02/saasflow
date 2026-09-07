import { Navigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext.jsx";


// ==========================================
// PROTECTED ROUTE
// ==========================================

const ProtectedRoute = ({ children }) => {

    const {
        isAuthenticated,
        loading,
    } = useAuth();


    // ======================================
    // CHECK AUTH LOADING
    // ======================================

    if (loading) {
        return (
            <div>
                <h2>Loading...</h2>
            </div>
        );
    }


    // ======================================
    // CHECK AUTHENTICATION
    // ======================================

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }


    // ======================================
    // AUTHENTICATED USER
    // ======================================

    return children;
};


export default ProtectedRoute;