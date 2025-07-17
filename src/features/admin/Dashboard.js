import React from "react";
import { Card, CardContent, Typography, Divider, Avatar, Box } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const NAVY = '#0a2342';
const NAVY_LIGHT = '#274472';
const PLMUN_LOGO = 'https://s.yimg.com/zb/imgv1/b78a2d83-7709-3a13-a971-0109aa12560b/t_500x300';

const AdminDashboard = () => {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Avatar src={PLMUN_LOGO} alt="PLMun Logo" sx={{ width: 48, height: 48, bgcolor: '#fff', border: '2px solid #f4f8fb' }} />
        <Box>
          <Typography variant="h6" fontWeight={700} letterSpacing={1} color={NAVY} sx={{ lineHeight: 1 }}>
            Pamantasan ng Lungsod ng Muntinlupa
          </Typography>
          <Typography variant="subtitle2" color={NAVY_LIGHT} fontWeight={600} sx={{ fontSize: 15, letterSpacing: 1 }}>
            College of Information Technology Studies (CITS)
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Card sx={{ maxWidth: 480, width: '100%', boxShadow: 6, borderRadius: 4, p: 3, background: '#f4f8fb' }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: NAVY_LIGHT, width: 72, height: 72, mb: 2 }}>
              <AdminPanelSettingsIcon fontSize="large" />
            </Avatar>
            <Typography variant="h4" fontWeight={700} color={NAVY} gutterBottom>
              Admin Dashboard
            </Typography>
            <Divider sx={{ width: '100%', mb: 2, background: NAVY_LIGHT }} />
            <Typography variant="body1" sx={{ mb: 2 }}>
              Manage users and view analytics here. More features coming soon!
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default AdminDashboard; 