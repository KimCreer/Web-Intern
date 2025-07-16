import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../features/auth/Login';
import Signup from '../features/auth/Signup';
import Dashboard from '../features/dashboard/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
