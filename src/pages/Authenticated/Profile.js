import React, { useEffect, useState } from "react";
import userServices from "../../services/userServices";
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
} from "@mui/material";
import { toast } from "react-toastify";
import Loading from "react-fullscreen-loading";

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
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
    } catch (error) {
      toast.error("Failed to fetch profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
                <div className="form-group mb-3">
                  <label htmlFor="currentPassword">Current Password *</label>
                  <input
                    type="password"
                    className="form-control"
                    id="currentPassword"
                    name="currentPassword"
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="newPassword">New Password *</label>
                  <input
                    type="password"
                    className="form-control"
                    id="newPassword"
                    name="newPassword"
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="confirmPassword">Confirm Password *</label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    name="confirmPassword"
                  />
                </div>

                <button
                  className="btn btn-warning text-white mt-2"
                  style={{ backgroundColor: "rgb(217, 180, 81)" }}
                  onClick={handleUpdateProfile}
                >
                  Change Password
                </button>
              </div>
            )}
          </Box>
        </div>
      </div>

      {/* Loading Spinner */}
      {isLoading && <div>Loading...</div>}
    </div>
  );
};

export default Profile;
