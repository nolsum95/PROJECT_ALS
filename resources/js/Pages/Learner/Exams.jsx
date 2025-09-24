import React, { useState } from 'react';
import LearnerLayout from '@/Layouts/LearnerLayout';
import { Head, router } from '@inertiajs/react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Tabs,
  Tab,
  Badge,
  Avatar,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  Schedule as ScheduleIcon,
  PlayArrow as PlayArrowIcon,
  CheckCircle as CheckCircleIcon,
  Timer as TimerIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarIcon,
  AccessTime as AccessTimeIcon,
  Assignment as AssignmentIcon,
  Grade as GradeIcon,
  Warning as WarningIcon,
  Info as InfoIcon
} from '@mui/icons-material';

export default function Exams({ 
  auth, 
  learner = {}, 
  availableExams = [],
  examHistory = [],
  upcomingExams = [],
  flash = {}
}) {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedExam, setSelectedExam] = useState(null);
  const [showExamDialog, setShowExamDialog] = useState(false);

  // Mock data for demonstration
  const mockAvailableExams = availableExams.length > 0 ? availableExams : [
    {
      id: 1,
      title: 'Mathematics Pretest',
      subject: 'Mathematics',
      type: 'pretest',
      description: 'Assessment of basic mathematical skills',
      questions_count: 40,
      time_duration: 90,
      passing_score: 75,
      available_from: '2025-01-15T08:00:00',
      available_until: '2025-01-15T17:00:00',
      status: 'available',
      attempts_allowed: 1,
      current_attempts: 0
    },
    {
      id: 2,
      title: 'English Communication Test',
      subject: 'English',
      type: 'posttest',
      description: 'Comprehensive English language assessment',
      questions_count: 35,
      time_duration: 75,
      passing_score: 80,
      available_from: '2025-01-20T08:00:00',
      available_until: '2025-01-20T17:00:00',
      status: 'upcoming',
      attempts_allowed: 1,
      current_attempts: 0
    },
    {
      id: 3,
      title: 'Science Knowledge Test',
      subject: 'Science',
      type: 'quiz',
      description: 'Basic science concepts and principles',
      questions_count: 25,
      time_duration: 60,
      passing_score: 70,
      available_from: '2025-01-10T08:00:00',
      available_until: '2025-01-10T17:00:00',
      status: 'completed',
      attempts_allowed: 2,
      current_attempts: 1
    }
  ];

  const mockExamHistory = examHistory.length > 0 ? examHistory : [
    {
      id: 1,
      exam_title: 'Science Knowledge Test',
      subject: 'Science',
      type: 'quiz',
      date_taken: '2025-01-10T10:30:00',
      score: 85,
      passing_score: 70,
      time_taken: 45,
      time_limit: 60,
      status: 'passed',
      attempt_number: 1
    },
    {
      id: 2,
      exam_title: 'Filipino Language Test',
      subject: 'Filipino',
      type: 'pretest',
      date_taken: '2025-01-08T14:15:00',
      score: 78,
      passing_score: 75,
      time_taken: 70,
      time_limit: 80,
      status: 'passed',
      attempt_number: 1
    }
  ];

  const mockUpcomingExams = upcomingExams.length > 0 ? upcomingExams : [
    {
      id: 1,
      title: 'Mathematics Pretest',
      subject: 'Mathematics',
      scheduled_date: '2025-01-15T09:00:00',
      duration: 90,
      type: 'pretest'
    },
    {
      id: 2,
      title: 'English Communication Test',
      subject: 'English',
      scheduled_date: '2025-01-20T10:00:00',
      duration: 75,
      type: 'posttest'
    }
  ];

  const getExamStatusColor = (status) => {
    switch (status) {
      case 'available': return 'success';
      case 'upcoming': return 'warning';
      case 'completed': return 'info';
      case 'expired': return 'error';
      default: return 'default';
    }
  };

  const getExamStatusIcon = (status) => {
    switch (status) {
      case 'available': return <PlayArrowIcon color="success" />;
      case 'upcoming': return <ScheduleIcon color="warning" />;
      case 'completed': return <CheckCircleIcon color="info" />;
      case 'expired': return <WarningIcon color="error" />;
      default: return <AssessmentIcon />;
    }
  };

  const getResultStatusColor = (status) => {
    switch (status) {
      case 'passed': return 'success';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const handleStartExam = (exam) => {
    if (exam.status !== 'available') {
      alert('This exam is not currently available');
      return;
    }
    
    if (exam.current_attempts >= exam.attempts_allowed) {
      alert('You have reached the maximum number of attempts for this exam');
      return;
    }
    
    setSelectedExam(exam);
    setShowExamDialog(true);
  };

  const handleConfirmStartExam = () => {
    if (selectedExam) {
      router.visit(route('learner.exams.take', selectedExam.id));
    }
  };

  const calculateOverallPerformance = () => {
    if (mockExamHistory.length === 0) return 0;
    const totalScore = mockExamHistory.reduce((acc, exam) => acc + exam.score, 0);
    return Math.round(totalScore / mockExamHistory.length);
  };

  const getPassedExams = () => {
    return mockExamHistory.filter(exam => exam.status === 'passed').length;
  };

  return (
    <LearnerLayout auth={auth} selectedSection="exams" title="Exams & Tests">
      <Head title="Exams & Tests" />

      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
          Exams & Tests
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Take official exams and view your test results
        </Typography>
      </Box>

      {flash.success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {flash.success}
        </Alert>
      )}

      {flash.error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {flash.error}
        </Alert>
      )}

      {/* Performance Overview */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <AssessmentIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {mockExamHistory.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Exams Taken
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {getPassedExams()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Exams Passed
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <StarIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {calculateOverallPerformance()}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Average Score
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <ScheduleIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {mockUpcomingExams.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Upcoming Exams
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Performance Progress */}
      {mockExamHistory.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Exam Performance</Typography>
              <Typography variant="h6" color="primary.main">
                {getPassedExams()}/{mockExamHistory.length} Passed
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={(getPassedExams() / mockExamHistory.length) * 100}
              sx={{ height: 10, borderRadius: 5 }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Pass Rate: {Math.round((getPassedExams() / mockExamHistory.length) * 100)}%
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={selectedTab}
          onChange={(e, newValue) => setSelectedTab(newValue)}
          variant="fullWidth"
        >
          <Tab 
            label={
              <Badge badgeContent={mockAvailableExams.filter(e => e.status === 'available').length} color="success">
                Available Exams
              </Badge>
            } 
          />
          <Tab 
            label={
              <Badge badgeContent={mockUpcomingExams.length} color="warning">
                Upcoming Exams
              </Badge>
            } 
          />
          <Tab 
            label={
              <Badge badgeContent={mockExamHistory.length} color="info">
                Exam History
              </Badge>
            } 
          />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {selectedTab === 0 && (
        <Grid container spacing={3}>
          {mockAvailableExams.map((exam) => (
            <Grid item xs={12} md={6} lg={4} key={exam.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  border: exam.status === 'available' ? '2px solid' : '1px solid',
                  borderColor: exam.status === 'available' ? 'success.main' : 'divider'
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
                      {exam.title}
                    </Typography>
                    {getExamStatusIcon(exam.status)}
                  </Box>

                  <Chip
                    label={exam.subject}
                    color="primary"
                    size="small"
                    sx={{ mb: 1, mr: 1 }}
                  />
                  <Chip
                    label={exam.type.toUpperCase()}
                    color="secondary"
                    size="small"
                    sx={{ mb: 1, mr: 1 }}
                  />
                  <Chip
                    label={exam.status.toUpperCase()}
                    color={getExamStatusColor(exam.status)}
                    size="small"
                    sx={{ mb: 2 }}
                  />

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {exam.description}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Questions: {exam.questions_count} • Time: {exam.time_duration} mins
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Passing Score: {exam.passing_score}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Attempts: {exam.current_attempts}/{exam.attempts_allowed}
                    </Typography>
                  </Box>

                  {exam.status === 'available' && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      <Typography variant="body2">
                        Available until: {new Date(exam.available_until).toLocaleString()}
                      </Typography>
                    </Alert>
                  )}

                  <Button
                    fullWidth
                    variant={exam.status === 'available' ? 'contained' : 'outlined'}
                    startIcon={<PlayArrowIcon />}
                    onClick={() => handleStartExam(exam)}
                    disabled={exam.status !== 'available' || exam.current_attempts >= exam.attempts_allowed}
                  >
                    {exam.status === 'available' ? 'Take Exam' : exam.status.toUpperCase()}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {selectedTab === 1 && (
        <Grid container spacing={3}>
          {mockUpcomingExams.map((exam) => (
            <Grid item xs={12} md={6} key={exam.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                      <CalendarIcon />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {exam.title}
                      </Typography>
                      <Chip
                        label={exam.subject}
                        color="primary"
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CalendarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      {new Date(exam.scheduled_date).toLocaleDateString()}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AccessTimeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      {new Date(exam.scheduled_date).toLocaleTimeString()} ({exam.duration} minutes)
                    </Typography>
                  </Box>

                  <Alert severity="warning" sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      Exam will be available on the scheduled date and time.
                    </Typography>
                  </Alert>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {selectedTab === 2 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Exam</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Date Taken</TableCell>
                <TableCell>Score</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockExamHistory.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2">{exam.exam_title}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {exam.type.toUpperCase()} • Attempt #{exam.attempt_number}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{exam.subject}</TableCell>
                  <TableCell>
                    {new Date(exam.date_taken).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2">
                        {exam.score}%
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Passing: {exam.passing_score}%
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {exam.time_taken}/{exam.time_limit} mins
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={exam.status.toUpperCase()}
                      color={getResultStatusColor(exam.status)}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Start Exam Confirmation Dialog */}
      <Dialog open={showExamDialog} onClose={() => setShowExamDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Start Exam: {selectedExam?.title}
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Important:</strong> This is an official exam. Once started, you cannot pause or restart. 
              Make sure you have a stable internet connection and enough time to complete the exam.
            </Typography>
          </Alert>
          
          {selectedExam && (
            <Box>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Subject:</strong> {selectedExam.subject}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Questions:</strong> {selectedExam.questions_count}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Time Limit:</strong> {selectedExam.time_duration} minutes
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Passing Score:</strong> {selectedExam.passing_score}%
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Attempts Remaining:</strong> {selectedExam.attempts_allowed - selectedExam.current_attempts}
              </Typography>
              
              <Alert severity="info">
                <Typography variant="body2">
                  Your attendance will be automatically recorded when you start this exam.
                </Typography>
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowExamDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirmStartExam} variant="contained" color="primary">
            Start Exam
          </Button>
        </DialogActions>
      </Dialog>
    </LearnerLayout>
  );
}
