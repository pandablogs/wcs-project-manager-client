import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button, Typography } from "@mui/material";
import "../../components/common/SignUp.scss";
import authServices from '../../services/authServices';
import { toast } from 'react-toastify';
import Loading from 'react-fullscreen-loading';


const SignUp = () => {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [role, setRole] = useState("user");
    const [isLoading, setIsLoading] = useState(false)


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!firstName || !lastName || !phone || !email || !password || !confirmPassword) {
            setError("All fields are required.");
            return;
        }

        if (!email.includes("@")) {
            setError("Please enter a valid email address.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        let payload = {
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            email: email,
            password: password,
            role_type: role,
        }

        try {
            setIsLoading(true)
            const response = await authServices.signup(payload);
            console.log("User Signed Up:", response);
            toast.success("Sign-up successful!");
            setTimeout(() => {
                navigate("/login");
            }, 1000);
            setIsLoading(false)

        } catch (error) {
            setIsLoading(false)
            setError(error.response?.data?.message || "Signup failed.");
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-box">
                <div className="signup-left">
                    <Typography variant="h5" gutterBottom>
                        Create Account
                    </Typography>
                    <div className="social-login">
                        <button className="social-btn">F</button>
                        <button className="social-btn">G+</button>
                        <button className="social-btn">in</button>
                    </div>
                    <Typography variant="body2">or use your email for registration</Typography>
                    {error && <Typography color="error">{error}</Typography>}
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="First Name"
                            variant="outlined"
                            margin="normal"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            label="Last Name"
                            variant="outlined"
                            margin="normal"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            label="Phone Number"
                            variant="outlined"
                            margin="normal"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
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
                        <TextField
                            fullWidth
                            label="Confirm Password"
                            type="password"
                            variant="outlined"
                            margin="normal"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <Button variant="contained" color="primary" type="submit" fullWidth className="sign-up-btn">
                            Sign Up
                        </Button>
                    </form>
                </div>
                <div className="signup-right">
                    <Typography variant="h5">Welcome Back!</Typography>
                    <Typography variant="body2">
                        To keep connected with us, please login with your personal info
                    </Typography>
                    <Button
                        variant="contained"
                        color="secondary"
                        className="sign-in-btn"
                        onClick={() => navigate("/login")}
                    >
                        Sign In
                    </Button>
                </div>
            </div>
            {isLoading && <Loading loading={true} loaderColor="linear-gradient(to top, #3f51b1 0%, #5a55ae 13%, #7b5fac 25%, #8f6aae 38%, #a86aa4 50%, #cc6b8e 62%, #f18271 75%, #f3a469 87%, #f7c978 100%)" />}
        </div>
    );
};

export default SignUp;
