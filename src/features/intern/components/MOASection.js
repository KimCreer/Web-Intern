import React from 'react';
import { Box, Card, Typography, Divider, Button, Alert } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const MOASection = ({ moaUrl, moaUploading, moaError, moaSuccess, handleMoaUpload, NAVY, NAVY_LIGHT }) => (
  <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
    <Card sx={{ boxShadow: 3, borderRadius: 4, background: '#f4f8fb', p: 2 }}>
      <Typography variant="h5" fontWeight={700} color={NAVY} gutterBottom>
        MOA Upload
      </Typography>
      <Divider sx={{ mb: 2, background: NAVY_LIGHT }} />
      <Button
        variant="contained"
        component="label"
        startIcon={<CloudUploadIcon />}
        sx={{ mb: 2, background: NAVY_LIGHT, color: '#fff', fontWeight: 700, borderRadius: 2 }}
        disabled={moaUploading}
      >
        {moaUploading ? 'Uploading...' : 'Upload MOA (PDF)'}
        <input type="file" accept="application/pdf" hidden onChange={handleMoaUpload} />
      </Button>
      {moaError && <Alert severity="error" sx={{ mb: 2 }}>{moaError}</Alert>}
      {moaSuccess && <Alert severity="success" sx={{ mb: 2 }}>{moaSuccess}</Alert>}
      {moaUrl && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color={NAVY_LIGHT} sx={{ mb: 1 }}>Current MOA:</Typography>
          <a href={moaUrl} target="_blank" rel="noopener noreferrer" style={{ color: NAVY_LIGHT, fontWeight: 600 }}>View MOA PDF</a>
        </Box>
      )}
    </Card>
  </Box>
);

export default MOASection; 