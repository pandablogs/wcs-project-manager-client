import { Navigate } from "react-router-dom";
import { isTokenValid, getUserRole } from "../utils/helpers";

const AuthRouteMiddleware = ({ children, roles }) => {
    const userRole = getUserRole();

    if (!isTokenValid()) {
        return <Navigate to="/login" replace />;
    }

    if (!userRole || !roles.includes(userRole)) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default AuthRouteMiddleware;