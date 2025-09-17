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
  Alert
} from '@mui/material';
import { Add as AddIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { router } from '@inertiajs/react';

export default function AddSubjectModal({ open, onClose }) {
  const [subjectData, setSubjectData] = useState({
    subject_name: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!subjectData.subject_name.trim()) {
      setErrors({ subject_name: 'Subject name is required' });
      return;
    }

    setLoading(true);
    setErrors({});

    router.post(route('cai.subjects.store'), subjectData, {
      onSuccess: () => {
        setSubjectData({ subject_name: '' });
        setLoading(false);
        onClose();
        // Refresh the page to show updated subjects
        router.reload({ only: ['subjects'] });
      },
      onError: (errors) => {
        setErrors(errors);
        setLoading(false);
      }
    });
  };

  const handleClose = () => {
    setSubjectData({ subject_name: '' });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <AddIcon color="primary" />
          <Typography variant="h6">Add New Subject</Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Create a new subject that can be used for questionnaires and assessments.
          </Typography>
          
          {errors.subject_name && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.subject_name}
            </Alert>
          )}
          
          <TextField
            fullWidth
            label="Subject Name"
            value={subjectData.subject_name}
            onChange={(e) => setSubjectData({ ...subjectData, subject_name: e.target.value })}
            placeholder="Enter subject name (e.g., Mathematics, English, Science)"
            error={!!errors.subject_name}
            helperText={errors.subject_name}
            sx={{ mt: 2 }}
            autoFocus
          />
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
          disabled={loading || !subjectData.subject_name.trim()}
        >
          {loading ? 'Adding...' : 'Add Subject'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
