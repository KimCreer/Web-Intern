import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, addDoc } from 'firebase/firestore';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import AIInsights from '../../components/AIInsights';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
  Button,
  Alert,
  Avatar
} from '@mui/material';

const PLMUN_LOGO = 'https://s.yimg.com/zb/imgv1/b78a2d83-7709-3a13-a971-0109aa12560b/t_500x300';

function SupervisorDashboard() {
  const [interns, setInterns] = useState([]);
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState('');
  const [feedbackError, setFeedbackError] = useState('');

  useEffect(() => {
    fetchInterns();
    // eslint-disable-next-line
  }, []);

  const fetchInterns = async () => {
    setLoading(true);
    try {
      // Get all users with role 'intern'
      const usersQuery = query(
        collection(db, 'users'),
        where('role', '==', 'intern')
      );
      const userSnapshot = await getDocs(usersQuery);
      // For each intern, get their latest progress log
      const internsData = await Promise.all(
        userSnapshot.docs.map(async (doc) => {
          const intern = { id: doc.id, ...doc.data() };
          // Get latest progress log
          const logsQuery = query(
            collection(db, 'progress'),
            where('userId', '==', doc.id),
            orderBy('createdAt', 'desc')
          );
          const logsSnapshot = await getDocs(logsQuery);
          intern.logs = logsSnapshot.docs.map(log => ({
            id: log.id,
            ...log.data(),
            createdAt: log.data().createdAt?.toDate ? log.data().createdAt.toDate() : new Date(log.data().createdAt)
          }));
          return intern;
        })
      );
      setInterns(internsData);
    } catch (error) {
      // eslint-disable-next-line
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async (internId, logId) => {
    setFeedbackSuccess('');
    setFeedbackError('');
    try {
      await addDoc(collection(db, 'feedback'), {
        internId,
        logId,
        feedback,
        createdAt: new Date()
      });
      setFeedback('');
      setFeedbackSuccess('Feedback submitted successfully!');
    } catch (error) {
      setFeedbackError('Failed to submit feedback');
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Avatar src={PLMUN_LOGO} alt="PLMun Logo" sx={{ width: 48, height: 48, bgcolor: '#fff', border: '2px solid #f4f8fb' }} />
        <Box>
          <Typography variant="h6" fontWeight={700} letterSpacing={1} color="#0a2342" sx={{ lineHeight: 1 }}>
            Pamantasan ng Lungsod ng Muntinlupa
          </Typography>
          <Typography variant="subtitle2" color="#274472" fontWeight={600} sx={{ fontSize: 15, letterSpacing: 1 }}>
            College of Information Technology Studies (CITS)
          </Typography>
        </Box>
      </Box>
      <Typography variant="h5" fontWeight={700} gutterBottom color="#0a2342">
        Interns Progress Overview
      </Typography>
      <Divider sx={{ mb: 3, background: '#274472' }} />
      <Grid container spacing={4}>
        {/* Interns List */}
        <Grid item xs={12} md={4}>
          <Card sx={{ boxShadow: 2, background: '#f4f8fb', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom color="#0a2342">
                Interns
              </Typography>
              <Divider sx={{ mb: 2, background: '#274472' }} />
              {loading ? (
                <Typography>Loading interns...</Typography>
              ) : interns.length === 0 ? (
                <Typography>No interns found.</Typography>
              ) : (
                <List>
                  {interns.map(intern => (
                    <ListItem key={intern.id} disablePadding>
                      <ListItemButton
                        selected={selectedIntern?.id === intern.id}
                        onClick={() => setSelectedIntern(intern)}
                        sx={{ borderRadius: 2, '&.Mui-selected': { background: '#e3eaf6' } }}
                      >
                        <ListItemText
                          primary={intern.email}
                          secondary={
                            intern.logs.length > 0
                              ? `Latest: ${intern.logs[0].createdAt.toLocaleDateString()}`
                              : 'No logs yet'
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Selected Intern's Progress Logs and Insights */}
        <Grid item xs={12} md={8}>
          {selectedIntern ? (
            <>
              <Card sx={{ mb: 3, boxShadow: 2, background: '#fff', borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom color="#0a2342">
                    {selectedIntern.email}'s Progress
                  </Typography>
                  <Divider sx={{ mb: 2, background: '#274472' }} />
                  <AIInsights userId={selectedIntern.id} role="intern" />
                  <Typography variant="subtitle1" fontWeight={500} sx={{ mt: 3 }} color="#0a2342">
                    Progress Logs
                  </Typography>
                  <Divider sx={{ mb: 2, background: '#274472' }} />
                  {selectedIntern.logs.length === 0 ? (
                    <Typography>No progress logs found for this intern.</Typography>
                  ) : (
                    selectedIntern.logs.map(log => (
                      <Card key={log.id} sx={{ mb: 2, background: '#f9f9f9', borderLeft: '4px solid #274472', borderRadius: 2 }}>
                        <CardContent>
                          <Typography variant="subtitle2" color="text.secondary">
                            Date: {log.createdAt.toLocaleDateString()}
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
                          {/* Feedback Section */}
                          <Box sx={{ mt: 2, borderTop: '1px solid #eee', pt: 2 }}>
                            <Typography variant="subtitle2" fontWeight={600} gutterBottom color="#0a2342">
                              Add Feedback
                            </Typography>
                            <TextField
                              value={feedback}
                              onChange={(e) => setFeedback(e.target.value)}
                              placeholder="Enter your feedback..."
                              fullWidth
                              multiline
                              rows={2}
                              sx={{ mb: 1, background: '#fff' }}
                            />
                            {feedbackError && <Alert severity="error" sx={{ mb: 1 }}>{feedbackError}</Alert>}
                            {feedbackSuccess && <Alert severity="success" sx={{ mb: 1 }}>{feedbackSuccess}</Alert>}
                            <Button
                              onClick={() => handleSubmitFeedback(selectedIntern.id, log.id)}
                              disabled={!feedback.trim()}
                              variant="contained"
                              color="primary"
                              sx={{ borderRadius: 2, background: '#274472', color: '#fff', fontWeight: 700, '&:hover': { background: '#0a2342' } }}
                            >
                              Submit Feedback
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card sx={{ boxShadow: 2, background: '#f4f8fb', borderRadius: 3 }}>
              <CardContent>
                <Typography>Select an intern to view their progress logs and provide feedback.</Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default SupervisorDashboard; 