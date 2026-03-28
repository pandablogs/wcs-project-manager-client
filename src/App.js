import React, { createContext, useEffect, useMemo, useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import AuthRouteMiddleware from "./middleware/AuthRouteMiddleware";
import NonAuthRouteMiddleware from "./middleware/NonAuthRouteMiddleware";
import AuthLayout from "./layouts/AuthLayout";
import Home from "./pages/Public/Home";
import Dashboard from "./pages/Authenticated/Dashboard";
import Login from "./pages/Public/Login";
import StaffLogin from "./pages/Staff/StaffLogin";
import AdminLogin from "./pages/Admin/AdminLogin";
import SignUp from "./pages/Public/SignUp";
import { ToastContainer } from 'react-toastify';
import ProjectManagerDashboard from "./pages/Staff/ProjectManagerDashboard"
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Profile from "./pages/Authenticated/Profile";
import ClientList from "./pages/Admin/ClientList";
import ProjectManagerList from "./pages/Admin/ProjectManagerList";
import ProjectList from "./pages/Admin/ProjectList";
import MaterialPage from "./pages/Admin/MaterialPage";
import Estimater from "./pages/Authenticated/Estimater";
import ForgetPassword from "./components/common/ForgetPassword";

import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import Category from "./pages/Admin/Category";
import MaterialDetails from "./pages/Admin/MaterialDetails";
import SubMaterialDetails from "./pages/Admin/SubMaterialDetails.js";
import MaterialList from "./pages/Admin/MaterialList";
import RehabGroups from "./pages/Admin/RehabGroups";

export const ThemeContext = createContext({
  theme: "light",
  setTheme: () => { },
});

export const LoadingContext = createContext({
  loading: false,
  setLoading: () => { },
});

const nonAuthRoutes = [
  { path: "/login", element: <Login /> },
  { path: "/project-manager-login", element: <StaffLogin /> },
  { path: "/admin-login", element: <AdminLogin /> },
  { path: "/signup", element: <SignUp /> },
  { path: "/forget-password", element: <ForgetPassword /> }
];

const authRoutes = [
  { path: "/user/dashboard", element: <Dashboard />, roles: ["user"] },
  { path: "/projectManager/dashboard", element: <ProjectManagerDashboard />, roles: ["project_manager"] },
  { path: "/admin/dashboard", element: <AdminDashboard />, roles: ["admin"] },
  { path: "/profile", element: <Profile />, roles: ["user", "project_manager", "admin"] },
  { path: "/admin/project-manager-list", element: <ProjectManagerList />, roles: ["admin"] },
  { path: "/materials", element: <MaterialPage />, roles: ["admin", "user"] },
  { path: "/material-list", element: <MaterialList />, roles: ["admin", "user", "project_manager"] },
  { path: "/rehab-groups", element: <RehabGroups />, roles: ["admin", "user"] },
  { path: "/category", element: <Category />, roles: ["admin", "user"] },
  { path: "/material/:id", element: <MaterialDetails />, roles: ["admin", "user"] },
  { path: "/material/:id/:matId", element: <SubMaterialDetails />, roles: ["admin", "user"] },
  { path: "/project-estimater", element: <Estimater />, roles: ["admin", "project_manager", "user"] },
  { path: "/project-estimater/:id", element: <Estimater />, roles: ["admin", "project_manager", "user"] },
  { path: "/project-list", element: <ProjectList />, roles: ["admin", "project_manager", "user"] },
  { path: "/client-list", element: <ClientList />, roles: ["admin", "project_manager"] }
];

const App = () => {
  const THEME_KEY = "wcs_theme";

  const getInitialTheme = () => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === "light" || saved === "dark") return saved;
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    } catch {
      return "light";
    }
  };

  const [theme, setTheme] = useState(getInitialTheme);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const themeValue = useMemo(() => ({ theme, setTheme }), [theme]);
  const loadingValue = useMemo(() => ({ loading, setLoading }), [loading]);

  return (
    <ThemeContext.Provider value={themeValue}>
      <LoadingContext.Provider value={loadingValue}>
        <Provider store={store}>
          <Router>
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
              <ToastContainer
                position="bottom-right"
                autoClose={1500}
                theme={theme === "dark" ? "dark" : "light"}
                toastClassName="!rounded-2xl !border-slate-200 !shadow-soft dark:!border-slate-800"
              />
              <Routes>
                {/* Non-Authenticated Routes */}
                {nonAuthRoutes.map(({ path, element }) => (
                  <Route
                    key={path}
                    path={path}
                    element={<NonAuthRouteMiddleware>{element}</NonAuthRouteMiddleware>}
                  />
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
                <Route
                  path="/"
                  element={<Home />}
                />
              </Routes>
            </div>
          </Router>
        </Provider>
      </LoadingContext.Provider>
    </ThemeContext.Provider>
  );
};

export default App;
