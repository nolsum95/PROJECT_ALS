import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert
} from '@mui/material';
import { Quiz as QuizIcon, Cancel as CancelIcon, Save as SaveIcon } from '@mui/icons-material';
import { router } from '@inertiajs/react';

export default function AddQuestionnaireModal({ open, onClose, classwork, subjects }) {
  const [questionnaireData, setQuestionnaireData] = useState({
    classwork_id: classwork?.classwork_id || '',
    subject_id: '',
    title: '',
    description: '',
    time_duration: 30
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (classwork) {
      setQuestionnaireData(prev => ({
        ...prev,
        classwork_id: classwork.classwork_id
      }));
    }
  }, [classwork]);

  const handleSubmit = () => {
    const requiredFields = ['classwork_id', 'subject_id', 'title', 'description'];
    const newErrors = {};
    
    requiredFields.forEach(field => {
      if (!questionnaireData[field]) {
        newErrors[field] = `${field.replace('_', ' ')} is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    router.post(route('cai.classwork.questionnaire.store'), questionnaireData, {
      onSuccess: () => {
        setQuestionnaireData({
          classwork_id: classwork?.classwork_id || '',
          subject_id: '',
          title: '',
          description: '',
          time_duration: 30
        });
        setLoading(false);
        onClose();
      },
      onError: (errors) => {
        setErrors(errors);
        setLoading(false);
      }
    });
  };

  const handleClose = () => {
    setQuestionnaireData({
      classwork_id: classwork?.classwork_id || '',
      subject_id: '',
      title: '',
      description: '',
      time_duration: 30
    });
    setErrors({});
    onClose();
  };

  const getTestLevelLabel = (level) => {
    switch(level) {
      case 'reviewer': return 'Reviewer';
      case 'pretest': return 'Pre-test';
      case 'posttest': return 'Post-test';
      default: return level;
    }
  };

  const getTestLevelColor = (level) => {
    switch(level) {
      case 'reviewer': return 'info';
      case 'pretest': return 'warning';
      case 'posttest': return 'success';
      default: return 'default';
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <QuizIcon color="primary" />
          <Typography variant="h6">
            Add Questionnaire to {classwork ? getTestLevelLabel(classwork.test_level) : 'Test'}
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Create a questionnaire with specific subject and time duration for this test.
          </Typography>
          
          {Object.keys(errors).length > 0 && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Please fill in all required fields
            </Alert>
          )}
          
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.subject_id}>
                <InputLabel>Subject *</InputLabel>
                <Select
                  value={questionnaireData.subject_id}
                  onChange={(e) => setQuestionnaireData({ ...questionnaireData, subject_id: e.target.value })}
                  label="Subject *"
                >
                  {subjects && subjects.map((subject) => (
                    <MenuItem key={subject.subject_id} value={subject.subject_id}>
                      {subject.subject_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Time Duration (minutes) *"
                value={questionnaireData.time_duration}
                onChange={(e) => setQuestionnaireData({ ...questionnaireData, time_duration: parseInt(e.target.value) || 30 })}
                inputProps={{ min: 1, max: 300 }}
                error={!!errors.time_duration}
                helperText={errors.time_duration}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Questionnaire Title *"
                value={questionnaireData.title}
                onChange={(e) => setQuestionnaireData({ ...questionnaireData, title: e.target.value })}
                placeholder="Enter questionnaire title"
                error={!!errors.title}
                helperText={errors.title}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description *"
                value={questionnaireData.description}
                onChange={(e) => setQuestionnaireData({ ...questionnaireData, description: e.target.value })}
                placeholder="Describe the questionnaire content and objectives"
                error={!!errors.description}
                helperText={errors.description}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={handleClose}
          startIcon={<CancelIcon />}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={<SaveIcon />}
          disabled={loading || !questionnaireData.subject_id || !questionnaireData.title || !questionnaireData.description}
        >
          {loading ? 'Creating...' : 'Create Questionnaire'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
