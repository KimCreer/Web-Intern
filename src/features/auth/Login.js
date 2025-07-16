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
        background: 'linear-gradient(135deg, #e3f2fd 0%, #90caf9 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Container maxWidth="sm">
          <Card sx={{ p: 4, boxShadow: 6, borderRadius: 3 }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 56, height: 56 }}>
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
                  color="primary"
                  fullWidth
                  size="large"
                  sx={{ mt: 2, mb: 1, borderRadius: 2 }}
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </Box>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                startIcon={<GoogleIcon />}
                sx={{ mt: 2, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                Sign in with Google
              </Button>
              <Typography variant="body2" sx={{ mt: 2 }}>
                Don&apos;t have an account? <a href="/signup" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 500 }}>Sign up</a>
              </Typography>
            </CardContent>
          </Card>
        </Container>
      </Box>
    );
  }
  
  export default Login; 