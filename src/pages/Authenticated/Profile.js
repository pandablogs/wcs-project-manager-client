import React, { useEffect, useState } from "react";
import userServices from "../../services/userServices";
import authServices from "../../services/authServices";
import {
    Container,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Tabs,
    Tab,
    Box,
    InputAdornment, IconButton
} from "@mui/material";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import Loading from "react-fullscreen-loading";

const Profile = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [tabIndex, setTabIndex] = useState(0);
    const [role, setRole] = useState('');
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setIsLoading(true);
            const response = await userServices.getProfile();
            setFormData({
                firstName: response.user.firstName || "",
                lastName: response.user.lastName || "",
                email: response.user.email || "",
                phone: response.user.phone || "",
            });
            setRole(response.user.role_type)
        } catch (error) {
            toast.error("Failed to fetch profile. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const togglePasswordVisibility = (field) => {
        setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const handleUpdateProfile = async () => {
        try {
            setIsLoading(true);
            const response = await userServices.updateProfile(formData);
            toast.success(response.message);
        } catch (error) {
            toast.error("Failed to update profile.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New password and confirm password do not match.");
            return;
        }

        try {
            setIsLoading(true);
            const response = await authServices.changePassword(passwordData);
            toast.success(response.message);
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (error) {
            toast.error("Failed to change password.");
        } finally {
            setIsLoading(false);
        }
    };

    const isPasswordMatch = passwordData.newPassword === passwordData.confirmPassword;


    return (
        <div className="mt-4">
            <div className="card shadow-sm">
                <div className="card-body">
                    <h6 className="mb-3">Profile</h6>

                    {/* MUI Tabs for Navigation */}
                    <Tabs
                        value={tabIndex}
                        onChange={(e, newValue) => setTabIndex(newValue)}
                        indicatorColor="primary"
                        textColor="primary"
                    >
                        <Tab label="General" />
                        <Tab label="Change Password" />
                    </Tabs>

                    <Box className="mt-3">
                        {tabIndex === 0 && (
                            <div>
                                <h6>General Information</h6>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label htmlFor="firstName">First Name *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="firstName"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label htmlFor="lastName">Last Name *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="lastName"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label htmlFor="email">Email Address *</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label htmlFor="phone">Phone Number *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <button
                                    className="btn btn-warning text-white mt-2"
                                    style={{ backgroundColor: "rgb(217, 180, 81)" }}
                                    onClick={handleUpdateProfile}
                                >
                                    Update
                                </button>
                            </div>
                        )}


                        {tabIndex === 1 && (
                            <div>
                                <h6>Change Password</h6>
                                <div className="row">
                                    <div className="form-group mb-3 col-6">
                                        <label htmlFor="currentPassword">Current Password</label>
                                        <div className="input-group">
                                            <input
                                                type={showPassword.current ? "text" : "password"}
                                                className="form-control"
                                                id="currentPassword"
                                                name="currentPassword"
                                                value={passwordData.currentPassword}
                                                onChange={handlePasswordChange}
                                            />
                                            <div className="input-group-text">
                                                {showPassword.current ? <FaEyeSlash
                                                    className="eye-icon"
                                                    onClick={() => togglePasswordVisibility("current")}
                                                    style={{ cursor: "pointer" }}
                                                /> : <FaEye
                                                    className="eye-icon"
                                                    onClick={() => togglePasswordVisibility("current")}
                                                    style={{ cursor: "pointer" }}
                                                />}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group mb-3 col-6">
                                        <label htmlFor="newPassword">New Password</label>
                                        <div className="input-group">
                                            <input
                                                type={showPassword.new ? "text" : "password"}
                                                className="form-control"
                                                id="newPassword"
                                                name="newPassword"
                                                value={passwordData.newPassword}
                                                onChange={handlePasswordChange}
                                            />
                                            <div className="input-group-text">
                                                {showPassword.new ? <FaEyeSlash
                                                    className="eye-icon"
                                                    onClick={() => togglePasswordVisibility("new")}
                                                    style={{ cursor: "pointer" }}
                                                /> : <FaEye
                                                    className="eye-icon"
                                                    onClick={() => togglePasswordVisibility("new")}
                                                    style={{ cursor: "pointer" }}
                                                />}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group mb-3 col-6">
                                        <label htmlFor="confirmPassword">Confirm Password</label>
                                        <div className="input-group">
                                            <input
                                                type={showPassword.confirm ? "text" : "password"}
                                                className={`form-control ${!isPasswordMatch && passwordData.confirmPassword.length > 0 ? "is-invalid" : ""}`}
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                value={passwordData.confirmPassword}
                                                onChange={handlePasswordChange}
                                            />
                                            <div className="input-group-text">
                                                {showPassword.confirm ? <FaEyeSlash
                                                    className="eye-icon"
                                                    onClick={() => togglePasswordVisibility("confirm")}
                                                    style={{ cursor: "pointer" }}
                                                /> : <FaEye
                                                    className="eye-icon"
                                                    onClick={() => togglePasswordVisibility("confirm")}
                                                    style={{ cursor: "pointer" }}
                                                />}
                                            </div>
                                            {!isPasswordMatch && passwordData.confirmPassword.length > 0 && (
                                                <div className="invalid-feedback">Passwords do not match</div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    className="btn btn-warning"
                                    onClick={() => handleChangePassword()}
                                    disabled={!isPasswordMatch || !passwordData.newPassword || !passwordData.currentPassword}
                                    style={{ backgroundColor: "rgb(217, 180, 81)", color: "white" }}
                                >
                                    Change Password
                                </button>
                            </div>

                        )}
                    </Box>
                </div>
            </div>

            {/* Loading Spinner */}
            {isLoading && <Loading loading={true} loaderColor="#f18271" />}
        </div>
    );
};

export default Profile;
