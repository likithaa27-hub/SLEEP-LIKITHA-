import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Navigation from './components/Navigation';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import UserDashboard from './pages/UserDashboard';
import UserProfile from './pages/UserProfile';
import JobListingPage from './pages/JobListingPage';
import NearbyJobsPage from './pages/NearbyJobsPage';
import MyApplicationsPage from './pages/MyApplicationsPage';
import CompanyProfile from './pages/CompanyProfile';




// Dashboard layout showing Navigation
const DashboardLayout = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navigation />
      <main className="flex-grow-1 container mt-4 mb-5">
        <Outlet />
      </main>
    </div>
  );
};

// Raw layout for Home, Login, Register
const RawLayout = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Full Screen Pages without Dashboard Nav */}
        <Route element={<RawLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Dashboard Pages WITH Navigation */}
        <Route element={<DashboardLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/employer" element={<EmployerDashboard />} />
          <Route path="/user" element={<UserDashboard />} />
          <Route path="/jobs" element={<JobListingPage />} />
          <Route path="/nearby" element={<NearbyJobsPage />} />
          <Route path="/my-applications" element={<MyApplicationsPage />} />
          <Route path="/company/:id" element={<CompanyProfile />} />
          <Route path="/profile" element={<UserProfile />} />



        </Route>
      </Routes>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </Router>
  );
}

export default App;
