import { Navigate } from "react-router-dom";
import { isTokenValid, getUserRole } from "../utils/helpers";

const NonAuthRouteMiddleware = ({ children }) => {
    const roleType = getUserRole();

    if (isTokenValid() && roleType) {
        if (roleType === "user") {
            return <Navigate to="/user/dashboard" replace />;
        } else if (roleType === "project_manager") {
            return <Navigate to="/projectManager/dashboard" replace />;
        } else if (roleType === "admin") {
            return <Navigate to="/admin/dashboard" replace />;
        }
    }

    return children;
};

export default NonAuthRouteMiddleware;
