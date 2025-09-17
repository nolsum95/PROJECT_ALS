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
  IconButton
} from '@mui/material';
import {
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material';
import { router } from '@inertiajs/react';

export default function CreateModuleModal({ open, onClose }) {
  const [moduleData, setModuleData] = useState({
    subject: '',
    description: '',
    content_type: 'text',
    content: '',
    file: null
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setModuleData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setModuleData(prev => ({
      ...prev,
      file: file
    }));
  };

  const handleSubmit = () => {
    setLoading(true);
    
    const formData = new FormData();
    formData.append('subject', moduleData.subject);
    formData.append('description', moduleData.description);
    formData.append('content_type', moduleData.content_type);
    formData.append('content', moduleData.content || '');
    
    if (moduleData.file) {
      formData.append('file', moduleData.file);
    }

    router.post(route('cai.modules.store'), formData, {
      forceFormData: true,
      onSuccess: () => {
        setModuleData({
          subject: '',
          description: '',
          content_type: 'text',
          content: '',
          file: null
        });
        setLoading(false);
        onClose();
      },
      onError: () => {
        setLoading(false);
      }
    });
  };

  const handleClose = () => {
    setModuleData({
      subject: '',
      description: '',
      content_type: 'text',
      content: '',
      file: null
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1
      }}>
        <Typography variant="h6" component="div">
          Create New Module
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Subject Field */}
          <TextField
            label="Module Subject"
            value={moduleData.subject}
            onChange={(e) => handleInputChange('subject', e.target.value)}
            fullWidth
            required
            variant="outlined"
          />

          {/* Description Field */}
          <TextField
            label="Module Description"
            value={moduleData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            fullWidth
            required
            multiline
            rows={3}
            variant="outlined"
          />

          {/* Content Type Selection */}
          <FormControl fullWidth required>
            <InputLabel>Content Type</InputLabel>
            <Select
              value={moduleData.content_type}
              onChange={(e) => handleInputChange('content_type', e.target.value)}
              label="Content Type"
            >
              <MenuItem value="text">Text Content</MenuItem>
              <MenuItem value="file">File Upload</MenuItem>
            </Select>
          </FormControl>

          {/* Conditional Content Fields */}
          {moduleData.content_type === 'text' && (
            <TextField
              label="Module Content"
              value={moduleData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              fullWidth
              multiline
              rows={6}
              variant="outlined"
              placeholder="Enter your module content here..."
            />
          )}

          {moduleData.content_type === 'file' && (
            <Box>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUploadIcon />}
                fullWidth
                sx={{ py: 2 }}
              >
                {moduleData.file ? moduleData.file.name : 'Choose File to Upload'}
                <input
                  type="file"
                  hidden
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.txt,.ppt,.pptx"
                />
              </Button>
              {moduleData.file && (
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  Selected: {moduleData.file.name} ({(moduleData.file.size / 1024 / 1024).toFixed(2)} MB)
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button 
          onClick={handleClose} 
          variant="outlined"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={loading || !moduleData.subject || !moduleData.description}
          sx={{ ml: 2 }}
        >
          {loading ? 'Creating...' : 'Create Module'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
