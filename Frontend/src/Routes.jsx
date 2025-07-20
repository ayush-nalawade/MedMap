import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import LoginScreen from "pages/login-screen";
import RegisterScreen from "pages/register-screen";
import ConsultantProfile from "pages/consultant-profile";
import Dashboard from "pages/dashboard";
import ConsultantManagement from "pages/consultant-management";
import DoctorManagement from "pages/doctor-management";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/login-screen" element={<LoginScreen />} />
        <Route path="/register-screen" element={<RegisterScreen />} />
        <Route path="/consultant-profile" element={<ConsultantProfile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/consultant-management" element={<ConsultantManagement />} />
        <Route path="/doctor-management" element={<DoctorManagement />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;