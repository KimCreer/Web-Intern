import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, where, getDocs, orderBy, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';
import AIInsights from '../../components/AIInsights';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  Alert
} from '@mui/material';

function ProgressLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    tasksCompleted: '',
    challenges: '',
    nextSteps: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'progress'),
        where('userId', '==', auth.currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const logsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLogs(logsData);
    } catch (error) {
      setError('Error fetching logs.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await addDoc(collection(db, 'progress'), {
        userId: auth.currentUser.uid,
        ...formData,
        createdAt: serverTimestamp(),
      });
      setFormData({
        tasksCompleted: '',
        challenges: '',
        nextSteps: '',
      });
      setSuccess('Progress log submitted!');
      fetchLogs();
    } catch (error) {
      setError('Error adding log.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={4}>
        {/* Progress Log Form */}
        <Grid item xs={12} md={7}>
          <Card sx={{ mb: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Log Your Progress
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  label="Tasks Completed"
                  name="tasksCompleted"
                  value={formData.tasksCompleted}
                  onChange={handleChange}
                  required
                  multiline
                  rows={3}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Challenges Faced"
                  name="challenges"
                  value={formData.challenges}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Next Steps"
                  name="nextSteps"
                  value={formData.nextSteps}
                  onChange={handleChange}
                  required
                  multiline
                  rows={3}
                  fullWidth
                  margin="normal"
                />
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2, borderRadius: 2 }}
                  fullWidth
                >
                  Submit Progress
                </Button>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Previous Logs
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {loading ? (
                <Typography>Loading logs...</Typography>
              ) : logs.length === 0 ? (
                <Typography>No progress logs yet. Start by adding your first log!</Typography>
              ) : (
                <Box>
                  {logs.map(log => (
                    <Card key={log.id} sx={{ mb: 2, background: '#f9f9f9', borderLeft: '4px solid #1976d2' }}>
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary">
                          Date: {log.createdAt && (log.createdAt.toDate ? log.createdAt.toDate().toLocaleDateString() : new Date(log.createdAt).toLocaleDateString())}
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                          <b>Tasks Completed:</b><br />{log.tasksCompleted}
                        </Typography>
                        {log.challenges && (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            <b>Challenges:</b><br />{log.challenges}
                          </Typography>
                        )}
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          <b>Next Steps:</b><br />{log.nextSteps}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* AI Insights */}
        <Grid item xs={12} md={5}>
          <Card sx={{ boxShadow: 2, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                AI Insights
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <AIInsights userId={auth.currentUser.uid} role="intern" />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ProgressLog; 