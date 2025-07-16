import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth, db } from '../../services/firebase';
import { doc, setDoc } from 'firebase/firestore';
import {
  Container,
  Card,
  CardContent,
  Avatar,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';


function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('intern');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
  
    const allowedDomain = '@plmun.edu.ph';

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      setSuccess('');
      setLoading(true);
      if (!email.endsWith(allowedDomain)) {
        setError('Please use your institutional email (@plmun.edu.ph) to sign up.');
        setLoading(false);
        return;
      }
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Store user role in Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email,
          role,
          createdAt: new Date()
        });
        // Send verification email
        await sendEmailVerification(userCredential.user);
        setSuccess('Verification email sent! Please check your inbox and verify your email before logging in.');
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
  
    return (
      <Box sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a2342 0%, #274472 100%)', // navy blue gradient
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Container maxWidth="sm">
          <Card sx={{ p: 4, boxShadow: 10, borderRadius: 4, border: '2px solid #274472', position: 'relative', background: '#f4f8fb' }}>
            {/* Header Banner */}
            <Box sx={{
              width: '100%',
              background: 'linear-gradient(90deg, #274472 0%, #0a2342 100%)',
              color: 'white',
              borderRadius: 2,
              py: 2,
              mb: 3,
              textAlign: 'center',
              boxShadow: 2,
            }}>
              <Typography variant="h5" fontWeight={700} letterSpacing={2}>
                Create Your Account
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.85 }}>
                Sign up to get started
              </Typography>
            </Box>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar sx={{ m: 1, bgcolor: '#274472', width: 64, height: 64, boxShadow: 3 }}>
                <PersonAddAlt1Icon fontSize="large" />
              </Avatar>
              <Typography variant="h4" component="h1" gutterBottom fontWeight={700} color="#0a2342">
                Sign Up
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
                  InputProps={{ style: { background: '#fff' } }}
                />
                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                  InputProps={{ style: { background: '#fff' } }}
                />
                <FormControl fullWidth margin="normal" required>
                  <InputLabel id="role-label">Role</InputLabel>
                  <Select
                    labelId="role-label"
                    value={role}
                    label="Role"
                    onChange={e => setRole(e.target.value)}
                    sx={{ background: '#fff' }}
                  >
                    <MenuItem value="intern">Intern</MenuItem>
                    <MenuItem value="supervisor">Supervisor</MenuItem>
                  </Select>
                </FormControl>
                {error && (
                  <Alert severity="error" sx={{ mt: 2, mb: 1 }}>{error}</Alert>
                )}
                {success && (
                  <Alert severity="success" sx={{ mt: 2, mb: 1 }}>{success}</Alert>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{ mt: 2, mb: 1, borderRadius: 2, fontWeight: 700, letterSpacing: 1, background: '#274472', color: '#fff', '&:hover': { background: '#0a2342' } }}
                  disabled={loading}
                >
                  {loading ? 'Signing up...' : 'Sign Up'}
                </Button>
              </Box>
              <Typography variant="body2" sx={{ mt: 2 }}>
                Already have an account? <a href="/login" style={{ color: '#274472', textDecoration: 'none', fontWeight: 500 }}>Login</a>
              </Typography>
            </CardContent>
            {/* Footer */}
            <Box sx={{
              position: 'absolute',
              bottom: 8,
              left: 0,
              width: '100%',
              textAlign: 'center',
              color: '#274472',
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
  
  export default Signup; 