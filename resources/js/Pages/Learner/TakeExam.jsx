import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
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
  exam = {}, 
  questions = [],
  timeLimit = 90,
  flash = {}
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(timeLimit * 60); // Convert to seconds
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [examStarted, setExamStarted] = useState(false);

  // Mock exam data
  const mockExam = {
    id: exam.id || 1,
    title: exam.title || 'Mathematics Pretest',
    subject: exam.subject || 'Mathematics',
    type: exam.type || 'pretest',
    description: exam.description || 'Assessment of basic mathematical skills',
    passing_score: exam.passing_score || 75,
    ...exam
  };

  const mockQuestions = questions.length > 0 ? questions : [
    {
      id: 1,
      question_text: "What is 15 + 27?",
      option_a: "40",
      option_b: "42",
      option_c: "44",
      option_d: "46",
      ans_key: "B"
    },
    {
      id: 2,
      question_text: "If x + 5 = 12, what is the value of x?",
      option_a: "5",
      option_b: "6",
      option_c: "7",
      option_d: "8",
      ans_key: "C"
    },
    {
      id: 3,
      question_text: "What is 8 × 9?",
      option_a: "71",
      option_b: "72",
      option_c: "73",
      option_d: "74",
      ans_key: "B"
    },
    {
      id: 4,
      question_text: "What is 144 ÷ 12?",
      option_a: "11",
      option_b: "12",
      option_c: "13",
      option_d: "14",
      ans_key: "B"
    },
    {
      id: 5,
      question_text: "What is 25% of 80?",
      option_a: "15",
      option_b: "20",
      option_c: "25",
      option_d: "30",
      ans_key: "B"
    }
  ];

  // Timer effect
  useEffect(() => {
    if (!examStarted) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examStarted]);

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

  const handleNextQuestion = () => {
    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmitExam = () => {
    const formData = {
      exam_id: mockExam.id,
      answers: answers,
      time_taken: (timeLimit * 60) - timeRemaining,
      completed_at: new Date().toISOString()
    };

    router.post(route('learner.exams.submit'), formData, {
      onSuccess: () => {
        // Redirect to results page
      },
      onError: (errors) => {
        console.error('Submission failed:', errors);
      }
    });
  };

  const handleAutoSubmit = () => {
    // Auto-submit when time runs out
    handleSubmitExam();
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  const getProgressPercentage = () => {
    return Math.round((getAnsweredCount() / mockQuestions.length) * 100);
  };

  if (!examStarted) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', py: 4 }}>
        <Head title={`Take Exam: ${mockExam.title}`} />
        
        <Container maxWidth="md">
          <Card sx={{ textAlign: 'center', p: 4 }}>
            <AssignmentIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
            
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
              {mockExam.title}
            </Typography>
            
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              {mockExam.subject} • {mockExam.type.toUpperCase()}
            </Typography>
            
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={4}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6">{mockQuestions.length}</Typography>
                  <Typography variant="body2" color="text.secondary">Questions</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6">{timeLimit} mins</Typography>
                  <Typography variant="body2" color="text.secondary">Time Limit</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6">{mockExam.passing_score}%</Typography>
                  <Typography variant="body2" color="text.secondary">Passing Score</Typography>
                </Paper>
              </Grid>
            </Grid>
            
            <Alert severity="warning" sx={{ mb: 4, textAlign: 'left' }}>
              <Typography variant="body2">
                <strong>Important Instructions:</strong>
              </Typography>
              <ul style={{ marginTop: 8, paddingLeft: 20 }}>
                <li>Once started, you cannot pause or restart the exam</li>
                <li>Make sure you have a stable internet connection</li>
                <li>Do not refresh the page or navigate away</li>
                <li>Your progress will be automatically saved</li>
                <li>The exam will auto-submit when time runs out</li>
              </ul>
            </Alert>
            
            <Button
              variant="contained"
              size="large"
              startIcon={<AssignmentIcon />}
              onClick={handleStartExam}
              sx={{ px: 4, py: 2, fontSize: '1.1rem' }}
            >
              Start Exam
            </Button>
          </Card>
        </Container>
      </Box>
    );
  }

  const currentQ = mockQuestions[currentQuestion];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Head title={`Taking: ${mockExam.title}`} />
      
      {/* Header */}
      <Paper sx={{ p: 2, mb: 2, position: 'sticky', top: 0, zIndex: 1000 }}>
        <Container maxWidth="lg">
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {mockExam.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Question {currentQuestion + 1} of {mockQuestions.length}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Progress: {getAnsweredCount()}/{mockQuestions.length} answered
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={getProgressPercentage()}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'right' }}>
                <Chip
                  icon={<TimerIcon />}
                  label={formatTime(timeRemaining)}
                  color={getTimeColor()}
                  sx={{ fontSize: '1rem', p: 1 }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Paper>

      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* Question */}
          <Grid item xs={12} md={8}>
            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Question {currentQuestion + 1}
                </Typography>
                
                <Typography variant="h5" sx={{ mb: 4, lineHeight: 1.6 }}>
                  {currentQ.question_text}
                </Typography>
                
                <FormControl component="fieldset" fullWidth>
                  <RadioGroup
                    value={answers[currentQ.id] || ''}
                    onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                  >
                    <FormControlLabel
                      value="A"
                      control={<Radio />}
                      label={
                        <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                          A. {currentQ.option_a}
                        </Typography>
                      }
                      sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 2, mr: 0 }}
                    />
                    <FormControlLabel
                      value="B"
                      control={<Radio />}
                      label={
                        <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                          B. {currentQ.option_b}
                        </Typography>
                      }
                      sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 2, mr: 0 }}
                    />
                    <FormControlLabel
                      value="C"
                      control={<Radio />}
                      label={
                        <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                          C. {currentQ.option_c}
                        </Typography>
                      }
                      sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 2, mr: 0 }}
                    />
                    <FormControlLabel
                      value="D"
                      control={<Radio />}
                      label={
                        <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                          D. {currentQ.option_d}
                        </Typography>
                      }
                      sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 2, mr: 0 }}
                    />
                  </RadioGroup>
                </FormControl>
              </CardContent>
            </Card>

            {/* Navigation */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button
                variant="outlined"
                startIcon={<PrevIcon />}
                onClick={handlePrevQuestion}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              
              <Typography variant="body2" color="text.secondary">
                {currentQuestion + 1} / {mockQuestions.length}
              </Typography>
              
              {currentQuestion === mockQuestions.length - 1 ? (
                <Button
                  variant="contained"
                  startIcon={<SubmitIcon />}
                  onClick={() => setShowSubmitDialog(true)}
                  color="success"
                >
                  Submit Exam
                </Button>
              ) : (
                <Button
                  variant="contained"
                  endIcon={<NextIcon />}
                  onClick={handleNextQuestion}
                >
                  Next
                </Button>
              )}
            </Box>
          </Grid>

          {/* Question Navigator */}
          <Grid item xs={12} md={4}>
            <Card sx={{ position: 'sticky', top: 120 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Question Navigator
                </Typography>
                
                <Grid container spacing={1}>
                  {mockQuestions.map((_, index) => (
                    <Grid item xs={3} key={index}>
                      <Button
                        variant={currentQuestion === index ? 'contained' : 'outlined'}
                        color={answers[mockQuestions[index].id] ? 'success' : 'primary'}
                        onClick={() => setCurrentQuestion(index)}
                        sx={{ width: '100%', minWidth: 0 }}
                      >
                        {index + 1}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ width: 16, height: 16, bgcolor: 'success.main', borderRadius: 1, mr: 1 }} />
                  <Typography variant="body2">Answered</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ width: 16, height: 16, bgcolor: 'primary.main', borderRadius: 1, mr: 1 }} />
                  <Typography variant="body2">Current</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: 16, height: 16, border: '1px solid #ccc', borderRadius: 1, mr: 1 }} />
                  <Typography variant="body2">Not answered</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Submit Confirmation Dialog */}
      <Dialog open={showSubmitDialog} onClose={() => setShowSubmitDialog(false)}>
        <DialogTitle>Submit Exam</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to submit your exam?
          </Typography>
          
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              You have answered {getAnsweredCount()} out of {mockQuestions.length} questions.
              {getAnsweredCount() < mockQuestions.length && (
                <span> Unanswered questions will be marked as incorrect.</span>
              )}
            </Typography>
          </Alert>
          
          <Typography variant="body2" color="text.secondary">
            Time remaining: {formatTime(timeRemaining)}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSubmitDialog(false)}>
            Continue Exam
          </Button>
          <Button onClick={handleSubmitExam} variant="contained" color="success">
            Submit Final Answers
          </Button>
        </DialogActions>
      </Dialog>

      {/* Warning Dialog */}
      <Dialog open={showWarningDialog} onClose={() => setShowWarningDialog(false)}>
        <DialogTitle>
          <WarningIcon color="warning" sx={{ mr: 1 }} />
          Warning
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            You are currently taking an exam. Leaving this page will result in automatic submission 
            of your current answers. Are you sure you want to continue?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowWarningDialog(false)}>
            Stay on Exam
          </Button>
          <Button onClick={() => router.visit(route('learner.exams'))} color="warning">
            Leave Exam
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
