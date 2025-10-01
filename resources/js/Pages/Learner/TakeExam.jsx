import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import LearnerLayout from '@/Layouts/LearnerLayout';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  LinearProgress,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
  Grid,
  Divider
} from '@mui/material';
import {
  Timer as TimerIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
  Send as SubmitIcon
} from '@mui/icons-material';

export default function TakeExam({
  auth,
  learner = {},
  questionnaire = {},
  questions = [],
  existingAttempt = null,
  flash = {}
}) {
  // Pagination by sets of 10 questions
  const PAGE_SIZE = 10;
  const [currentSet, setCurrentSet] = useState(0); // zero-based set index
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  const [sessionKey, setSessionKey] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [showResultDialog, setShowResultDialog] = useState(false);

  const title = questionnaire?.title || 'Exam';
  const subjectName = questionnaire?.subject?.subject_name || 'General';
  const timeLimit = questionnaire?.time_duration || 30; // minutes

  // Initialize session and timer similar to TakeReviewer
  useEffect(() => {
    if (!learner?.learner_id || !questionnaire?.qn_id) return;
    const key = `exam_${questionnaire.qn_id}_${learner.learner_id}`;
    setSessionKey(key);
  }, [learner?.learner_id, questionnaire?.qn_id]);

  useEffect(() => {
    if (!sessionKey) return;
    const total = (timeLimit || 30) * 60;
    const saved = localStorage.getItem(sessionKey);
    if (saved) {
      try {
        const s = JSON.parse(saved);
        const remaining = s.timeRemaining ?? Math.max(0, s.totalTime - Math.floor((Date.now() - s.startTime) / 1000));
        setTimeRemaining(remaining > 0 ? remaining : 0);
      } catch {
        setTimeRemaining(total);
        localStorage.setItem(sessionKey, JSON.stringify({ startTime: Date.now(), totalTime: total, timeRemaining: total, answers: {}, currentQuestion: 0 }));
      }
    } else {
      setTimeRemaining(total);
      localStorage.setItem(sessionKey, JSON.stringify({ startTime: Date.now(), totalTime: total, timeRemaining: total, answers: {}, currentQuestion: 0 }));
    }
    // Auto-start exam once timer is initialized
    setExamStarted(true);
  }, [sessionKey, timeLimit]);

  useEffect(() => {
    if (!examStarted || timeRemaining == null) return;
    const t = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [examStarted, timeRemaining]);

  // Prevent page refresh/back button
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (examStarted) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    const handlePopState = (e) => {
      if (examStarted) {
        e.preventDefault();
        setShowWarningDialog(true);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [examStarted]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    const percentage = (timeRemaining / (timeLimit * 60)) * 100;
    if (percentage <= 10) return 'error';
    if (percentage <= 25) return 'warning';
    return 'primary';
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleStartExam = () => {
    setExamStarted(true);
  };

  // Scroll to top on set change so the next set starts at the top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentSet]);

  // When redirected back after submission, if exam_result is present in flash, show results popup
  useEffect(() => {
    if (flash?.exam_result) {
      setShowResultDialog(true);
    }
  }, [flash?.exam_result]);

  const totalSets = Math.ceil((questions?.length || 0) / PAGE_SIZE);

  const handleNextSet = () => {
    if (currentSet < totalSets - 1) {
      setCurrentSet(prev => prev + 1);
    }
  };

  const handlePrevSet = () => {
    if (currentSet > 0) {
      setCurrentSet(prev => prev - 1);
    }
  };

  const handleSubmitExam = () => {
    setSubmitError(null);
    setSubmitting(true);
    const formData = {
      questionnaire_id: questionnaire.qn_id,
      answers: answers,
      time_taken: Math.max(0, (timeLimit * 60) - (timeRemaining || 0))
    };
    router.post(route('learner.exams.submit'), formData, {
      onSuccess: () => {
        if (sessionKey) localStorage.removeItem(sessionKey);
      },
      onError: (errors) => {
        console.error('Submission failed:', errors);
        // Pull first error message if available
        const first = errors?.error || Object.values(errors || {})[0];
        setSubmitError(first || 'Submission failed. Please try again.');
      },
      onFinish: () => setSubmitting(false)
    });
  };

  const handleAutoSubmit = () => {
    // Auto-submit when time runs out
    handleSubmitExam();
  };

  const getAnsweredCount = () => Object.keys(answers).length;

  const getProgressPercentage = () => {
    return questions.length > 0 ? Math.round((getAnsweredCount() / questions.length) * 100) : 0;
  };

  // If already completed, show done screen with Home button (no answers/results)
  if (existingAttempt && existingAttempt.status === 'completed') {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', py: 8 }}>
        <Head title={`Exam Completed - ${title}`} />
        <Container maxWidth="sm">
          <Card sx={{ textAlign: 'center', p: 6 }}>
            <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>Exam Completed</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              You have completed this exam. You can return to your dashboard.
            </Typography>
            <Button variant="contained" onClick={() => router.visit(route('learner.exams'))}>Go to Exams</Button>
          </Card>
        </Container>
      </Box>
    );
  }

  // Remove pre-start screen; exam starts immediately (like TakeReviewer)

  const startIndex = currentSet * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, questions.length);
  const currentQuestions = questions.slice(startIndex, endIndex);

  return (
    <LearnerLayout auth={auth} selectedSection="exams" title={`Take Exam - ${title}`}>
      <Head title={`Taking: ${title}`} />

      {flash?.success && (
        <Alert severity="success" sx={{ mb: 2 }}>{flash.success}</Alert>
      )}
      {flash?.error && (
        <Alert severity="error" sx={{ mb: 2 }}>{flash.error}</Alert>
      )}

      {/* Header (match TakeReviewer) */}
      <Box sx={{ maxWidth: 900, mx: 'auto' }}>
        <Paper elevation={1} sx={{ p: 3, mb: 3, bgcolor: 'primary.main', color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                {title}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                {subjectName}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <TimerIcon sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {formatTime(timeRemaining || 0)}
              </Typography>
              <Typography variant="caption">Time Remaining</Typography>
            </Box>
          </Box>
        </Paper>

        {/* Progress */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">
                Questions {questions.length ? `${startIndex + 1}-${endIndex}` : '0-0'} of {questions.length}
              </Typography>
              <Chip 
                label={`${Math.round(getProgressPercentage())}% Complete`}
                color="primary"
                variant="outlined"
              />
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={getProgressPercentage()} 
              sx={{ height: 8, borderRadius: 4 }}
            />
          </CardContent>
        </Card>

        {/* Question Set (10 per page) */}
        {currentQuestions.map((q, idx) => (
          <Card key={q.question_id} sx={{ mb: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                <AssignmentIcon sx={{ color: 'primary.main', mr: 2, mt: 0.5 }} />
                <Typography variant="h6" sx={{ fontWeight: 500, lineHeight: 1.4 }}>
                  {(startIndex + idx + 1)}. {q.question_text}
                </Typography>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <RadioGroup
                value={answers[q.question_id] || ''}
                onChange={(e) => handleAnswerChange(q.question_id, e.target.value)}
              >
                {['A', 'B', 'C', 'D'].map((option) => {
                  const optionText = q[`option_${option.toLowerCase()}`];
                  if (!optionText) return null;
                  return (
                    <FormControlLabel
                      key={option}
                      value={option}
                      control={<Radio />}
                      label={
                        <Box sx={{ py: 1 }}>
                          <Typography variant="body1">
                            <strong>{option}.</strong> {optionText}
                          </Typography>
                        </Box>
                      }
                      sx={{
                        mb: 1,
                        p: 2,
                        border: '1px solid',
                        borderColor: answers[q.question_id] === option ? 'primary.main' : 'divider',
                        borderRadius: 2,
                        bgcolor: answers[q.question_id] === option ? 'primary.light' : 'transparent',
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                    />
                  );
                })}
              </RadioGroup>
            </CardContent>
          </Card>
        ))}

        {/* Set Navigation */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button
                variant="outlined"
                onClick={handlePrevSet}
                disabled={currentSet === 0}
              >
                Previous 10
              </Button>

              <Typography variant="body2" color="text.secondary">
                {getAnsweredCount()} of {questions.length} answered
              </Typography>

              {currentSet === totalSets - 1 ? (
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => setShowSubmitDialog(true)}
                  disabled={Object.keys(answers).length === 0}
                  sx={{ minWidth: 120 }}
                >
                  Submit Exam
                </Button>
              ) : (
                <Button variant="contained" onClick={handleNextSet}>Next 10</Button>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>
      {/* Warning Dialog */}
      <Dialog open={showSubmitDialog} onClose={() => setShowSubmitDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Submit Exam</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to submit your exam?
          </Typography>

          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              You have answered {getAnsweredCount()} out of {questions.length} questions.
              {getAnsweredCount() < questions.length && (
                <span> Unanswered questions will be marked as incorrect.</span>
              )}
            </Typography>
          </Alert>

          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {submitError}
            </Alert>
          )}

          {flash?.success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {flash.success}
            </Alert>
          )}
          {flash?.error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {flash.error}
            </Alert>
          )}

          <Typography variant="body2" color="text.secondary">
            Time remaining: {formatTime(timeRemaining)}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSubmitDialog(false)}>Continue Exam</Button>
          <Button onClick={handleSubmitExam} variant="contained" color="success" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Final Answers'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Results Dialog after submission */}
      <Dialog open={showResultDialog} onClose={() => setShowResultDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Exam Submitted</DialogTitle>
        <DialogContent>
          {flash?.exam_result ? (
            <Box>
              <Alert severity={flash.exam_result.passed ? 'success' : 'warning'} sx={{ mb: 2 }}>
                {flash.exam_result.passed ? 'Passed' : 'Completed'} — Score: {flash.exam_result.percentage}%
              </Alert>
              <Grid container spacing={2} sx={{ mb: 1 }}>
                <Grid item xs={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">Total</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>{flash.exam_result.total}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">Correct</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 600, color: 'success.main' }}>{flash.exam_result.correct}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">Wrong</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 600, color: 'error.main' }}>{flash.exam_result.wrong}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">Percentage</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>{flash.exam_result.percentage}%</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              <Typography variant="caption" color="text.secondary">
                Note: Exam submission also serves as attendance. This will be aligned with CAI attendance tracking.
              </Typography>
            </Box>
          ) : (
            <Typography variant="body2">No results to display.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => router.visit(route('learner.exams'))}>Go to Exams</Button>
          <Button variant="contained" onClick={() => setShowResultDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </LearnerLayout>
  );
}
