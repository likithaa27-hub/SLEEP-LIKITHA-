import React, { createContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

const AppContext = createContext();
export { AppContext };

const API_BASE = 'http://localhost:5000/api';

export const AppProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [session, setSession] = useState(() => {
    const saved = localStorage.getItem('jb_session');
    return saved ? JSON.parse(saved) : null;
  });

  // Global Location State
  const [userLocation, setUserLocation] = useState(null); // [lat, lng]
  const [locationStatus, setLocationStatus] = useState('idle'); // idle | loading | success | error
  const [locationError, setLocationError] = useState('');

  // Fetch Users
  const fetchUsers = useCallback(async () => {
    try {
      const resp = await fetch(`${API_BASE}/users`);
      const data = await resp.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  }, []);

  // Fetch Jobs
  const fetchJobs = useCallback(async () => {
    try {
      const resp = await fetch(`${API_BASE}/jobs`);
      const data = await resp.json();
      if (data.success) {
        // Map snake_case to camelCase
        const mappedJobs = data.jobs.map(j => ({
          ...j,
          employerId: j.employer_id,
          employerName: j.employer_name,
          workingHours: j.working_hours,
          lat: parseFloat(j.lat),
          lng: parseFloat(j.lng)
        }));
        setJobs(mappedJobs);
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    }
  }, []);

  // Fetch Applications
  const fetchApplications = useCallback(async () => {
    if (!session) return;
    try {
      const url = session.role === 'user'
        ? `${API_BASE}/applications?user_id=${session.id}`
        : `${API_BASE}/applications`;
      const resp = await fetch(url);
      const data = await resp.json();
      if (data.success) {
        // Map snake_case to camelCase
        const mappedApps = data.applications.map(a => ({
          ...a,
          jobId: a.job_id,
          userId: a.user_id,
          jobTitle: a.job_title,
          applicantName: a.applicant_name,
          coverMessage: a.cover_message
        }));
        setApplications(mappedApps);
      }
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    }
  }, [session]);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      setLocationStatus('error');
      toast.error('Geolocation is not supported by your browser.');
      return;
    }
    setLocationStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(coords);
        setLocationStatus('success');
        toast.success('📍 Location shared! Nearby jobs will be prioritized.');
      },
      (err) => {
        setLocationStatus('error');
        setLocationError(err.message || 'Unable to get location.');
        toast.error('Could not get your location: ' + err.message);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const clearLocation = () => {
    setUserLocation(null);
    setLocationStatus('idle');
    setLocationError('');
  };

  // Initial Load
  useEffect(() => {
    fetchJobs();
    fetchUsers();
  }, [fetchJobs, fetchUsers]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // Save session to local storage for persistence across reloads
  useEffect(() => {
    if (session) {
      localStorage.setItem('jb_session', JSON.stringify(session));
    } else {
      localStorage.removeItem('jb_session');
    }
  }, [session]);

  // Auth Helpers
  const login = async (email, password) => {
    try {
      const resp = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await resp.json();
      if (data.success) {
        setSession(data.user);
        return { success: true, user: data.user };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: 'Server connection failed.' };
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`);
    } catch (error) {
      console.error('Logout failed:', error);
    }
    setSession(null);
  };

  const register = async (userData) => {
    try {
      const isFormData = userData instanceof FormData;
      const options = {
        method: 'POST',
        body: isFormData ? userData : JSON.stringify(userData)
      };
      if (!isFormData) {
        options.headers = { 'Content-Type': 'application/json' };
      }

      const resp = await fetch(`${API_BASE}/auth/register`, options);
      const data = await resp.json();
      return data;
    } catch (error) {
      return { success: false, message: 'Server connection failed.' };
    }
  };

  // Job Application
  const applyForJob = async (jobId, coverMessage) => {
    if (!session) return { success: false, message: 'You must be logged in to apply.' };
    try {
      const resp = await fetch(`${API_BASE}/applications/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_id: jobId, user_id: session.id, cover_message: coverMessage })
      });
      const data = await resp.json();
      if (data.success) {
        fetchApplications(); // Refresh list
      }
      return data;
    } catch (error) {
      return { success: false, message: 'Server connection failed.' };
    }
  };

  // Job Management
  const createJob = async (jobData) => {
    try {
      const resp = await fetch(`${API_BASE}/jobs/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData)
      });
      const data = await resp.json();
      if (data.success) {
        fetchJobs(); // Refresh jobs list
      }
      return data;
    } catch (error) {
      return { success: false, message: 'Server connection failed.' };
    }
  };

  const updateApplicationStatus = async (appId, status) => {
    try {
      const resp = await fetch(`${API_BASE}/applications/update_status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: appId, status })
      });
      const data = await resp.json();
      if (data.success) {
        fetchApplications(); // Refresh applications list
      }
      return data;
    } catch (error) {
      return { success: false, message: 'Server connection failed.' };
    }
  };

  const updateUserStatus = async (userId, status) => {
    try {
      const resp = await fetch(`${API_BASE}/users/${userId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await resp.json();
      if (data.success) {
        fetchUsers();
      }
      return data;
    } catch (error) {
      return { success: false, message: 'Server connection failed.' };
    }
  };

  const updateProfile = async (userId, profileData) => {
    try {
      const resp = await fetch(`${API_BASE}/users/${userId}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      });
      const data = await resp.json();
      if (data.success) {
        // Update the local session so the user sees their own changes immediately
        if (session && session.id === userId) {
          setSession(prev => ({ ...prev, ...profileData }));
        }
        // Refresh the global users list so employers see the updated profile
        fetchUsers();
      }
      return data;
    } catch (error) {
      return { success: false, message: 'Server connection failed.' };
    }
  };

  return (
    <AppContext.Provider value={{
      users, setUsers,
      jobs, setJobs,
      applications, setApplications,
      session, setSession,
      login, logout, register,
      updateProfile,
      updateUserStatus,
      applyForJob,
      createJob,
      updateApplicationStatus,
      userLocation, locationStatus, locationError, requestLocation, clearLocation,
      refreshUsers: fetchUsers,
      refreshJobs: fetchJobs,
      refreshApplications: fetchApplications
    }}>
      {children}
    </AppContext.Provider>
  );
};
