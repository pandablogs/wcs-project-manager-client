import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "react-fullscreen-loading";
import authServices from "../../services/authServices";

import "./Login.scss";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const roleParam = urlParams.get('role');
    if (roleParam) {
      setRole(roleParam);
    }
  }, []);

  const validateEmail = (email) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      toast.error("Invalid email format");
      return;
    }
    setLoading(true);
    try {
      const response = await authServices.forgotPassword({ email, role });
      toast.success(response.message);
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forget-password-main">
      {loading && <Loading loading background="#00000080" loaderColor="#ffffff" />}
      <Box className="forget-password-container">
        <Box className="forget-password-box my-auto">
          <Typography variant="h5" className="forget-password-title">
            Reset Your Password
          </Typography>
          <Typography variant="body2" className="forget-password-text">
            Enter the email associated with your account and we’ll send you
            password reset instructions.
          </Typography>
          <TextField
            fullWidth
            label="Your Email"
            variant="outlined"
            className="mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            fullWidth
            variant="contained"
            className="forget-password-button mb-2"
            onClick={handleSubmit}
          >
            Send Reset Instructions
          </Button>
          <Link to="/login" className="forget-password-link">
            Return to Sign In
          </Link>
        </Box>
        <Typography
          variant="body2"
          className="login-footer"
          sx={{ textAlign: "center", marginBlockStart: "auto", fontSize: "12px", color: "#666" }}
        >
          © Project Manager 2025
        </Typography>
      </Box>
    </div>
  );
};

export default ForgetPassword;
