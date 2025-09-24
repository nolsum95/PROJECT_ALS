import React from 'react';
import LearnerLayout from '@/Layouts/LearnerLayout';
import { Head } from '@inertiajs/react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  Alert,
  Button,
  Avatar
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Assignment as AssignmentIcon,
  Grade as GradeIcon,
  Timeline as TimelineIcon,
  Download as DownloadIcon,
  Print as PrintIcon
} from '@mui/icons-material';

export default function EnrollmentStatus({ 
  auth, 
  learner = {}, 
  enrollment = {},
  subjects = [],
  enrollmentHistory = []
}) {
  // Mock data for demonstration
  const enrollmentData = {
    status: enrollment.enrollee_status || 'Enrolled',
    learner_ref_no: learner.learner_ref_no || 'ALS-2025-001',
    date_enrolled: enrollment.date_enrolled || '2025-01-01',
    program: enrollment.lastLevelCompleted || 'A&E Elementary',
    clc_name: learner.clc?.clc_name || 'Poblacion Community Learning Center',
    cai_name: `${learner.cai?.firstname || 'Maria'} ${learner.cai?.lastname || 'Santos'}`,
    clc_address: learner.clc?.barangay || 'Poblacion, Quezon City',
    ...enrollment
  };

  const mockSubjects = subjects.length > 0 ? subjects : [
    { id: 1, name: 'Mathematics', description: 'Basic Mathematics and Problem Solving', status: 'Active' },
    { id: 2, name: 'English', description: 'Communication Arts and Literature', status: 'Active' },
    { id: 3, name: 'Science', description: 'Natural Sciences and Technology', status: 'Active' },
    { id: 4, name: 'Filipino', description: 'Filipino Language and Literature', status: 'Active' },
    { id: 5, name: 'Araling Panlipunan', description: 'Social Studies and History', status: 'Active' }
  ];

  const mockEnrollmentHistory = enrollmentHistory.length > 0 ? enrollmentHistory : [
    { date: '2025-01-01', event: 'Application Submitted', status: 'completed' },
    { date: '2025-01-03', event: 'Application Reviewed', status: 'completed' },
    { date: '2025-01-05', event: 'Pre-enrollment Completed', status: 'completed' },
    { date: '2025-01-08', event: 'Enrolled in Program', status: 'completed' },
    { date: '2025-01-10', event: 'Classes Started', status: 'current' }
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'enrolled': return 'success';
      case 'pre-enrolled': return 'warning';
      case 'applied': return 'info';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon color="success" />;
      case 'current': return <TimelineIcon color="primary" />;
      default: return <CalendarIcon color="disabled" />;
    }
  };

  return (
    <LearnerLayout auth={auth} selectedSection="enrollment" title="Enrollment Status">
      <Head title="Enrollment Status" />

      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
          Enrollment Status
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View your enrollment details and program information
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Enrollment Overview */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Enrollment Confirmation</Typography>
                <Chip
                  label={enrollmentData.status}
                  color={getStatusColor(enrollmentData.status)}
                  icon={<CheckCircleIcon />}
                />
              </Box>

              <Alert severity="success" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  🎉 Congratulations! You are successfully enrolled in the ALS program. 
                  Your learning journey has begun!
                </Typography>
              </Alert>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Learner Reference Number
                    </Typography>
                    <Typography variant="h6" color="primary.main">
                      {enrollmentData.learner_ref_no}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Date Enrolled
                    </Typography>
                    <Typography variant="h6">
                      {new Date(enrollmentData.date_enrolled).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Program Level
                    </Typography>
                    <Typography variant="h6">
                      {enrollmentData.program}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Academic Year
                    </Typography>
                    <Typography variant="h6">
                      2024-2025
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" sx={{ mb: 2 }}>
                Assignment Details
              </Typography>

              <List>
                <ListItem>
                  <ListItemIcon>
                    <SchoolIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Community Learning Center"
                    secondary={enrollmentData.clc_name}
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <PersonIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Community ALS Implementor (CAI)"
                    secondary={enrollmentData.cai_name}
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <LocationIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="CLC Location"
                    secondary={enrollmentData.clc_address}
                  />
                </ListItem>
              </List>

              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={() => window.print()}
                >
                  Download Certificate
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<PrintIcon />}
                  onClick={() => window.print()}
                >
                  Print Details
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Subjects */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Enrolled Subjects
              </Typography>

              <Grid container spacing={2}>
                {mockSubjects.map((subject) => (
                  <Grid item xs={12} sm={6} key={subject.id}>
                    <Paper
                      sx={{
                        p: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        '&:hover': {
                          borderColor: 'primary.main',
                          boxShadow: 1
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <GradeIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {subject.name}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {subject.description}
                      </Typography>
                      <Chip
                        label={subject.status}
                        color="success"
                        size="small"
                      />
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Enrollment Timeline */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Enrollment Timeline
              </Typography>

              <Timeline>
                {mockEnrollmentHistory.map((item, index) => (
                  <TimelineItem key={index}>
                    <TimelineSeparator>
                      <TimelineDot>
                        {getStatusIcon(item.status)}
                      </TimelineDot>
                      {index < mockEnrollmentHistory.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {item.event}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(item.date).toLocaleDateString()}
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Quick Information
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Total Subjects
                </Typography>
                <Typography variant="h4" color="primary.main">
                  {mockSubjects.length}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Days Since Enrollment
                </Typography>
                <Typography variant="h4" color="success.main">
                  {Math.floor((new Date() - new Date(enrollmentData.date_enrolled)) / (1000 * 60 * 60 * 24))}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Current Status
                </Typography>
                <Chip
                  label="Active Learner"
                  color="success"
                  icon={<CheckCircleIcon />}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </LearnerLayout>
  );
}
