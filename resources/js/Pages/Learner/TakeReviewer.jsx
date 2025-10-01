import React, { useState, useEffect } from 'react';
import LearnerLayout from '@/Layouts/LearnerLayout';
import { Head, router } from '@inertiajs/react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  LinearProgress,
  Alert,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper
} from '@mui/material';
import {
  Timer as TimerIcon,
  Quiz as QuizIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

export default function TakeReviewer({ 
  auth, 
  learner = {}, 
  questionnaire = {},
  questions = [],
  existingAttempt = null,
  flash = {} 
}) {
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionKey, setSessionKey] = useState('');
  const [sessionRestored, setSessionRestored] = useState(false);

  // Generate unique session key for this attempt
  useEffect(() => {
    const key = `reviewer_${questionnaire.qn_id}_${learner.learner_id}`;
    setSessionKey(key);
  }, [questionnaire.qn_id, learner.learner_id]);

  // Initialize timer and restore session
  useEffect(() => {
    if (!sessionKey) return;
    
    // Use default time if not provided (30 minutes)
    const timeDuration = questionnaire.time_duration || 30;
    
    if (!timeDuration) {
      console.warn('No time duration found, using default 30 minutes');
    }

    // Try to restore previous session
    const savedSession = localStorage.getItem(sessionKey);
    
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        
        // Use saved timeRemaining if available, otherwise calculate from start time
        let remaining;
        if (session.timeRemaining !== undefined) {
          // Use the exact time remaining when session was saved
          remaining = Math.max(0, session.timeRemaining);
        } else {
          // Fallback to calculation (for old sessions)
          const now = Date.now();
          const elapsed = Math.floor((now - session.startTime) / 1000);
          remaining = Math.max(0, session.totalTime - elapsed);
        }
        
        if (remaining > 0) {
          // Restore session with exact saved time
          setTimeRemaining(remaining);
          setAnswers(session.answers || {});
          setCurrentQuestion(session.currentQuestion || 0);
          setSessionRestored(true);
          
          // Update session with new start time based on remaining time
          const correctedSession = {
            ...session,
            startTime: Date.now(),
            totalTime: remaining, // Set total time to remaining time for fresh start
            timeRemaining: remaining,
            lastSaved: Date.now()
          };
          localStorage.setItem(sessionKey, JSON.stringify(correctedSession));
          
          console.log(`Session restored: ${remaining}s remaining`);
          
          // Hide restoration message after 3 seconds
          setTimeout(() => setSessionRestored(false), 3000);
        } else {
          // Time expired, clear session and redirect
          console.log('Time expired during offline period, clearing session...');
          localStorage.removeItem(sessionKey);
          router.visit('/learner/reviewers', {
            onSuccess: () => {
              // Show message that time expired
            }
          });
          return;
        }
      } catch (error) {
        console.error('Error restoring session:', error);
        // Start fresh session
        initializeNewSession();
      }
    } else {
      // Start fresh session
      initializeNewSession();
    }

    function initializeNewSession() {
      const totalTime = timeDuration * 60;
      console.log('Initializing new session with time:', totalTime, 'seconds');
      setTimeRemaining(totalTime);
      
      // Save initial session
      const newSession = {
        startTime: Date.now(),
        totalTime: totalTime,
        timeRemaining: totalTime,
        answers: {},
        currentQuestion: 0
      };
      localStorage.setItem(sessionKey, JSON.stringify(newSession));
    }
  }, [sessionKey, questionnaire.time_duration]);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Only auto-submit if there are answers
            if (Object.keys(answers).length > 0) {
              handleAutoSubmit();
            } else {
              // Clear session and redirect if no answers
              clearSession();
              router.visit('/learner/reviewers');
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeRemaining, answers]);

  // Periodic save every 30 seconds (reduced frequency)
  useEffect(() => {
    if (!sessionKey || timeRemaining === null) return;

    const periodicSave = setInterval(() => {
      if (timeRemaining > 0) {
        saveSession();
      }
    }, 30000); // Save every 30 seconds

    return () => clearInterval(periodicSave);
  }, [sessionKey, answers, currentQuestion, timeRemaining]);

  // Handle page unload/refresh (simplified to reduce policy violations)
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (timeRemaining > 0 && Object.keys(answers).length > 0) {
        // Save session without preventDefault to avoid policy violations
        saveSession();
      }
    };

    // Only use beforeunload, remove unload event to reduce violations
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [timeRemaining, answers, sessionKey]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Save session to localStorage with current time remaining
  const saveSession = (updatedAnswers = null, updatedCurrentQuestion = null) => {
    if (!sessionKey) return;
    
    try {
      const savedSession = localStorage.getItem(sessionKey);
      if (savedSession) {
        const session = JSON.parse(savedSession);
        const updatedSession = {
          ...session,
          answers: updatedAnswers || answers,
          currentQuestion: updatedCurrentQuestion !== null ? updatedCurrentQuestion : currentQuestion,
          timeRemaining: timeRemaining, // Save current time remaining
          lastSaved: Date.now()
        };
        localStorage.setItem(sessionKey, JSON.stringify(updatedSession));
      }
    } catch (error) {
      console.error('Error saving session:', error);
    }
  };

  // Clear session from localStorage
  const clearSession = () => {
    if (sessionKey) {
      localStorage.removeItem(sessionKey);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    const updatedAnswers = {
      ...answers,
      [questionId]: answer
    };
    setAnswers(updatedAnswers);
    
    // Save to localStorage immediately
    saveSession(updatedAnswers, null);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      const newQuestion = currentQuestion + 1;
      setCurrentQuestion(newQuestion);
      saveSession(null, newQuestion);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      const newQuestion = currentQuestion - 1;
      setCurrentQuestion(newQuestion);
      saveSession(null, newQuestion);
    }
  };

  const handleSubmit = () => {
    setShowSubmitDialog(true);
  };

  const handleAutoSubmit = () => {
    confirmSubmit();
  };

  const confirmSubmit = () => {
    setIsSubmitting(true);
    
    // Validate that we have answers
    if (Object.keys(answers).length === 0) {
      alert('Please answer at least one question before submitting.');
      setIsSubmitting(false);
      setShowSubmitDialog(false);
      return;
    }
    
    const submissionData = {
      questionnaire_id: questionnaire.qn_id,
      answers: answers,
      time_taken: (questionnaire.time_duration || 30) * 60 - (timeRemaining || 0)
    };

    router.post('/learner/reviewers/submit', submissionData, {
      onSuccess: () => {
        // Clear session on successful submission
        clearSession();
      },
      onError: (errors) => {
        console.error('Submission failed:', errors);
        setIsSubmitting(false);
        setShowSubmitDialog(false);
      }
    });
  };

  const getProgressPercentage = () => {
    const answeredQuestions = Object.keys(answers).length;
    return (answeredQuestions / questions.length) * 100;
  };

  const currentQuestionData = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;
  const isFirstQuestion = currentQuestion === 0;

  if (existingAttempt && existingAttempt.status === 'completed') {
    return (
      <LearnerLayout auth={auth} selectedSection="reviewers" title="Reviewer Completed">
        <Head title="Reviewer Completed" />
        
        <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
                Already Completed
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                You have already completed this reviewer.
              </Typography>
              <Typography variant="h6" color="success.main" sx={{ mb: 3 }}>
                Your Score: {existingAttempt.score}%
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => router.visit('/learner/reviewers')}
              >
                Back to Study Materials
              </Button>
            </CardContent>
          </Card>
        </Box>
      </LearnerLayout>
    );
  }

  return (
    <LearnerLayout auth={auth} selectedSection="reviewers" title="Take Reviewer">
      <Head title={`Take Reviewer - ${questionnaire.title}`}>
        <meta name="permissions-policy" content="unload=*" />
      </Head>

      <Box sx={{ maxWidth: 900, mx: 'auto' }}>
        {/* Session Restored Alert */}
        {sessionRestored && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Session restored! Your progress and timer have been recovered.
          </Alert>
        )}

        {/* Header */}
        <Paper elevation={1} sx={{ p: 3, mb: 3, bgcolor: 'primary.main', color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                {questionnaire.title}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                {questionnaire.subject?.subject_name || 'General'}
              </Typography>
            </Box>
            
            <Box sx={{ textAlign: 'center' }}>
              {timeRemaining !== null && timeRemaining >= 0 ? (
                <>
                  <TimerIcon sx={{ fontSize: 32, mb: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {formatTime(timeRemaining)}
                  </Typography>
                  <Typography variant="caption">
                    Time Remaining
                  </Typography>
                </>
              ) : (
                <>
                  <TimerIcon sx={{ fontSize: 32, mb: 1, opacity: 0.5 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, opacity: 0.5 }}>
                    Loading Timer...
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.5 }}>
                    Time: {timeRemaining} | Duration: {questionnaire.time_duration}
                  </Typography>
                </>
              )}
            </Box>
          </Box>
        </Paper>

        {/* Progress */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">
                Question {currentQuestion + 1} of {questions.length}
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

        {/* Question Card */}
        {currentQuestionData && (
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                <QuizIcon sx={{ color: 'primary.main', mr: 2, mt: 0.5 }} />
                <Typography variant="h6" sx={{ fontWeight: 500, lineHeight: 1.4 }}>
                  {currentQuestionData.question_text}
                </Typography>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <RadioGroup
                value={answers[currentQuestionData.question_id] || ''}
                onChange={(e) => handleAnswerChange(currentQuestionData.question_id, e.target.value)}
              >
                {['A', 'B', 'C', 'D'].map((option) => {
                  const optionText = currentQuestionData[`option_${option.toLowerCase()}`];
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
                        borderColor: answers[currentQuestionData.question_id] === option ? 'primary.main' : 'divider',
                        borderRadius: 2,
                        bgcolor: answers[currentQuestionData.question_id] === option ? 'primary.light' : 'transparent',
                        '&:hover': {
                          bgcolor: 'action.hover'
                        }
                      }}
                    />
                  );
                })}
              </RadioGroup>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button
                variant="outlined"
                onClick={handlePreviousQuestion}
                disabled={isFirstQuestion}
              >
                Previous
              </Button>

              <Typography variant="body2" color="text.secondary">
                {Object.keys(answers).length} of {questions.length} answered
              </Typography>

              {isLastQuestion ? (
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleSubmit}
                  disabled={Object.keys(answers).length === 0}
                  sx={{ minWidth: 120 }}
                >
                  Submit Review
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNextQuestion}
                >
                  Next
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Submit Confirmation Dialog */}
      <Dialog open={showSubmitDialog} onClose={() => setShowSubmitDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <WarningIcon sx={{ color: 'warning.main', mr: 1 }} />
            Submit Reviewer
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to submit your answers?
          </Typography>
          
          <Alert severity="info" sx={{ mb: 2 }}>
            You have answered {Object.keys(answers).length} out of {questions.length} questions.
          </Alert>

          {Object.keys(answers).length < questions.length && (
            <Alert severity="warning">
              You have {questions.length - Object.keys(answers).length} unanswered questions. 
              These will be marked as incorrect.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSubmitDialog(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={confirmSubmit} 
            variant="contained" 
            color="success"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    </LearnerLayout>
  );
}
