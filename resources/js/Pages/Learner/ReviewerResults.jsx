import React from 'react';
import LearnerLayout from '@/Layouts/LearnerLayout';
import { Head, router } from '@inertiajs/react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  Divider,
  Alert,
  LinearProgress,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Quiz as QuizIcon,
  Timer as TimerIcon,
  TrendingUp as TrendingUpIcon,
  Refresh as RefreshIcon,
  ArrowBack as ArrowBackIcon,
  School as SchoolIcon
} from '@mui/icons-material';

export default function ReviewerResults({ 
  auth, 
  learner = {}, 
  attempt = {},
  questionnaire = {},
  questions = [],
  answers = [],
  flash = {} 
}) {
  const totalQuestions = questions.length;
  const correctAnswers = answers.filter(answer => answer.is_correct).length;
  const wrongAnswers = totalQuestions - correctAnswers;
  const scorePercentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getScoreMessage = (score) => {
    if (score >= 90) return 'Excellent work! Outstanding performance!';
    if (score >= 80) return 'Great job! Very good performance!';
    if (score >= 70) return 'Good work! Keep it up!';
    if (score >= 60) return 'Fair performance. Room for improvement.';
    return 'Keep studying and try again. You can do better!';
  };

  return (
    <LearnerLayout auth={auth} selectedSection="reviewers" title="Reviewer Results">
      <Head title={`Results - ${questionnaire.title}`} />

      <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
        {/* Header */}
        <Paper elevation={2} sx={{ p: 4, mb: 4, bgcolor: 'primary.main', color: 'white', textAlign: 'center' }}>
          <SchoolIcon sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h3" sx={{ fontWeight: 600, mb: 1 }}>
            Reviewer Complete!
          </Typography>
          <Typography variant="h5" sx={{ opacity: 0.9 }}>
            {questionnaire.title}
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.8, mt: 1 }}>
            {questionnaire.subject?.subject_name || 'General'}
          </Typography>
        </Paper>

        {/* Score Overview */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Card sx={{ textAlign: 'center', bgcolor: getScoreColor(scorePercentage) + '.light' }}>
              <CardContent>
                <Typography variant="h2" sx={{ fontWeight: 700, color: getScoreColor(scorePercentage) + '.dark' }}>
                  {scorePercentage}%
                </Typography>
                <Typography variant="h6" color={getScoreColor(scorePercentage) + '.dark'}>
                  Final Score
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Card sx={{ textAlign: 'center' }}>
              <CardContent>
                <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 600, color: 'success.main' }}>
                  {correctAnswers}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Correct Answers
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Card sx={{ textAlign: 'center' }}>
              <CardContent>
                <CancelIcon sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 600, color: 'error.main' }}>
                  {wrongAnswers}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Wrong Answers
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Card sx={{ textAlign: 'center' }}>
              <CardContent>
                <TimerIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 600, color: 'info.main' }}>
                  {formatTime(attempt.time_taken || 0)}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Time Taken
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Performance Message */}
        <Alert 
          severity={getScoreColor(scorePercentage)} 
          sx={{ mb: 4, fontSize: '1.1rem', fontWeight: 500 }}
          icon={<TrendingUpIcon fontSize="large" />}
        >
          {getScoreMessage(scorePercentage)}
        </Alert>

        {/* Progress Bar */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Performance Breakdown</Typography>
              <Chip 
                label={`${correctAnswers}/${totalQuestions} Correct`}
                color={getScoreColor(scorePercentage)}
                variant="outlined"
              />
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={scorePercentage} 
              sx={{ 
                height: 12, 
                borderRadius: 6,
                bgcolor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  bgcolor: getScoreColor(scorePercentage) + '.main'
                }
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="body2" color="text.secondary">0%</Typography>
              <Typography variant="body2" color="text.secondary">100%</Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Question Review */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center' }}>
              <QuizIcon sx={{ mr: 1 }} />
              Question Review
            </Typography>
            
            {questions.map((question, index) => {
              const userAnswer = answers.find(a => a.fk_question_id === question.question_id);
              const isCorrect = userAnswer?.is_correct || false;
              const selectedOption = userAnswer?.selected_option || 'Not Answered';
              
              return (
                <Box key={question.question_id} sx={{ mb: 3 }}>
                  <Paper 
                    elevation={1} 
                    sx={{ 
                      p: 3, 
                      border: 2, 
                      borderColor: isCorrect ? 'success.light' : 'error.light',
                      bgcolor: isCorrect ? 'success.50' : 'error.50'
                    }}
                  >
                    {/* Question Header */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Question {index + 1}
                      </Typography>
                      <Chip
                        icon={isCorrect ? <CheckCircleIcon /> : <CancelIcon />}
                        label={isCorrect ? 'Correct' : 'Wrong'}
                        color={isCorrect ? 'success' : 'error'}
                        variant="filled"
                      />
                    </Box>

                    {/* Question Text */}
                    <Typography variant="body1" sx={{ mb: 3, fontWeight: 500 }}>
                      {question.question_text}
                    </Typography>

                    {/* Options */}
                    <Grid container spacing={2}>
                      {['A', 'B', 'C', 'D'].map((option) => {
                        const optionText = question[`option_${option.toLowerCase()}`];
                        if (!optionText) return null;
                        
                        const isCorrectAnswer = option === (question.ans_key || question.correct_answer);
                        const isUserAnswer = option === selectedOption;
                        
                        let bgcolor = 'transparent';
                        let borderColor = 'divider';
                        let textColor = 'text.primary';
                        
                        if (isCorrectAnswer) {
                          bgcolor = 'success.light';
                          borderColor = 'success.main';
                          textColor = 'success.dark';
                        } else if (isUserAnswer && !isCorrectAnswer) {
                          bgcolor = 'error.light';
                          borderColor = 'error.main';
                          textColor = 'error.dark';
                        }
                        
                        return (
                          <Grid item xs={12} sm={6} key={option}>
                            <Box
                              sx={{
                                p: 2,
                                border: 2,
                                borderColor: borderColor,
                                borderRadius: 2,
                                bgcolor: bgcolor,
                                position: 'relative'
                              }}
                            >
                              <Typography variant="body1" sx={{ color: textColor, fontWeight: 500 }}>
                                <strong>{option}.</strong> {optionText}
                              </Typography>
                              
                              {isCorrectAnswer && (
                                <CheckCircleIcon 
                                  sx={{ 
                                    position: 'absolute', 
                                    top: 8, 
                                    right: 8, 
                                    color: 'success.main' 
                                  }} 
                                />
                              )}
                              
                              {isUserAnswer && !isCorrectAnswer && (
                                <CancelIcon 
                                  sx={{ 
                                    position: 'absolute', 
                                    top: 8, 
                                    right: 8, 
                                    color: 'error.main' 
                                  }} 
                                />
                              )}
                            </Box>
                          </Grid>
                        );
                      })}
                    </Grid>

                    {/* Answer Summary */}
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Your Answer:</strong> {selectedOption} • 
                        <strong> Correct Answer:</strong> {question.ans_key || question.correct_answer}
                      </Typography>
                    </Box>
                  </Paper>
                </Box>
              );
            })}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 4 }}>
          <Button
            variant="outlined"
            size="large"
            startIcon={<ArrowBackIcon />}
            onClick={() => router.visit('/learner/reviewers')}
          >
            Back to Study Materials
          </Button>
          
          <Button
            variant="contained"
            size="large"
            startIcon={<RefreshIcon />}
            onClick={() => router.visit(`/learner/reviewers/${questionnaire.qn_id}/take`)}
          >
            Take Again
          </Button>
        </Box>
      </Box>
    </LearnerLayout>
  );
}
