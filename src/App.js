import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { CssBaseline, Container } from "@mui/material";
import store from "./redux/store";
import AuthRouteMiddleware from "./middleware/AuthRouteMiddleware";
import NonAuthRouteMiddleware from "./middleware/NonAuthRouteMiddleware";
import AuthLayout from "./layouts/AuthLayout";
import NonAuthLayout from "./layouts/NonAuthLayout";
import Home from "./pages/Public/Home";
import Dashboard from "./pages/Authenticated/Dashboard";
import Login from "./pages/Public/Login";
import StaffLogin from "./pages/Staff/StaffLogin";
import AdminLogin from "./pages/Admin/AdminLogin";
import SignUp from "./pages/Public/SignUp";
import { ToastContainer } from 'react-toastify';
import ProjectManagerDashboard from "./pages/Staff/ProjectManagerDashboard"
import AdminDashboard from "./pages/Admin/AdminDashboard";
import LogoutPage from "./components/LogoutPage";
import Profile from "./pages/Authenticated/Profile";
import ProjectManagerList from "./pages/Admin/ProjectManagerList";
import ProjectList from "./pages/Admin/ProjectList";
import MaterialPage from "./pages/Admin/MaterialPage";
import Estimater from "./pages/Authenticated/Estimater";
import ForgetPassword from "./components/common/ForgetPassword";

import "bootstrap/dist/css/bootstrap.min.css";
import './App.css'
import Category from "./pages/Admin/Category";
const nonAuthRoutes = [
  { path: "/login", element: <Login /> },
  { path: "/project-manager-login", element: <StaffLogin /> },
  { path: "/admin-login", element: <AdminLogin /> },
  { path: "/signup", element: <SignUp /> },
  { path: "/logout", element: <LogoutPage /> },
  { path: "/forget-password", element: <ForgetPassword /> }
];

const authRoutes = [
  { path: "/user/dashboard", element: <Dashboard />, roles: ["user"] },
  { path: "/projectManager/dashboard", element: <ProjectManagerDashboard />, roles: ["project_manager"] },
  { path: "/admin/dashboard", element: <AdminDashboard />, roles: ["admin"] },
  { path: "/profile", element: <Profile />, roles: ["user", "project_manager", "admin"] },
  { path: "/admin/project-manager-list", element: <ProjectManagerList />, roles: ["admin"] },
  { path: "/materials", element: <MaterialPage />, roles: ["admin", "user"] },
  { path: "/category", element: <Category />, roles: ["admin", "user"] },
  { path: "/project-estimater", element: <Estimater />, roles: ["admin", "project_manager", "user"] },
  { path: "/project-estimater/:id", element: <Estimater />, roles: ["admin", "project_manager", "user"] },
  { path: "/project-list", element: <ProjectList />, roles: ["admin", "project_manager", "user"] }
];
const App = () => {

  return (
    <Provider store={store}>
      <CssBaseline />
      <Router>
        <div>
          <ToastContainer
            position="bottom-right"
            autoClose={1500}
            theme="colored"
          />
          <Routes>
            {/* Non-Authenticated Routes */}
            {nonAuthRoutes.map(({ path, element }) => (
              <Route key={path} path={path} element={
                <NonAuthRouteMiddleware>{element}</NonAuthRouteMiddleware>
              } />
            ))}

            {/* Authenticated Routes */}
            <Route>
              {authRoutes.map(({ path, element, roles }) => (
                <Route
                  key={path}
                  path={path}
                  element={
                    <AuthRouteMiddleware roles={roles}>
                      <AuthLayout>{element}</AuthLayout>
                    </AuthRouteMiddleware>
                  }
                />
              ))}
            </Route>

            {/* Public Route (Home) */}
            <Route path="/" element={
              // <NonAuthLayout>
              <Home />
              // </NonAuthLayout>
            }
            />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
};

export default App;
