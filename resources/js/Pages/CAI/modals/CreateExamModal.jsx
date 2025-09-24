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
  Alert,
  Chip
} from '@mui/material';
import { Add as AddIcon, Cancel as CancelIcon, Quiz as QuizIcon } from '@mui/icons-material';
import { router } from '@inertiajs/react';

export default function CreateExamModal({ open, onClose, subjects = [] }) {
  const [formData, setFormData] = useState({
    test_level: 'pretest',
    subject_id: '',
    title: '',
    description: '',
    time_duration: 30,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    // Basic validation
    const newErrors = {};
    if (!formData.subject_id) {
      newErrors.subject_id = 'Subject is required';
    }
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (formData.time_duration < 1 || formData.time_duration > 300) {
      newErrors.time_duration = 'Time duration must be between 1 and 300 minutes';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    router.post(route('cai.exams.store'), {
      test_level: formData.test_level,
      questionnaire: {
        subject_id: formData.subject_id,
        title: formData.title,
        description: formData.description,
        time_duration: formData.time_duration,
      }
    }, {
      onSuccess: () => {
        setFormData({
          test_level: 'pretest',
          subject_id: '',
          title: '',
          description: '',
          time_duration: 30,
        });
        setLoading(false);
        onClose();
        // Refresh the page to show updated exams
        router.reload({ only: ['classworks'] });
      },
      onError: (errors) => {
        setErrors(errors);
        setLoading(false);
      }
    });
  };

  const handleClose = () => {
    setFormData({
      test_level: 'pretest',
      subject_id: '',
      title: '',
      description: '',
      time_duration: 30,
    });
    setErrors({});
    onClose();
  };

  const getSelectedSubject = () => {
    return subjects.find(s => s.subject_id === formData.subject_id);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <QuizIcon color="primary" />
          <Typography variant="h6">Create New Exam</Typography>
          <Chip 
            label={formData.test_level} 
            color={formData.test_level === 'pretest' ? 'warning' : 'success'} 
            size="small" 
          />
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Create a new pretest or posttest exam. This will create a classwork with an initial questionnaire.
          </Typography>
          
          {Object.keys(errors).length > 0 && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Please fix the errors below and try again.
            </Alert>
          )}
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 3 }}>
            <FormControl fullWidth error={!!errors.test_level}>
              <InputLabel>Exam Type</InputLabel>
              <Select
                label="Exam Type"
                value={formData.test_level}
                onChange={(e) => setFormData({ ...formData, test_level: e.target.value })}
              >
                <MenuItem value="pretest">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip label="Pretest" color="warning" size="small" />
                    <Typography>Pre-examination assessment</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="posttest">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip label="Posttest" color="success" size="small" />
                    <Typography>Post-examination assessment</Typography>
                  </Box>
                </MenuItem>
              </Select>
              {errors.test_level && (
                <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                  {errors.test_level}
                </Typography>
              )}
            </FormControl>

            <FormControl fullWidth error={!!errors.subject_id}>
              <InputLabel>Subject</InputLabel>
              <Select
                label="Subject"
                value={formData.subject_id}
                onChange={(e) => setFormData({ ...formData, subject_id: e.target.value })}
              >
                {subjects.map((subject) => (
                  <MenuItem key={subject.subject_id} value={subject.subject_id}>
                    {subject.subject_name || subject.title || `Subject ${subject.subject_id}`}
                  </MenuItem>
                ))}
              </Select>
              {errors.subject_id && (
                <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                  {errors.subject_id}
                </Typography>
              )}
            </FormControl>

            <TextField
              fullWidth
              label="Exam Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter exam title (e.g., Mathematics Pretest - Quarter 1)"
              error={!!errors.title}
              helperText={errors.title}
            />

            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter exam description or instructions..."
              error={!!errors.description}
              helperText={errors.description}
            />

            <TextField
              fullWidth
              type="number"
              label="Time Duration (minutes)"
              value={formData.time_duration}
              onChange={(e) => setFormData({ ...formData, time_duration: parseInt(e.target.value || '0') })}
              inputProps={{ min: 1, max: 300 }}
              error={!!errors.time_duration}
              helperText={errors.time_duration || 'Duration between 1-300 minutes'}
            />
          </Box>

          {formData.subject_id && formData.title && (
            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>Preview:</Typography>
              <Typography variant="body2">
                <strong>{formData.test_level.charAt(0).toUpperCase() + formData.test_level.slice(1)}</strong> - {formData.title}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Subject: {getSelectedSubject()?.subject_name || getSelectedSubject()?.title || 'Unknown'} | 
                Duration: {formData.time_duration} minutes
              </Typography>
            </Box>
          )}
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
          startIcon={<AddIcon />}
          disabled={loading || !formData.subject_id || !formData.title.trim()}
        >
          {loading ? 'Creating...' : 'Create Exam'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
