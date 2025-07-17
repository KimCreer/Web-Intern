import React from 'react';
import { Box, Card, CardContent, Typography, Divider, TextField, Button, Alert } from '@mui/material';
import InsightsIcon from '@mui/icons-material/Insights';
import DashboardIcon from '@mui/icons-material/Dashboard';

const LogProcessSection = ({
  logs,
  formData,
  handleChange,
  handleSubmit,
  error,
  success,
  NAVY,
  NAVY_LIGHT,
  loading
}) => (
  <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
    <Card sx={{ boxShadow: 3, borderRadius: 4, background: '#f4f8fb', p: 2, mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <InsightsIcon sx={{ color: NAVY, fontSize: 28 }} />
          <Typography variant="h5" fontWeight={700} color={NAVY}>
            Log Process
          </Typography>
        </Box>
        <Typography variant="body2" color={NAVY_LIGHT} sx={{ mb: 2 }}>
          Submit your progress log and receive AI-generated insights for each entry.
        </Typography>
        <Divider sx={{ mb: 2, background: NAVY_LIGHT }} />
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Time In"
            name="timeIn"
            type="time"
            value={formData.timeIn}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            InputProps={{ style: { background: '#fff' } }}
          />
          <TextField
            label="Time Out"
            name="timeOut"
            type="time"
            value={formData.timeOut}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            InputProps={{ style: { background: '#fff' } }}
          />
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
            InputProps={{ style: { background: '#fff' } }}
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
            InputProps={{ style: { background: '#fff' } }}
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
            InputProps={{ style: { background: '#fff' } }}
          />
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2, borderRadius: 2, background: NAVY_LIGHT, color: '#fff', fontWeight: 700, '&:hover': { background: NAVY } }}
            fullWidth
          >
            Submit Progress
          </Button>
        </Box>
      </CardContent>
    </Card>
    <Card sx={{ boxShadow: 2, background: '#fff', borderRadius: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <DashboardIcon sx={{ color: NAVY, fontSize: 22 }} />
          <Typography variant="h6" fontWeight={600} color={NAVY}>
            Previous Logs & AI Insights
          </Typography>
        </Box>
        <Divider sx={{ mb: 2, background: NAVY_LIGHT }} />
        {loading ? (
          <Typography>Loading logs...</Typography>
        ) : logs.length === 0 ? (
          <Typography>No progress logs yet. Start by adding your first log!</Typography>
        ) : (
          <Box>
            {logs.map(log => (
              <Card key={log.id} sx={{ mb: 2, background: '#f9f9f9', borderLeft: `4px solid ${NAVY_LIGHT}`, borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary">
                    Date: {log.date || (log.createdAt && (log.createdAt.toDate ? log.createdAt.toDate().toLocaleDateString() : new Date(log.createdAt).toLocaleDateString()))}
                  </Typography>
                  <Typography variant="body2" color={NAVY_LIGHT} sx={{ mb: 1 }}>
                    <b>Time In:</b> {log.timeIn || '-'} &nbsp; <b>Time Out:</b> {log.timeOut || '-'}
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
                  {/* Show AI Insights if available */}
                  {log.aiInsights && (
                    <Box sx={{ mt: 2, background: '#e3eaf6', borderRadius: 2, p: 2 }}>
                      <Typography variant="subtitle2" color={NAVY_LIGHT} fontWeight={700} sx={{ mb: 1 }}>AI Insights</Typography>
                      <Typography variant="body2" color={NAVY_LIGHT} sx={{ whiteSpace: 'pre-line' }}>{log.aiInsights}</Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  </Box>
);

export default LogProcessSection; 