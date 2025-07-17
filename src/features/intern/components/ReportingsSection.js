import React from 'react';
import { Box, Card, CardContent, Typography, Divider, TextField, Button, Alert, MenuItem } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const ReportingsSection = ({
  reportType,
  reportDesc,
  handleReportTypeChange,
  handleReportDescChange,
  handleReportSubmit,
  reportError,
  reportSuccess,
  reports,
  NAVY,
  NAVY_LIGHT
}) => (
  <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4 }}>
    <Card sx={{ boxShadow: 3, borderRadius: 4, background: '#f4f8fb', p: 2, mb: 3 }}>
      <Typography variant="h5" fontWeight={700} color={NAVY} gutterBottom>
        Submit Report
      </Typography>
      <Divider sx={{ mb: 2, background: NAVY_LIGHT }} />
      <Box component="form" onSubmit={handleReportSubmit}>
        <TextField
          select
          label="Report Type"
          value={reportType}
          onChange={handleReportTypeChange}
          fullWidth
          sx={{ mb: 2, background: '#fff' }}
        >
          <MenuItem value="Weekly">Weekly</MenuItem>
          <MenuItem value="Monthly">Monthly</MenuItem>
          <MenuItem value="Incident">Incident</MenuItem>
          <MenuItem value="Accomplishment">Accomplishment</MenuItem>
        </TextField>
        <TextField
          label="Description"
          value={reportDesc}
          onChange={handleReportDescChange}
          required
          multiline
          rows={3}
          fullWidth
          sx={{ mb: 2, background: '#fff' }}
        />
        {reportError && <Alert severity="error" sx={{ mb: 2 }}>{reportError}</Alert>}
        {reportSuccess && <Alert severity="success" sx={{ mb: 2 }}>{reportSuccess}</Alert>}
        <Button
          type="submit"
          variant="contained"
          sx={{ background: NAVY_LIGHT, color: '#fff', fontWeight: 700, borderRadius: 2 }}
          startIcon={<CloudUploadIcon />}
        >
          Submit Report
        </Button>
      </Box>
    </Card>
    <Card sx={{ boxShadow: 2, background: '#fff', borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" fontWeight={600} color={NAVY} gutterBottom>
          Previous Reports
        </Typography>
        <Divider sx={{ mb: 2, background: NAVY_LIGHT }} />
        {reports.length === 0 ? (
          <Typography>No reports submitted yet.</Typography>
        ) : (
          <Box>
            {reports.map((r, idx) => (
              <Card key={r.date + idx} sx={{ mb: 2, background: '#f9f9f9', borderLeft: `4px solid ${NAVY_LIGHT}`, borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary">
                    {r.type} Report - {r.date}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>{r.description}</Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  </Box>
);

export default ReportingsSection; 