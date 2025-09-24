import React, { useState } from 'react';
import LearnerLayout from '@/Layouts/LearnerLayout';
import { Head } from '@inertiajs/react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tabs,
  Tab,
  LinearProgress,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Avatar,
  Divider
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  Quiz as QuizIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Grade as GradeIcon,
  Timeline as TimelineIcon,
  School as SchoolIcon,
  EmojiEvents as TrophyIcon,
  Target as TargetIcon,
  BarChart as BarChartIcon
} from '@mui/material';

export default function Progress({ 
  auth, 
  learner = {}, 
  progressData = {},
  examResults = [],
  reviewerProgress = [],
  attendanceData = {},
  flash = {}
}) {
  const [selectedTab, setSelectedTab] = useState(0);

  // Mock data for comprehensive progress tracking
  const mockProgressData = {
    overall_progress: progressData.overall_progress || 75,
    current_level: progressData.current_level || 'A&E Elementary',
    subjects_completed: progressData.subjects_completed || 3,
    total_subjects: progressData.total_subjects || 5,
    attendance_rate: attendanceData.attendance_rate || 92,
    study_hours: progressData.study_hours || 45,
    target_hours: progressData.target_hours || 60,
    ...progressData
  };

  const mockExamResults = examResults.length > 0 ? examResults : [
    { subject: 'Mathematics', pretest: 65, posttest: 85, improvement: 20, status: 'improved' },
    { subject: 'English', pretest: 70, posttest: 88, improvement: 18, status: 'improved' },
    { subject: 'Science', pretest: 60, posttest: 78, improvement: 18, status: 'improved' },
    { subject: 'Filipino', pretest: 75, posttest: 82, improvement: 7, status: 'improved' },
    { subject: 'Araling Panlipunan', pretest: 68, posttest: null, improvement: 0, status: 'pending' }
  ];

  const mockReviewerProgress = reviewerProgress.length > 0 ? reviewerProgress : [
    { subject: 'Mathematics', completed: 8, total: 10, percentage: 80, avg_score: 85 },
    { subject: 'English', completed: 7, total: 8, percentage: 87.5, avg_score: 88 },
    { subject: 'Science', completed: 5, total: 7, percentage: 71.4, avg_score: 78 },
    { subject: 'Filipino', completed: 6, total: 8, percentage: 75, avg_score: 82 },
    { subject: 'Araling Panlipunan', completed: 4, total: 6, percentage: 66.7, avg_score: 75 }
  ];

  const mockAttendanceData = {
    total_days: 45,
    present_days: 41,
    absent_days: 4,
    attendance_rate: 91.1,
    recent_attendance: [
      { date: '2025-01-10', status: 'present' },
      { date: '2025-01-09', status: 'present' },
      { date: '2025-01-08', status: 'absent' },
      { date: '2025-01-07', status: 'present' },
      { date: '2025-01-06', status: 'present' }
    ]
  };

  const mockAchievements = [
    { id: 1, title: 'First Exam Passed', description: 'Passed your first exam', date: '2025-01-05', icon: '🎯' },
    { id: 2, title: 'Perfect Attendance Week', description: 'Attended all classes for a week', date: '2025-01-08', icon: '📅' },
    { id: 3, title: 'High Scorer', description: 'Scored above 85% in an exam', date: '2025-01-10', icon: '⭐' },
    { id: 4, title: 'Study Streak', description: 'Completed reviewers for 5 consecutive days', date: '2025-01-12', icon: '🔥' }
  ];

  const getImprovementColor = (improvement) => {
    if (improvement > 15) return 'success';
    if (improvement > 5) return 'warning';
    if (improvement > 0) return 'info';
    return 'default';
  };

  const getAttendanceColor = (rate) => {
    if (rate >= 95) return 'success';
    if (rate >= 85) return 'warning';
    return 'error';
  };

  const calculateOverallGrade = () => {
    const completedExams = mockExamResults.filter(exam => exam.posttest !== null);
    if (completedExams.length === 0) return 'N/A';
    
    const average = completedExams.reduce((acc, exam) => acc + exam.posttest, 0) / completedExams.length;
    
    if (average >= 90) return 'Excellent';
    if (average >= 85) return 'Very Good';
    if (average >= 80) return 'Good';
    if (average >= 75) return 'Satisfactory';
    return 'Needs Improvement';
  };

  return (
    <LearnerLayout auth={auth} selectedSection="progress" title="My Progress">
      <Head title="My Progress" />

      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
          My Learning Progress
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track your academic performance and achievements
        </Typography>
      </Box>

      {flash.success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {flash.success}
        </Alert>
      )}

      {/* Overall Progress Overview */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Overall Progress
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                      <CircularProgress
                        variant="determinate"
                        value={mockProgressData.overall_progress}
                        size={120}
                        thickness={4}
                        sx={{ color: 'primary.main' }}
                      />
                      <Box
                        sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          position: 'absolute',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography variant="h4" component="div" color="text.secondary">
                          {mockProgressData.overall_progress}%
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="h6" sx={{ mt: 2 }}>
                      Overall Progress
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Current Level
                    </Typography>
                    <Typography variant="h6" color="primary.main">
                      {mockProgressData.current_level}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Academic Status
                    </Typography>
                    <Chip
                      label={calculateOverallGrade()}
                      color="success"
                      icon={<GradeIcon />}
                    />
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Subjects Progress
                    </Typography>
                    <Typography variant="h6">
                      {mockProgressData.subjects_completed}/{mockProgressData.total_subjects} Completed
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={(mockProgressData.subjects_completed / mockProgressData.total_subjects) * 100}
                      sx={{ mt: 1, height: 8, borderRadius: 4 }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <TrophyIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {mockAchievements.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Achievements
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <ScheduleIcon sx={{ fontSize: 40, color: getAttendanceColor(mockAttendanceData.attendance_rate), mb: 1 }} />
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {mockAttendanceData.attendance_rate}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Attendance Rate
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={selectedTab}
          onChange={(e, newValue) => setSelectedTab(newValue)}
          variant="fullWidth"
        >
          <Tab label="Exam Performance" />
          <Tab label="Study Progress" />
          <Tab label="Attendance" />
          <Tab label="Achievements" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {selectedTab === 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Exam Performance Tracking
            </Typography>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Subject</TableCell>
                    <TableCell align="center">Pretest Score</TableCell>
                    <TableCell align="center">Posttest Score</TableCell>
                    <TableCell align="center">Improvement</TableCell>
                    <TableCell align="center">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockExamResults.map((result) => (
                    <TableRow key={result.subject}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <SchoolIcon sx={{ mr: 1, color: 'primary.main' }} />
                          {result.subject}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="h6" color="text.secondary">
                          {result.pretest}%
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="h6" color={result.posttest ? 'primary.main' : 'text.secondary'}>
                          {result.posttest ? `${result.posttest}%` : 'Pending'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        {result.improvement > 0 ? (
                          <Chip
                            label={`+${result.improvement}%`}
                            color={getImprovementColor(result.improvement)}
                            size="small"
                            icon={<TrendingUpIcon />}
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            N/A
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={result.status === 'improved' ? 'Improved' : 'Pending'}
                          color={result.status === 'improved' ? 'success' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {selectedTab === 1 && (
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Study Materials Progress
            </Typography>
            
            <Grid container spacing={3}>
              {mockReviewerProgress.map((subject) => (
                <Grid item xs={12} md={6} key={subject.subject}>
                  <Paper sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">{subject.subject}</Typography>
                      <Chip
                        label={`${Math.round(subject.percentage)}%`}
                        color="primary"
                        size="small"
                      />
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Reviewers Completed: {subject.completed}/{subject.total}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={subject.percentage}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        Average Score:
                      </Typography>
                      <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>
                        {subject.avg_score}%
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {selectedTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Attendance Summary
                </Typography>
                
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="success.main">
                        {mockAttendanceData.present_days}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Present Days
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="error.main">
                        {mockAttendanceData.absent_days}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Absent Days
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="primary.main">
                        {mockAttendanceData.total_days}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Days
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Attendance Rate: {mockAttendanceData.attendance_rate}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={mockAttendanceData.attendance_rate}
                    color={getAttendanceColor(mockAttendanceData.attendance_rate)}
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Recent Attendance
                </Typography>
                
                <List>
                  {mockAttendanceData.recent_attendance.map((record, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <CheckCircleIcon 
                          color={record.status === 'present' ? 'success' : 'error'} 
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={new Date(record.date).toLocaleDateString()}
                        secondary={record.status.toUpperCase()}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {selectedTab === 3 && (
        <Grid container spacing={3}>
          {mockAchievements.map((achievement) => (
            <Grid item xs={12} sm={6} md={4} key={achievement.id}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h2" sx={{ mb: 2 }}>
                    {achievement.icon}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {achievement.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {achievement.description}
                  </Typography>
                  <Chip
                    label={new Date(achievement.date).toLocaleDateString()}
                    color="primary"
                    size="small"
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </LearnerLayout>
  );
}
