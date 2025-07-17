import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import ProgressLog from '../intern/ProgressLog';
import SupervisorDashboard from '../supervisor/SupervisorDashboard';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { Box, Card, CardContent, Typography, Divider, Avatar, Container, AppBar, Toolbar, Button } from '@mui/material';

const NAVY_GRADIENT = 'linear-gradient(135deg, #0a2342 0%, #274472 100%)';
const NAVY = '#0a2342';
const NAVY_LIGHT = '#274472';

// Placeholder logo (replace with actual logo file if available)
const PLMUN_LOGO = 'https://s.yimg.com/zb/imgv1/b78a2d83-7709-3a13-a971-0109aa12560b/t_500x300';

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

  if (loading) return <Box sx={{ minHeight: '100vh', background: NAVY_GRADIENT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Typography color="#fff">Loading user info...</Typography></Box>;
  if (!user) return <Box sx={{ minHeight: '100vh', background: NAVY_GRADIENT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Typography color="#fff">No user found. Please log in again.</Typography></Box>;
  if (error) return <Box sx={{ minHeight: '100vh', background: NAVY_GRADIENT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Typography color="error.main">{error}</Typography></Box>;

  return (
    <Box sx={{ minHeight: '100vh', background: NAVY_GRADIENT }}>
      {/* Only show AppBar for supervisor and admin, not intern */}
      {role !== 'intern' && (
        <AppBar position="static" sx={{ background: NAVY, boxShadow: 3 }}>
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar src={PLMUN_LOGO} alt="PLMun Logo" sx={{ width: 48, height: 48, bgcolor: '#fff', border: '2px solid #f4f8fb', mr: 2 }} />
              <Box>
                <Typography variant="h6" fontWeight={700} letterSpacing={1} color="#fff" sx={{ lineHeight: 1 }}>
                  Pamantasan ng Lungsod ng Muntinlupa
                </Typography>
                <Typography variant="subtitle2" color="#f4f8fb" fontWeight={600} sx={{ fontSize: 15, letterSpacing: 1 }}>
                  College of Information Technology Studies (CITS)
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: { xs: 2, sm: 0 } }}>
              <Typography variant="body1" color="#fff" sx={{ mr: 2 }}>
                {user.email} ({role})
              </Typography>
              <Button variant="contained" onClick={handleLogout} sx={{ background: NAVY_LIGHT, color: '#fff', fontWeight: 600, borderRadius: 2, '&:hover': { background: NAVY } }}>
                Logout
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
      )}
      {role === 'intern' && (
        <ProgressLog />
      )}
      {role === 'supervisor' && (
        <Container maxWidth="lg" sx={{ py: 5 }}>
          <Card sx={{ p: 3, boxShadow: 6, borderRadius: 4, background: '#f4f8fb' }}>
            <CardContent>
              <Typography variant="h4" fontWeight={700} color={NAVY} gutterBottom>
                Supervisor Dashboard
              </Typography>
              <Typography variant="subtitle1" color={NAVY_LIGHT} sx={{ mb: 2 }}>
                Welcome to the CITS Web Intern Monitor, PLMun
              </Typography>
              <Divider sx={{ mb: 3, background: NAVY_LIGHT }} />
              <SupervisorDashboard />
            </CardContent>
          </Card>
        </Container>
      )}
      {role === 'admin' && (
        <Container maxWidth="lg" sx={{ py: 5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
            <Card sx={{ maxWidth: 480, width: '100%', boxShadow: 6, borderRadius: 4, p: 3, background: '#f4f8fb' }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: NAVY_LIGHT, width: 72, height: 72, mb: 2 }}>
                  <AdminPanelSettingsIcon fontSize="large" />
                </Avatar>
                <Typography variant="h4" fontWeight={700} color={NAVY} gutterBottom>
                  Admin Dashboard
                </Typography>
                <Typography variant="subtitle1" color={NAVY_LIGHT} sx={{ mb: 2 }}>
                  Welcome to the CITS Web Intern Monitor, PLMun
                </Typography>
                <Divider sx={{ width: '100%', mb: 2, background: NAVY_LIGHT }} />
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Manage users and view analytics here. More features coming soon!
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Container>
      )}
      <Box sx={{ width: '100%', textAlign: 'center', py: 2, background: NAVY, color: '#f4f8fb', fontWeight: 500, letterSpacing: 1, mt: 4 }}>
        Web Intern Monitor &copy; {new Date().getFullYear()} | College of Information Technology Studies (CITS), Pamantasan ng Lungsod ng Muntinlupa
      </Box>
    </Box>
  );
}

export default Dashboard; 