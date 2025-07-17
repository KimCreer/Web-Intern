import React from 'react';
import { Box, Card, Typography, Grid, LinearProgress, Avatar, Tooltip, Fade } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import InsightsIcon from '@mui/icons-material/Insights';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const DashboardSection = ({ logs, NAVY, NAVY_LIGHT, user }) => {
  const progress = logs.length >= 20 ? 100 : Math.round((logs.length / 20) * 100);
  const [showCards, setShowCards] = React.useState(false);
  React.useEffect(() => {
    setTimeout(() => setShowCards(true), 200);
  }, []);
  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mb: 4,
        background: 'linear-gradient(120deg, #f4f8fb 60%, #e3eaf6 100%)',
        py: { xs: 2, sm: 4 },
      }}
    >
      {/* Welcome Banner */}
      <Box
        sx={{
          width: '100%',
          maxWidth: 720,
          mb: 2,
          px: 2,
          py: 2,
          borderRadius: 3,
          background: 'linear-gradient(90deg, #274472 0%, #0a2342 100%)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          boxShadow: 2,
        }}
      >
        <Avatar sx={{ bgcolor: NAVY_LIGHT, mr: 2 }}>{user?.email?.[0]?.toUpperCase() || 'U'}</Avatar>
        <Box>
          <Typography variant="h6" fontWeight={700} sx={{ letterSpacing: 1 }}>
            Welcome, {user?.email || 'Intern'}!
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.85 }}>
            Here’s your internship summary at a glance.
          </Typography>
        </Box>
      </Box>
      {/* Motivational Quote */}
      <Box sx={{ maxWidth: 720, mb: 4, px: 2, textAlign: 'center' }}>
        <Typography variant="subtitle1" color={NAVY_LIGHT} fontWeight={500} sx={{ fontStyle: 'italic', opacity: 0.85 }}>
          "Success is the sum of small efforts, repeated day in and day out." – Robert Collier
        </Typography>
      </Box>
      <Grid container spacing={4} justifyContent="center" sx={{ maxWidth: 800 }}>
        {/* Attendance Today Card (info only) */}
        <Fade in={showCards} timeout={600}>
          <Grid item xs={12} sm={6}>
            <Card
              tabIndex={0}
              sx={{
                width: '100%',
                boxShadow: '0 8px 32px 0 rgba(60,72,100,0.12)',
                background: 'linear-gradient(135deg, #e3eaf6 0%, #f4f8fb 100%)',
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                p: 4,
                minHeight: 140,
                transition: 'transform 0.15s, box-shadow 0.15s',
                '&:hover, &:focus': {
                  transform: 'translateY(-4px) scale(1.03)',
                  boxShadow: '0 12px 36px 0 rgba(60,72,100,0.18)',
                },
              }}
            >
              <Box sx={{
                background: 'linear-gradient(135deg, #274472 0%, #4f6d9a 100%)',
                borderRadius: '50%',
                width: 64,
                height: 64,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 3,
                boxShadow: 3,
                flexShrink: 0,
              }}>
                <AccessTimeIcon sx={{ color: '#fff', fontSize: 36 }} />
              </Box>
              <Box>
                <Typography variant="subtitle2" color={NAVY_LIGHT} fontWeight={700} sx={{ letterSpacing: 1 }}>
                  Attendance Today
                </Typography>
                <Typography variant="body2" color={NAVY_LIGHT} sx={{ mb: 1 }}>
                  See your log for today's attendance
                </Typography>
              </Box>
            </Card>
          </Grid>
        </Fade>
        {/* Total Logs Card */}
        <Fade in={showCards} timeout={800}>
          <Grid item xs={12} sm={6}>
            <Card
              tabIndex={0}
              sx={{
                width: '100%',
                boxShadow: '0 8px 32px 0 rgba(60,72,100,0.12)',
                background: 'linear-gradient(135deg, #e3eaf6 0%, #f4f8fb 100%)',
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                p: 4,
                minHeight: 140,
                transition: 'transform 0.15s, box-shadow 0.15s',
                '&:hover, &:focus': {
                  transform: 'translateY(-4px) scale(1.03)',
                  boxShadow: '0 12px 36px 0 rgba(60,72,100,0.18)',
                },
              }}
            >
              <Box sx={{
                background: 'linear-gradient(135deg, #274472 0%, #4f6d9a 100%)',
                borderRadius: '50%',
                width: 64,
                height: 64,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 3,
                boxShadow: 3,
                flexShrink: 0,
              }}>
                <AssignmentTurnedInIcon sx={{ color: '#fff', fontSize: 36 }} />
              </Box>
              <Box>
                <Typography variant="subtitle2" color={NAVY_LIGHT} fontWeight={700} sx={{ letterSpacing: 1 }}>
                  Total Logs
                </Typography>
                <Typography variant="h3" fontWeight={800} color={NAVY} sx={{ lineHeight: 1, mb: 0.5 }}>
                  {logs.length}
                </Typography>
                <Typography variant="body2" color={NAVY_LIGHT}>
                  Your submitted progress logs
                </Typography>
              </Box>
            </Card>
          </Grid>
        </Fade>
        {/* Progress Percentage Card */}
        <Fade in={showCards} timeout={1000}>
          <Grid item xs={12} sm={6}>
            <Card
              tabIndex={0}
              sx={{
                width: '100%',
                boxShadow: '0 8px 32px 0 rgba(60,72,100,0.12)',
                background: 'linear-gradient(135deg, #e3eaf6 0%, #f4f8fb 100%)',
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                p: 4,
                minHeight: 140,
                transition: 'transform 0.15s, box-shadow 0.15s',
                '&:hover, &:focus': {
                  transform: 'translateY(-4px) scale(1.03)',
                  boxShadow: '0 12px 36px 0 rgba(60,72,100,0.18)',
                },
              }}
            >
              <Box sx={{
                background: 'linear-gradient(135deg, #274472 0%, #4f6d9a 100%)',
                borderRadius: '50%',
                width: 64,
                height: 64,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 3,
                boxShadow: 3,
                flexShrink: 0,
                position: 'relative',
              }}>
                <InsightsIcon sx={{ color: '#fff', fontSize: 36 }} />
                {/* Progress badge with tooltip */}
                <Tooltip title="This shows your internship completion based on submitted logs." arrow>
                  <Box sx={{
                    position: 'absolute',
                    bottom: -8,
                    right: -8,
                    bgcolor: '#fff',
                    borderRadius: '50%',
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 2,
                    border: `2px solid ${NAVY_LIGHT}`,
                  }}>
                    <Typography variant="subtitle2" fontWeight={700} color={NAVY_LIGHT}>{progress}%</Typography>
                  </Box>
                </Tooltip>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" color={NAVY_LIGHT} fontWeight={700} sx={{ letterSpacing: 1 }}>
                  Progress Percentage
                </Typography>
                <Typography variant="h3" fontWeight={800} color={NAVY} sx={{ lineHeight: 1, mb: 0.5 }}>
                  {progress}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{ height: 8, borderRadius: 4, background: '#e3eaf6', mb: 1, '& .MuiLinearProgress-bar': { background: NAVY_LIGHT } }}
                />
                <Typography variant="body2" color={NAVY_LIGHT}>
                  Internship completion
                </Typography>
              </Box>
            </Card>
          </Grid>
        </Fade>
        {/* Deployment Industry Card */}
        <Fade in={showCards} timeout={1200}>
          <Grid item xs={12} sm={6}>
            <Card
              tabIndex={0}
              sx={{
                width: '100%',
                boxShadow: '0 8px 32px 0 rgba(60,72,100,0.12)',
                background: 'linear-gradient(135deg, #e3eaf6 0%, #f4f8fb 100%)',
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                p: 4,
                minHeight: 140,
                transition: 'transform 0.15s, box-shadow 0.15s',
                '&:hover, &:focus': {
                  transform: 'translateY(-4px) scale(1.03)',
                  boxShadow: '0 12px 36px 0 rgba(60,72,100,0.18)',
                },
              }}
            >
              <Box sx={{
                background: 'linear-gradient(135deg, #274472 0%, #4f6d9a 100%)',
                borderRadius: '50%',
                width: 64,
                height: 64,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 3,
                boxShadow: 3,
                flexShrink: 0,
              }}>
                <AccountCircleIcon sx={{ color: '#fff', fontSize: 36 }} />
              </Box>
              <Box>
                <Typography variant="subtitle2" color={NAVY_LIGHT} fontWeight={700} sx={{ letterSpacing: 1 }}>
                  Deployment Industry
                </Typography>
                <Typography variant="h5" fontWeight={800} color={NAVY} sx={{ lineHeight: 1, mb: 0.5 }}>
                  {/* Placeholder value, replace with actual data if available */}
                  Not Set
                </Typography>
                <Typography variant="body2" color={NAVY_LIGHT}>
                  Your assigned industry
                </Typography>
              </Box>
            </Card>
          </Grid>
        </Fade>
      </Grid>
    </Box>
  );
};

export default DashboardSection; 