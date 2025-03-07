import React from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from '../../redux/slices/userSlice';

const ProjectManagerDashboard = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('_token');
        localStorage.removeItem('role_type');
        setTimeout(() => {
            navigate('/'); // Use navigate() to redirect
        }, 100)
    }
    return (
        <div>
            <h1>Project Manager Dashboard</h1>

            <>
                <h1>Welcome</h1>
            </>

            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default ProjectManagerDashboard;
