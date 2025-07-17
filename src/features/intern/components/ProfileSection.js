import React from 'react';
import { Box, Card, CardContent, Typography, Divider, Avatar } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const ProfileSection = ({ user, NAVY, NAVY_LIGHT, PLMUN_LOGO }) => (
  <Box>
    <Card sx={{ boxShadow: 2, background: '#f4f8fb', borderRadius: 3, mb: 3, maxWidth: 480 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <AccountCircleIcon sx={{ color: NAVY, fontSize: 28 }} />
          <Typography variant="h5" fontWeight={700} color={NAVY}>
            Profile
          </Typography>
        </Box>
        <Divider sx={{ mb: 2, background: NAVY_LIGHT }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar src={PLMUN_LOGO} alt="PLMun Logo" sx={{ width: 40, height: 40, bgcolor: '#fff', border: '2px solid #f4f8fb' }} />
          <Box>
            <Typography variant="body1" fontWeight={600}>{user?.email}</Typography>
            <Typography variant="body2" color={NAVY_LIGHT}>Intern</Typography>
          </Box>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          <b>Joined:</b> <span>2024</span> {/* Placeholder, replace with actual join date if available */}
        </Typography>
        {/* Add more profile info here if available */}
      </CardContent>
    </Card>
  </Box>
);

export default ProfileSection; 