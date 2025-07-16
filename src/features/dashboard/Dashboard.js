import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import ProgressLog from '../intern/ProgressLog';
import SupervisorDashboard from '../supervisor/SupervisorDashboard';
import '../../app/index.css';
import { Box, Card, CardContent, Typography, Divider, Avatar } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

function Dashboard() {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        setUser(firebaseUser);
        setLoading(false);
      });
      return () => unsubscribe();
    }, []);
  
    useEffect(() => {
      if (!user) return;
      setLoading(true);
      const fetchRole = async () => {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setRole(userDoc.data().role);
          } else {
            setError('User role not found.');
          }
        } catch (err) {
          setError('Failed to fetch user role.');
        } finally {
          setLoading(false);
        }
      };
      fetchRole();
    }, [user]);
  
    const handleLogout = async () => {
      await auth.signOut();
      navigate('/login');
    };
  
    if (loading) return <p>Loading user info...</p>;
    if (!user) return <p>No user found. Please log in again.</p>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;
  
    return (
      <div style={{ maxWidth: 1200, margin: 'auto', padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h2>Dashboard</h2>
            <p>Welcome, <b>{user.email}</b> ({role})</p>
          </div>
          <button onClick={handleLogout}>Logout</button>
        </div>
        <hr />
  
        {role === 'intern' && (
          <ProgressLog />
        )}
        
        {role === 'supervisor' && (
          <SupervisorDashboard />
        )}
        
        {role === 'admin' && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
            <Card sx={{ maxWidth: 420, width: '100%', boxShadow: 4, borderRadius: 3, p: 3 }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 72, height: 72, mb: 2 }}>
                  <AdminPanelSettingsIcon fontSize="large" />
                </Avatar>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  Admin Dashboard
                </Typography>
                <Divider sx={{ width: '100%', mb: 2 }} />
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Manage users and view analytics here. More features coming soon!
                </Typography>
              </CardContent>
            </Card>
          </Box>
        )}
      </div>
    );
  }
  
  export default Dashboard; 