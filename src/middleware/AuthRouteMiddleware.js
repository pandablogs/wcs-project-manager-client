import { Navigate } from "react-router-dom";
import { isTokenValid } from "../utils/helpers"; // Import the token validation function

const AuthRouteMiddleware = ({ children, roles }) => {
    const userRole = localStorage.getItem("role_type"); // Get the user's role from localStorage

    if (!isTokenValid()) {
        return <Navigate to="/login" replace />;
    }

    // Check if the user's role is included in the allowed roles
    if (!roles.includes(userRole)) {
        return <Navigate to="/login" replace />; // Redirect to an unauthorized page or a default route
    }

    return children;
};

export default AuthRouteMiddleware;