import React from 'react';
import { Head } from '@inertiajs/react';
import CaiLayout from '@/Layouts/CaiLayout';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Paper,
  Button
} from '@mui/material';
import {
  School as SchoolIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Group as GroupIcon,
  Domain as DomainIcon
} from '@mui/icons-material';

export default function Dashboard({ auth, cai = {}, stats = {}, error }) {
  const displayName = auth?.user?.name || 'CAI';

  if (error) {
    return (
      <CaiLayout auth={auth} title="CAI Dashboard" selectedSection="dashboard">
        <Head title="CAI - Dashboard" />
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" color="error">{error}</Typography>
        </Box>
      </CaiLayout>
    );
  }

  return (
    <CaiLayout auth={auth} title="CAI Dashboard" selectedSection="dashboard">
      <Head title="CAI - Dashboard" />

      {/* Welcome Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
          Welcome back, {displayName}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here is an overview of your learners and activities today.
        </Typography>
      </Box>

      {/* Stats Grid (Learner-style cards) */}
      <Grid container spacing={3}>
        {/* Total Learners (split) */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #4256afff 100%)' }}>
            <CardContent sx={{ color: 'white', py: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>Total Learners</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>{stats?.directlyAssignedLearners || 0}</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>Assigned to me</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <GroupIcon sx={{ color: 'white' }} />
                </Avatar>
              </Box>
              <Box sx={{ height: 1, my: 2, bgcolor: 'rgba(255,255,255,0.25)' }} />
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>Total Under CLC</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#b9e0ff' }}>{stats?.clcLearners || 0}</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>In my learning center</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <DomainIcon sx={{ color: 'white' }} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* CLCs handled */}
        <Grid item xs={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <DomainIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>{stats?.clcsHandled || 1}</Typography>
              <Typography variant="body2" color="text.secondary">CLCs Handled</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Materials uploaded */}
        <Grid item xs={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <SchoolIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>{stats?.modulesCreated || 0}</Typography>
              <Typography variant="body2" color="text.secondary">Learning Materials</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Attendance today */}
        <Grid item xs={12} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <CheckCircleIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>{stats?.attendanceToday || 0}</Typography>
              <Typography variant="body2" color="text.secondary">Attendance Today</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions banner */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, bgcolor: 'primary.main', color: 'white' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Quick Actions</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Button fullWidth variant="contained" sx={{ bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }} href={route('cai.learners')}>
                  Manage Learners
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button fullWidth variant="contained" sx={{ bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }} href={route('cai.attendance')}>
                  Mark Attendance
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button fullWidth variant="contained" sx={{ bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }} href={route('cai.modules')}>
                  Reviewer Materials
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button fullWidth variant="contained" sx={{ bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }} href={route('cai.reviewers')}>
                  Reviewer Monitoring
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </CaiLayout>
  );
}
