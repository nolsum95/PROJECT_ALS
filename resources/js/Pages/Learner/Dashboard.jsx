import React from 'react';
import LearnerLayout from '@/Layouts/LearnerLayout';
import { Head } from '@inertiajs/react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  LinearProgress,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Button,
  Alert
} from '@mui/material';
import {
  School as SchoolIcon,
  Quiz as QuizIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  PlayArrow as PlayArrowIcon,
  Assignment as AssignmentIcon,
  Star as StarIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';

export default function LearnerDashboard({ 
  auth, 
  learner = {}, 
  stats = {}, 
  recentActivities = [],
  upcomingExams = [],
  availableReviewers = [],
  progressData = {}
}) {
  const displayName = auth?.user?.name || 'Learner';
  
  // Mock data for demonstration
  const mockStats = {
    completedReviewers: stats.completedReviewers || 12,
    totalReviewers: stats.totalReviewers || 20,
    examsPassed: stats.examsPassed || 3,
    totalExams: stats.totalExams || 5,
    overallProgress: stats.overallProgress || 75,
    currentGrade: stats.currentGrade || 'A&E Elementary',
    attendanceRate: stats.attendanceRate || 92,
    ...stats
  };

  const mockUpcomingExams = upcomingExams.length > 0 ? upcomingExams : [
    { id: 1, title: 'Mathematics Pretest', date: '2025-01-15', type: 'pretest' },
    { id: 2, title: 'English Posttest', date: '2025-01-20', type: 'posttest' },
    { id: 3, title: 'Science Review Quiz', date: '2025-01-25', type: 'quiz' }
  ];

  const mockRecentActivities = recentActivities.length > 0 ? recentActivities : [
    { id: 1, activity: 'Completed Mathematics Reviewer', date: '2 hours ago', type: 'reviewer' },
    { id: 2, activity: 'Submitted English Assignment', date: '1 day ago', type: 'assignment' },
    { id: 3, activity: 'Attended Virtual Class', date: '2 days ago', type: 'attendance' },
    { id: 4, activity: 'Downloaded Science Module', date: '3 days ago', type: 'module' }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'reviewer': return <QuizIcon color="primary" />;
      case 'assignment': return <AssignmentIcon color="success" />;
      case 'attendance': return <CheckCircleIcon color="info" />;
      case 'module': return <SchoolIcon color="warning" />;
      default: return <StarIcon />;
    }
  };

  return (
    <LearnerLayout auth={auth} selectedSection="dashboard" title="My Learning Dashboard">
      <Head title="Learner Dashboard" />

      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
          Welcome back, {displayName}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Continue your ALS learning journey. You're doing great!
        </Typography>
      </Box>  
     {/* Quick Actions */}
        <Grid item xs={12} marginBottom={3}>
          <Paper sx={{ p: 3, bgcolor: 'primary.main', color: 'white' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
                  startIcon={<QuizIcon />}
                  href={route('learner.reviewers')}
                >
                  Study Materials
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
                  startIcon={<AssessmentIcon />}
                  href={route('learner.exams')}
                >
                  Take Exam
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
                  startIcon={<TrendingUpIcon />}
                  href={route('learner.progress')}
                >
                  View Progress
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
                  startIcon={<PersonIcon />}
                  href={route('learner.profile')}
                >
                  Update Profile
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid item xs={1} md={4}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #4256afff 100%)' }}>
            <CardContent sx={{ color: 'white', textAlign: 'center', py: 4 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  fontSize: '2rem'
                }}
              >
                {(displayName?.charAt?.(0) || 'L').toUpperCase()}
              </Avatar>
              
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                {displayName}
              </Typography>
              
              <Chip
                label={learner.learner_ref_no || 'ALS-2025-001'}
                size="small"
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', mb: 2 }}
              />
              
              <Box sx={{ textAlign: 'left', mt: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <SchoolIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                  <Typography variant="body2">
                    {learner.clc?.clc_name || 'Poblacion CLC'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PersonIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                  <Typography variant="body2">
                    CAI: {learner.cai?.firstname || 'Maria'} {learner.cai?.lastname || 'Santos'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircleIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                  <Typography variant="body2">
                    Status: {learner.status || 'Active'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <QuizIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {mockStats.completedReviewers}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Reviewers Completed
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={6} sm={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <AssessmentIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {mockStats.examsPassed}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Exams Passed
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={6} sm={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <TrendingUpIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {mockStats.overallProgress}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Overall Progress
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={6} sm={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <CheckCircleIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {mockStats.attendanceRate}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Attendance Rate
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Progress Overview */}
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Learning Progress
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Study Materials</Typography>
                  <Typography variant="body2">{mockStats.completedReviewers}/{mockStats.totalReviewers}</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(mockStats.completedReviewers / mockStats.totalReviewers) * 100}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Exams Completed</Typography>
                  <Typography variant="body2">{mockStats.examsPassed}/{mockStats.totalExams}</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(mockStats.examsPassed / mockStats.totalExams) * 100}
                  sx={{ height: 8, borderRadius: 4 }}
                  color="success"
                />
              </Box>
              
              {/* <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  You're currently enrolled in <strong>{mockStats.currentGrade}</strong> program. 
                  Keep up the excellent work!
                </Typography>
              </Alert> */}
              
            </CardContent>
          </Card>
              {/* Recent Activities */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6">Recent Activities</Typography>
              </Box>
              
              <List>
                {mockRecentActivities.map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        {getActivityIcon(activity.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={activity.activity}
                        secondary={activity.date}
                      />
                    </ListItem>
                    {index < mockRecentActivities.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
              
              <Button 
                fullWidth 
                variant="outlined" 
                sx={{ mt: 2 }}
                href={route('learner.progress')}
              >
                View Full Progress
              </Button>
            </CardContent>
          </Card>
        </Grid>

        </Grid>

        {/* Upcoming Exams */}
        {/* <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ScheduleIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Upcoming Exams</Typography>
              </Box>
              
              <List>
                {mockUpcomingExams.map((exam, index) => (
                  <React.Fragment key={exam.id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <CalendarIcon color="primary" />
                      </ListItemIcon> 
                      <ListItemText
                        primary={exam.title}
                        secondary={`${exam.date} • ${(exam?.type ? String(exam.type).toUpperCase() : 'EXAM')}`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton size="small" color="primary">
                          <PlayArrowIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < mockUpcomingExams.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
              
              <Button 
                fullWidth 
                variant="outlined" 
                sx={{ mt: 2 }}
                href={route('learner.exams')}
              >
                View All Exams
              </Button>
            </CardContent>
          </Card>
        </Grid> */}

    
   
      </Grid>
    </LearnerLayout>
  );
}
