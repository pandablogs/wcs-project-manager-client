import { Box, Button, TextField, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const ForgetPassword = () => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          backgroundColor: "#f9f9f9",
          px: 2,
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 400,
            backgroundColor: "#fff",
            p: 4,
            borderRadius: 2,
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
            Reset Your Password
          </Typography>
          <Typography variant="body2" sx={{ color: "gray", mb: 4 }}>
            Enter the email associated with your account and we’ll send you
            password reset instructions.
          </Typography>
          <TextField
            fullWidth
            label="Your Email"
            variant="outlined"
            sx={{ mb: 3 }}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{
              textTransform: "none",
              backgroundColor: "rgb(217, 180, 81)",
              // ':hover': { backgroundColor: '#6936d6' },
              mb: 2,
            }}
          >
            Send Reset Instructions
          </Button>
          <Link href="#" variant="body2" sx={{ color: "#7c4dff" }}>
            Return to Sign In
          </Link>
        </Box>
      </Box>
    </>
  );
};

export default ForgetPassword;
