import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import {
  Container,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Avatar,
  Box,
  Alert
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import GoogleIcon from '@mui/icons-material/Google';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const allowedDomain = '@plmun.edu.ph';

    const handleGoogleLogin = async () => {
      setError('');
      setLoading(true);
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        const userEmail = result.user.email;
        if (!userEmail.endsWith(allowedDomain)) {
          setError('Please use your institutional email (@plmun.edu.ph) to log in.');
          await auth.signOut();
          setLoading(false);
          return;
        }
        // Check if user document exists in Firestore
        const userRef = doc(db, 'users', result.user.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          let assignedRole = 'intern';
          if (userEmail.toLowerCase().includes('supervisor')) {
            assignedRole = 'supervisor';
          }
          await setDoc(userRef, {
            email: userEmail,
            role: assignedRole,
            createdAt: new Date()
          });
        }
        navigate('/dashboard');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      setLoading(true);
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (!userCredential.user.emailVerified) {
          setError('Please verify your email before logging in. Check your inbox for a verification link.');
          await auth.signOut();
          setLoading(false);
          return;
        }
        navigate('/dashboard');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    return (
      <Box sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #a18cd1 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Container maxWidth="sm">
          <Card sx={{ p: 4, boxShadow: 10, borderRadius: 4, border: '2px solid #7b1fa2', position: 'relative' }}>
            {/* Header Banner */}
            <Box sx={{
              width: '100%',
              background: 'linear-gradient(90deg, #7b1fa2 0%, #512da8 100%)',
              color: 'white',
              borderRadius: 2,
              py: 2,
              mb: 3,
              textAlign: 'center',
              boxShadow: 2,
            }}>
              <Typography variant="h5" fontWeight={700} letterSpacing={2}>
                Welcome to Web Intern Monitor
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.85 }}>
                Please sign in to continue
              </Typography>
            </Box>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main', width: 64, height: 64, boxShadow: 3 }}>
                <LockOutlinedIcon fontSize="large" />
              </Avatar>
              <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
                Sign In
              </Typography>
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, width: '100%' }}>
                <TextField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                  autoFocus
                />
                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                />
                {error && (
                  <Alert severity="error" sx={{ mt: 2, mb: 1 }}>{error}</Alert>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  fullWidth
                  size="large"
                  sx={{ mt: 2, mb: 1, borderRadius: 2, fontWeight: 700, letterSpacing: 1 }}
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </Box>
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                startIcon={<GoogleIcon />}
                sx={{ mt: 2, borderRadius: 2, textTransform: 'none', fontWeight: 600, borderWidth: 2 }}
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                Sign in with Google
              </Button>
              <Typography variant="body2" sx={{ mt: 2 }}>
                Don&apos;t have an account? <a href="/signup" style={{ color: '#7b1fa2', textDecoration: 'none', fontWeight: 500 }}>Sign up</a>
              </Typography>
            </CardContent>
            {/* Footer */}
            <Box sx={{
              position: 'absolute',
              bottom: 8,
              left: 0,
              width: '100%',
              textAlign: 'center',
              color: '#7b1fa2',
              fontWeight: 600,
              fontSize: 14,
              opacity: 0.8
            }}>
              Design Updated July 2025
            </Box>
          </Card>
        </Container>
      </Box>
    );
  }
  
  export default Login; 