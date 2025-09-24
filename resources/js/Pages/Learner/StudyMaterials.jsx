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
  LinearProgress,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Tabs,
  Tab,
  Badge,
  Avatar,
  Divider
} from '@mui/material';
import {
  BookmarkBorder as BookmarkIcon,
  Quiz as QuizIcon,
  Assignment as AssignmentIcon,
  PlayArrow as PlayArrowIcon,
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  Description as DescriptionIcon,
  School as SchoolIcon,
  Timer as TimerIcon,
  Close as CloseIcon
} from '@mui/icons-material';

export default function StudyMaterials({ 
  auth, 
  learner = {}, 
  reviewers = [],
  modules = [],
  progress = {},
  flash = {}
}) {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedReviewer, setSelectedReviewer] = useState(null);
  const [showReviewerDialog, setShowReviewerDialog] = useState(false);

  // Use actual data from backend
  const actualReviewers = reviewers || [];
  const actualModules = modules || [];


  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'warning';
      case 'not_started': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon color="success" />;
      case 'in_progress': return <TimerIcon color="warning" />;
      case 'not_started': return <ScheduleIcon color="disabled" />;
      default: return <QuizIcon />;
    }
  };

  const getDifficultyColor = (difficulty) => {
    if (!difficulty) return 'default';
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'error';
      default: return 'default';
    }
  };

  const handleStartReviewer = (reviewer) => {
    if (!reviewer.available) {
      alert('This reviewer is not yet available');
      return;
    }
    
    setSelectedReviewer(reviewer);
    setShowReviewerDialog(true);
  };

  const handleConfirmStart = () => {
    if (selectedReviewer) {
      router.visit(route('learner.reviewers.take', selectedReviewer.id));
    }
  };

  const handleDownloadModule = (moduleId) => {
    router.visit(route('learner.modules.download', moduleId));
  };

  const calculateOverallProgress = () => {
    if (actualReviewers.length === 0) return 0;
    const completed = actualReviewers.filter(r => r.completion_status === 'completed').length;
    return Math.round((completed / actualReviewers.length) * 100);
  };

  return (
    <LearnerLayout auth={auth} selectedSection="reviewers" title="Study Materials">
      <Head title="Study Materials" />

      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
          Study Materials
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Access reviewers, practice tests, and learning modules
        </Typography>
      </Box>

      {flash.success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {flash.success}
        </Alert>
      )}

      {/* Progress Overview */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <QuizIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {actualReviewers.filter(r => r.completion_status === 'completed').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completed Reviewers
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUpIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {calculateOverallProgress()}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Overall Progress
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <StarIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {Math.round(actualReviewers.filter(r => r.score > 0).reduce((acc, r) => acc + r.score, 0) / actualReviewers.filter(r => r.score > 0).length) || 0}
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
              <DescriptionIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {actualModules.filter(m => m.downloaded).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Downloaded Modules
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Progress Bar */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Study Progress</Typography>
            <Typography variant="h6" color="primary.main">
              {calculateOverallProgress()}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={calculateOverallProgress()}
            sx={{ height: 10, borderRadius: 5 }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {actualReviewers.filter(r => r.completion_status === 'completed').length} of {actualReviewers.length} reviewers completed
          </Typography>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={selectedTab}
          onChange={(e, newValue) => setSelectedTab(newValue)}
          variant="fullWidth"
        >
          <Tab 
            label={
              <Badge badgeContent={actualReviewers.length} color="primary">
                Practice Reviewers
              </Badge>
            } 
          />
          <Tab 
            label={
              <Badge badgeContent={actualModules.length} color="secondary">
                Learning Modules
              </Badge>
            } 
          />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {selectedTab === 0 && (
        <Grid container spacing={3}>
          {actualReviewers.length === 0 ? (
            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 6 }}>
                  <QuizIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No Reviewers Available
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Your CAI hasn't posted any reviewers yet. Check back later!
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ) : (
            actualReviewers.map((reviewer) => (
            <Grid item xs={12} md={6} lg={4} key={reviewer.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  opacity: reviewer.available ? 1 : 0.6,
                  border: reviewer.completion_status === 'completed' ? '2px solid' : '1px solid',
                  borderColor: reviewer.completion_status === 'completed' ? 'success.main' : 'divider'
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
                      {reviewer.title}
                    </Typography>
                    {getStatusIcon(reviewer.completion_status)}
                  </Box>

                  <Chip
                    label={reviewer.subject || 'General'}
                    color="primary"
                    size="small"
                    sx={{ mb: 1, mr: 1 }}
                  />
                  <Chip
                    label={(reviewer.type || 'REVIEWER').toUpperCase()}
                    color="secondary"
                    size="small"
                    sx={{ mb: 1, mr: 1 }}
                  />
                  <Chip
                    label={reviewer.difficulty || 'Beginner'}
                    color={getDifficultyColor(reviewer.difficulty || 'beginner')}
                    size="small"
                    sx={{ mb: 2 }}
                  />

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {reviewer.description || 'No description available'}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Questions: {reviewer.questions_count || 0} • Time: {reviewer.time_duration || 30} mins
                    </Typography>
                  </Box>

                  {reviewer.completion_status === 'completed' && (
                    <Box sx={{ mb: 2, p: 1, bgcolor: 'success.light', borderRadius: 1 }}>
                      <Typography variant="body2" color="success.dark">
                        Score: {reviewer.score || 0}% • Attempts: {reviewer.attempts || 0}
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      fullWidth
                      variant={reviewer.completion_status === 'completed' ? 'outlined' : 'contained'}
                      startIcon={<PlayArrowIcon />}
                      onClick={() => handleStartReviewer(reviewer)}
                      disabled={!reviewer.available}
                    >
                      {reviewer.completion_status === 'completed' ? 'Retake' : 'Start'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            ))
          )}
        </Grid>
      )}

      {selectedTab === 1 && (
        <Grid container spacing={3}>
          {actualModules.length === 0 ? (
            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 6 }}>
                  <DescriptionIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No Modules Available
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    No learning modules have been uploaded for your CLC yet.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ) : (
            actualModules.map((module) => (
            <Grid item xs={12} md={6} key={module.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      <DescriptionIcon />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {module.title}
                      </Typography>
                      <Chip
                        label={module.subject}
                        color="primary"
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {module.description}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      {module.file_type} • {module.file_size}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Uploaded: {new Date(module.uploaded_date).toLocaleDateString()}
                    </Typography>
                  </Box>

                  {module.downloaded && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                      <Typography variant="body2">
                        Downloaded {module.download_count} time(s)
                      </Typography>
                    </Alert>
                  )}

                  <Button
                    fullWidth
                    variant={module.downloaded ? 'outlined' : 'contained'}
                    startIcon={<DownloadIcon />}
                    onClick={() => handleDownloadModule(module.id)}
                  >
                    {module.downloaded ? 'Download Again' : 'Download'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            ))
          )}
        </Grid>
      )}

      {/* Start Reviewer Confirmation Dialog */}
      <Dialog open={showReviewerDialog} onClose={() => setShowReviewerDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Start Reviewer: {selectedReviewer?.title}
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            You are about to start a timed reviewer. Make sure you have a stable internet connection.
          </Alert>
          
          {selectedReviewer && (
            <Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Subject:</strong> {selectedReviewer.subject || 'General'}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Questions:</strong> {selectedReviewer.questions_count || 0}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Time Limit:</strong> {selectedReviewer.time_duration || 30} minutes
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Difficulty:</strong> {selectedReviewer.difficulty || 'Beginner'}
              </Typography>
              
              {(selectedReviewer.attempts || 0) > 0 && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  You have already attempted this reviewer {selectedReviewer.attempts || 0} time(s). 
                  Your best score: {selectedReviewer.score || 0}%
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowReviewerDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirmStart} variant="contained">
            Start Reviewer
          </Button>
        </DialogActions>
      </Dialog>
    </LearnerLayout>
  );
}
