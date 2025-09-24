import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Grid,
  IconButton,
  Chip
} from '@mui/material';
import { 
  Close as CloseIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  Quiz as QuizIcon
} from '@mui/icons-material';
import { router } from '@inertiajs/react';

export default function CreateQuestionsModal({ open, onClose, exam }) {
  const [questions, setQuestions] = useState([
    {
      question_text: '',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      ans_key: ''
    },
    {
      question_text: '',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      ans_key: ''
    },
    {
      question_text: '',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      ans_key: ''
    },
    {
      question_text: '',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      ans_key: ''
    }
  ]);
  const [loading, setLoading] = useState(false);

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleReset = () => {
    setQuestions([
      {
        question_text: '',
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        ans_key: ''
      },
      {
        question_text: '',
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        ans_key: ''
      },
      {
        question_text: '',
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        ans_key: ''
      },
      {
        question_text: '',
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        ans_key: ''
      }
    ]);
  };

  const handleSubmit = () => {
    // Validate that at least one question is filled
    const validQuestions = questions.filter(q => 
      q.question_text.trim() && 
      q.option_a.trim() && 
      q.option_b.trim() && 
      q.option_c.trim() && 
      q.option_d.trim() && 
      q.ans_key
    );

    if (validQuestions.length === 0) {
      alert('Please fill at least one complete question with all options and answer key.');
      return;
    }

    if (!exam?.questionnaires?.[0]?.qn_id) {
      alert('No questionnaire found for this exam.');
      return;
    }

    setLoading(true);

    router.post(route('cai.exams.questions.store'), {
      questionnaire_id: exam.questionnaires[0].qn_id,
      questions: validQuestions
    }, {
      onSuccess: () => {
        setLoading(false);
        handleReset();
        onClose();
        // Refresh the page to show updated question count
        router.reload({ only: ['classworks'] });
      },
      onError: (errors) => {
        setLoading(false);
        console.error('Error creating questions:', errors);
        alert('Failed to create questions. Please try again.');
      }
    });
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const renderQuestionForm = (questionIndex) => (
    <Box 
      key={questionIndex}
      sx={{ 
        p: 3, 
        border: '1px solid #e0e0e0', 
        borderRadius: 2,
        backgroundColor: '#fafafa'
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ color: '#666', mb: 2 }}>
        Question {questionIndex + 1}
      </Typography>
      
      <TextField
        fullWidth
        multiline
        rows={2}
        placeholder="Enter your Questions here..."
        value={questions[questionIndex].question_text}
        onChange={(e) => handleQuestionChange(questionIndex, 'question_text', e.target.value)}
        sx={{ 
          mb: 2,
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#f5f5f5'
          }
        }}
      />

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={6}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Option A</Typography>
          <TextField
            fullWidth
            placeholder="Enter Option A"
            value={questions[questionIndex].option_a}
            onChange={(e) => handleQuestionChange(questionIndex, 'option_a', e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#f5f5f5'
              }
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Option B</Typography>
          <TextField
            fullWidth
            placeholder="Enter Option B"
            value={questions[questionIndex].option_b}
            onChange={(e) => handleQuestionChange(questionIndex, 'option_b', e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#f5f5f5'
              }
            }}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={6}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Option C</Typography>
          <TextField
            fullWidth
            placeholder="Enter Option C"
            value={questions[questionIndex].option_c}
            onChange={(e) => handleQuestionChange(questionIndex, 'option_c', e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#f5f5f5'
              }
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Option D</Typography>
          <TextField
            fullWidth
            placeholder="Enter Option D"
            value={questions[questionIndex].option_d}
            onChange={(e) => handleQuestionChange(questionIndex, 'option_d', e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#f5f5f5'
              }
            }}
          />
        </Grid>
      </Grid>

      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Answer Key</Typography>
      <FormControl sx={{ minWidth: 120 }}>
        <Select
          value={questions[questionIndex].ans_key}
          onChange={(e) => handleQuestionChange(questionIndex, 'ans_key', e.target.value)}
          displayEmpty
          sx={{
            backgroundColor: '#f5f5f5',
            '& .MuiSelect-select': {
              py: 1
            }
          }}
        >
          <MenuItem value="" disabled>Select Letter</MenuItem>
          <MenuItem value="A">A</MenuItem>
          <MenuItem value="B">B</MenuItem>
          <MenuItem value="C">C</MenuItem>
          <MenuItem value="D">D</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{
        sx: { minHeight: '80vh' }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <QuizIcon color="primary" />
            <Typography variant="h6">
              Create Question : {exam?.test_level ? 
                exam.test_level.charAt(0).toUpperCase() + exam.test_level.slice(1) : 
                'Exam'
              }
            </Typography>
            {exam?.test_level && (
              <Chip 
                label={exam.test_level} 
                color={exam.test_level === 'pretest' ? 'warning' : 'success'} 
                size="small" 
              />
            )}
          </Box>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        {exam && (
          <Box sx={{ mb: 1, p: 2, bgcolor: 'primary.50', borderRadius: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {exam.questionnaires?.[0]?.title || 'Untitled Exam'}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Subject: {exam.questionnaires?.[0]?.subject?.subject_name || 'No Subject'} | 
              Duration: {exam.questionnaires?.[0]?.time_duration || 30} minutes
            </Typography>
          </Box>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            {renderQuestionForm(0)}
          </Grid>
          <Grid item xs={12} md={6}>
            {renderQuestionForm(1)}
          </Grid>
          <Grid item xs={12} md={6}>
            {renderQuestionForm(2)}
          </Grid>
          <Grid item xs={12} md={6}>
            {renderQuestionForm(3)}
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button
          onClick={handleReset}
          startIcon={<RefreshIcon />}
          disabled={loading}
          variant="outlined"
        >
          Reset
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={<AddIcon />}
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
