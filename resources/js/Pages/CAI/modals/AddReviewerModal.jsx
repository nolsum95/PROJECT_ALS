import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Button,
  Chip,
  Alert
} from '@mui/material';
import { Quiz as QuizIcon } from '@mui/icons-material';

export default function AddReviewerModal({ open, onClose, subjects = [] }) {
  const [form, setForm] = useState({
    subject_id: '',
    time_duration: 30,
    title: '',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const reset = () => {
    setForm({ subject_id: '', time_duration: 30, title: '', description: '' });
    setError(null);
  };

  const handleSave = () => {
    setError(null);
    if (!form.subject_id || !form.title) {
      setError('Please select a subject and enter a title.');
      return;
    }

    setSubmitting(true);
    const payload = {
      test_level: 'reviewer',
      test_title: form.title,
      test_description: form.description,
      questionnaire: {
        subject_id: form.subject_id,
        title: form.title,
        description: form.description,
        time_duration: form.time_duration
      }
    };

    router.post('/cai/classwork', payload, {
      onSuccess: () => {
        reset();
        if (onClose) onClose();
      },
      onError: (errors) => {
        const first = errors?.error || Object.values(errors || {})[0];
        setError(first || 'Failed to create reviewer classwork.');
      },
      onFinish: () => setSubmitting(false)
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={2}>
          <QuizIcon color="primary" />
          <Typography variant="h6">Create Reviewer Classwork</Typography>
          <Chip label="Reviewer" color="info" size="small" sx={{ ml: 'auto' }} />
        </Box>
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {error && <Alert severity="error">{error}</Alert>}

          {/* Subject and Time Duration */}
          <Box display="flex" gap={2}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: '#666' }}>
                Subject
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={form.subject_id}
                  onChange={(e) => setForm({ ...form, subject_id: e.target.value })}
                  sx={{ backgroundColor: '#f5f5f5', borderRadius: 2 }}
                >
                  {subjects?.map((subject) => (
                    <MenuItem key={subject.subject_id} value={subject.subject_id}>
                      {subject.subject_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: '#666' }}>
                Time Duration (minutes)
              </Typography>
              <TextField
                type="number"
                value={form.time_duration}
                onChange={(e) => setForm({ ...form, time_duration: parseInt(e.target.value || '0', 10) })}
                size="small"
                fullWidth
                sx={{
                  '& .MuiInputBase-root': {
                    backgroundColor: '#f5f5f5',
                    borderRadius: 2
                  }
                }}
              />
            </Box>
          </Box>

          {/* Title */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: '#666' }}>
              Questionnaire Title
            </Typography>
            <TextField
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              size="small"
              fullWidth
              sx={{
                '& .MuiInputBase-root': {
                  backgroundColor: '#f5f5f5',
                  borderRadius: 2
                }
              }}
            />
          </Box>

          {/* Description */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: '#666' }}>
              Description
            </Typography>
            <TextField
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              multiline
              rows={3}
              size="small"
              fullWidth
              sx={{
                '& .MuiInputBase-root': {
                  backgroundColor: '#f5f5f5',
                  borderRadius: 2
                }
              }}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          onClick={() => {
            reset();
            if (onClose) onClose();
          }}
          sx={{
            backgroundColor: '#e5e7eb',
            color: '#374151',
            '&:hover': { backgroundColor: '#d1d5db' }
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={submitting || !form.subject_id || !form.title}
          sx={{
            backgroundColor: '#3b82f6',
            '&:hover': { backgroundColor: '#2563eb' }
          }}
        >
          {submitting ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
