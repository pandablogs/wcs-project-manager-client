import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import authServices from "../../services/authServices";
import { TextField, Button, Container, Typography, Box, CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import Loading from "react-fullscreen-loading";

export const ResetPassword = () => {
    const { token } = useParams();
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await authServices.resetPassword({ token, password });

            toast.success("Password reset successfully! Redirecting...");

            setTimeout(() => {
                if (response.role === "user") {
                    navigate("/login");
                } else if (response.role === "project_manager") {
                    navigate("/project-manager-login");
                } else if (response.role === "admin") {
                    navigate("/admin-login");
                } else {
                    navigate("/login"); // Fallback
                }
            }, 2000);
        } catch (error) {
            toast.error("Failed to reset password. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <Container maxWidth="sm">
            <Box textAlign="center" mt={5} p={4} boxShadow={3} borderRadius={2} bgcolor="white">
                <Typography variant="h4" gutterBottom>
                    Reset Password
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Enter new password"
                        type="password"
                        variant="outlined"
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={loading}
                        sx={{ mt: 2 }}
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                        {loading ? "Resetting..." : "Reset Password"}
                    </Button>
                </form>
            </Box>
            {loading && <Loading loading background="rgba(0, 0, 0, 0.5)" loaderColor="#fff" />}
        </Container>
    );
};
