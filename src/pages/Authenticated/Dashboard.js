import React from 'react'
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearUser } from '../../redux/slices/userSlice';

const Dashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    const handleLogout = () => {
        dispatch(clearUser());
        localStorage.clear();
        navigate("/logout");
    };

    return (
        <div>
            <h1>Welcome, {user?.firstName} {user?.lastName}!</h1>
            <p>Email: {user?.email}</p>
            <p>Role: {user?.role_type}</p>
            <p>Role: {user?.role_type}</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Dashboard;