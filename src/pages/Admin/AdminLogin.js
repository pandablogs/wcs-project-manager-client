import React, { useState } from "react";
import { TextField, Typography, Box } from "@mui/material";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slices/userSlice";
import { toast } from "react-toastify";
import Loading from "react-fullscreen-loading";
import { useNavigate } from "react-router-dom";
import authServices from "../../services/authServices";
import logov1 from "../../assets/images/logo/wcs-pm.png";
import starSVG from "../../assets/svgs/star.svg";
import "../../components/common/Login.scss";


const AdminLogin = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [role, setRole] = useState("admin");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("All fields are required.");
            return;
        }

        if (!email.includes("@")) {
            setError("Please enter a valid email address.");
            return;
        }

        let payload = {
            email: email,
            password: password,
            role_type: role,
        };

        try {
            setIsLoading(true);
            const response = await authServices.login(payload);
            localStorage.setItem("_token", response?.token || "");
            dispatch(setUser(response.user));
            localStorage.setItem("role_type", role);
            toast.success("Login successful!");
            setTimeout(() => {
                navigate("/admin/dashboard");
                setIsLoading(false);
            }, 1500);
        } catch (error) {
            setIsLoading(false);
            toast.error("Login failed.");
            setError(error.response?.data?.message || "Login failed.");
        }
    };

    return (
        <div className="login-page">
            {/* <div className="login-left">
                <img className=' position-absolute star-svg' src={starSVG}></img>
                <div className="d-flex">
                    <img src={logov1} alt="Professional" className="login-image" />
                    <h3 className="logo-title pt-3 px-2 fw-bold ">Project Manager</h3>
                </div>
                <div className="ads-card">
                    <div className="row">
                        <div className="example-2 card">
                            <div className="wrapper">
                                <div className="header">
                                    <div className="date">
                                        <span className="day">12</span>
                                        <span className="month">Aug</span>
                                        <span className="year">2016</span>
                                    </div>

                                </div>
                                <div className="data">
                                    <div className="content">
                                        <h3 className="title">Project Planning & Scheduling</h3>
                                        <h3 className="title">Budgeting & Financial Management</h3>
                                        <h3 className="title">Cost estimation and tracking</h3>
                                        <h3 className="title">Automated scheduling & Gantt charts </h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="login-text">

                    <Typography className="login-title">
                        CONNECTING BRANDS TO AUDIENCE
                    </Typography>
                    <Typography className="login-description">
                        Empower Brands to create meaningful connections with audiences,
                        delivering impactful advertising experiences.
                    </Typography>
                </div>
            </div> */}


            <div className="login-right">
                <Box className="login-container" sx={{ maxWidth: "500px", margin: "84px auto", padding: "30px", borderRadius: "10px", backgroundColor: "#fff" }}>
                    <h1 className="login-header text-left" >
                        Login to Project Manager
                    </h1>
                    <p className="login-subtitle text-left mb-5">
                        Welcome back! Please enter your details.
                    </p>


                    {error && <Typography color="error" sx={{ marginBottom: "20px", textAlign: "center" }}>{error}</Typography>}
                    {/* <hr className="mt-5 mb-5 divied-line"></hr> */}

                    <form className="login-form mt-0" onSubmit={handleSubmit}>

                        <TextField
                            fullWidth
                            label="Email"
                            variant="outlined"
                            margin="normal"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            variant="outlined"
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <button
                            type="submit"
                            className="login-button"
                        >
                            Log in
                        </button>
                    </form>

                    {/* <p className="signup-link mt-4 fw-semibold text-center ">Don't have an account yet? <a href='/signup' onClick={() => navigate("/signup")}>Sign up now</a></p> */}
                    {/* <p className="signup-link mt-4 fw-semibold text-center ">Forget password? <a href='/forget-password' onClick={() => navigate("/forget-password")}>Reset now</a></p> */}
                </Box>

                <Typography variant="body2" className="login-footer" sx={{ textAlign: "center", marginTop: "20px", fontSize: "12px", color: "#666" }}>
                    © Project Manager 2025
                </Typography>
            </div>
            {isLoading && <Loading loading={true} loaderColor="#f18271" />}
        </div>
    );
};

export default AdminLogin;
