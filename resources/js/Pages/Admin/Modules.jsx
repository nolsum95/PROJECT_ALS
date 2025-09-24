import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Alert,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel
} from '@mui/material';
import { 
  Add as AddIcon,
  Upload as UploadIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  MenuBook as MenuBookIcon,
  School as SchoolIcon
} from '@mui/icons-material';

export default function Modules({ auth, modules = [], clcs = [] }) {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    fk_clc_id: '',
    content_type: 'file',
    content: '',
    file: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Reviewer material upload state
  const [reviewerUploadOpen, setReviewerUploadOpen] = useState(false);
  const [reviewerData, setReviewerData] = useState({
    title: '',
    description: '',
    fk_clc_id: '',
    posting_status: 'draft',
    file: null
  });

  const handleSubmit = () => {
    setError('');
    setLoading(true);

    const submitData = new FormData();
    submitData.append('subject', formData.subject);
    submitData.append('description', formData.description);
    submitData.append('fk_clc_id', formData.fk_clc_id);
    submitData.append('content_type', formData.content_type);
    
    if (formData.content_type === 'text' || formData.content_type === 'mixed') {
      submitData.append('content', formData.content);
    }
    
    if (formData.file && (formData.content_type === 'file' || formData.content_type === 'mixed')) {
      submitData.append('file', formData.file);
    }

    router.post(route('admin.modules.store'), submitData, {
      onSuccess: () => {
        setLoading(false);
        setCreateModalOpen(false);
        resetForm();
        setSuccess('Module uploaded and assigned successfully.');
      },
      onError: (errors) => {
        setLoading(false);
        setError(Object.values(errors).join(' '));
      }
    });
  };

  const handleReviewerUpload = () => {
    if (!reviewerData.file || !reviewerData.title || !reviewerData.fk_clc_id) {
      setError('Please fill in all required fields for reviewer material');
      return;
    }

    router.post('/admin/reviewers/upload', { ...reviewerData, test_level: 'reviewer' }, {
      forceFormData: true,
      onSuccess: () => {
        setSuccess('Reviewer material uploaded successfully!');
        setReviewerUploadOpen(false);
        setReviewerData({ title: '', description: '', fk_clc_id: '', posting_status: 'draft', file: null });
      },
      onError: (errors) => setError(Object.values(errors).flat().join(', ')),
    });
  };

  const resetForm = () => {
    setFormData({
      subject: '',
      description: '',
      fk_clc_id: '',
      content_type: 'file',
      content: '',
      file: null
    });
    setError('');
  };

  const handleViewDetails = (module) => {
    setSelectedModule(module);
    setViewDetailsOpen(true);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <AdminLayout auth={auth} title="Module Management">
      <Head title="Admin - Module Management" />
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>Module Management</Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Upload and assign learning modules to Community Learning Centers (CLCs).
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Grid container spacing={3}>
          {/* Statistics Cards */}
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" color="primary">
                      {modules.length}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Total Modules
                    </Typography>
                  </Box>
                  <MenuBookIcon sx={{ fontSize: 40, color: 'primary.main', opacity: 0.3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" color="success.main">
                      {modules.filter(m => m.status === 'active').length}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Active Modules
                    </Typography>
                  </Box>
                  <Chip label="ACTIVE" color="success" />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" color="info.main">
                      {clcs.length}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Total CLCs
                    </Typography>
                  </Box>
                  <SchoolIcon sx={{ fontSize: 40, color: 'info.main', opacity: 0.3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" color="warning.main">
                      {modules.filter(m => m.content_type === 'file').length}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      File Modules
                    </Typography>
                  </Box>
                  <UploadIcon sx={{ fontSize: 40, color: 'warning.main', opacity: 0.3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Upload Buttons */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Learning Materials</Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<UploadIcon />}
                  onClick={() => setReviewerUploadOpen(true)}
                  sx={{
                    background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
                    boxShadow: '0 3px 5px 2px rgba(255, 107, 107, .3)',
                  }}
                >
                  Upload Reviewer Material
                </Button>
                <Button
                  variant="contained"
                  startIcon={<UploadIcon />}
                  onClick={() => setCreateModalOpen(true)}
                  sx={{
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                  }}
                >
                  Upload Learning Module
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* Modules Table */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Subject</TableCell>
                    <TableCell>CLC</TableCell>
                    <TableCell>Content Type</TableCell>
                    <TableCell>File</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Assigned Date</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {modules.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                        <Typography variant="body2" color="textSecondary">
                          No modules uploaded yet. Click "Upload New Module" to get started.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : modules.map((module) => (
                    <TableRow key={module.module_id} hover>
                      <TableCell>
                        <Typography variant="subtitle2">
                          {module.subject}
                        </Typography>
                        {module.description && (
                          <Typography variant="caption" color="textSecondary">
                            {module.description.substring(0, 50)}
                            {module.description.length > 50 ? '...' : ''}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {module.clc?.clc_name || 'No CLC'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={module.content_type.toUpperCase()} 
                          color={module.content_type === 'file' ? 'primary' : 'secondary'} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        {module.file_name ? (
                          <Box>
                            <Typography variant="body2">
                              {module.file_name}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {formatFileSize(module.file_size)}
                            </Typography>
                          </Box>
                        ) : (
                          <Typography variant="body2" color="textSecondary">
                            No file
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={module.status} 
                          color={module.status === 'active' ? 'success' : 'default'} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(module.assigned_at).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {new Date(module.assigned_at).toLocaleTimeString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="View Details">
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleViewDetails(module)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
        </Grid>

        {/* Create Module Modal */}
        <Dialog 
          open={createModalOpen} 
          onClose={() => setCreateModalOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Upload New Module</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    required
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Assign to CLC</InputLabel>
                    <Select
                      value={formData.fk_clc_id}
                      onChange={(e) => setFormData({...formData, fk_clc_id: e.target.value})}
                      label="Assign to CLC"
                    >
                      {clcs.map((clc) => (
                        <MenuItem key={clc.clc_id} value={clc.clc_id}>
                          {clc.clc_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Content Type</FormLabel>
                    <RadioGroup
                      row
                      value={formData.content_type}
                      onChange={(e) => setFormData({...formData, content_type: e.target.value})}
                    >
                      <FormControlLabel value="file" control={<Radio />} label="File Only" />
                      <FormControlLabel value="text" control={<Radio />} label="Text Only" />
                      <FormControlLabel value="mixed" control={<Radio />} label="File + Text" />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                {(formData.content_type === 'text' || formData.content_type === 'mixed') && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Text Content"
                      multiline
                      rows={4}
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      required={formData.content_type === 'text'}
                    />
                  </Grid>
                )}

                {(formData.content_type === 'file' || formData.content_type === 'mixed') && (
                  <Grid item xs={12}>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<UploadIcon />}
                      fullWidth
                      sx={{ py: 2 }}
                    >
                      {formData.file ? formData.file.name : 'Choose File'}
                      <input
                        type="file"
                        hidden
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.gif"
                        onChange={(e) => setFormData({...formData, file: e.target.files[0]})}
                        required={formData.content_type === 'file'}
                      />
                    </Button>
                    <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                      Supported formats: PDF, DOC, DOCX, PPT, PPTX, JPG, PNG, GIF (Max: 20MB)
                    </Typography>
                  </Grid>
                )}
              </Grid>

              {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              variant="contained"
              disabled={loading}
            >
              {loading ? 'Uploading...' : 'Upload Module'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* View Details Modal */}
        <Dialog 
          open={viewDetailsOpen} 
          onClose={() => setViewDetailsOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Module Details</DialogTitle>
          <DialogContent>
            {selectedModule && (
              <Box sx={{ pt: 2 }}>
                <Grid container spacing={3}>
                  {/* Left Column */}
                  <Grid item xs={12} md={6}>
                    {/* Subject */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        Subject
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {selectedModule.subject}
                      </Typography>
                    </Box>

                    {/* Description */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        Description:
                      </Typography>
                      <Typography variant="body1">
                        {selectedModule.description || 'No description provided'}
                      </Typography>
                    </Box>

                    {/* Assigned CLC */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        Assigned CLC:
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {selectedModule.clc?.clc_name || 'No CLC assigned'}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Right Column */}
                  <Grid item xs={12} md={6}>
                    {/* Content Type */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        Content Type:
                      </Typography>
                      <Chip 
                        label={selectedModule.content_type?.toUpperCase() || 'UNKNOWN'} 
                        color={selectedModule.content_type === 'text' ? 'secondary' : 'primary'} 
                        size="medium"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </Box>

                    {/* Status */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        Status:
                      </Typography>
                      <Chip 
                        label={selectedModule.status?.toUpperCase() || 'ACTIVE'} 
                        color="success"
                        size="medium"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </Box>

                    {/* Created By */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        Created By:
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {selectedModule.created_by_admin?.name || 'Admin'}
                      </Typography>
                    </Box>

                    {/* Assigned Date */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        Assigned Date
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {selectedModule.assigned_at ? new Date(selectedModule.assigned_at).toLocaleDateString() : new Date(selectedModule.created_at).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Text Content - Full Width */}
                  {selectedModule.content && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        Text Content:
                      </Typography>
                      <Paper 
                        sx={{ 
                          p: 3, 
                          backgroundColor: 'grey.50',
                          border: '1px solid',
                          borderColor: 'grey.300',
                          borderRadius: 2,
                          minHeight: 120
                        }}
                      >
                        <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
                          {selectedModule.content}
                        </Typography>
                      </Paper>
                    </Grid>
                  )}

                  {/* File Information - Full Width */}
                  {selectedModule.file_name && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        Attached File:
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          {selectedModule.file_name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          ({formatFileSize(selectedModule.file_size || 0)})
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewDetailsOpen(false)}>
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Reviewer Material Upload Modal */}
        <Dialog open={reviewerUploadOpen} onClose={() => setReviewerUploadOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Upload Reviewer Material</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Title"
              value={reviewerData.title}
              onChange={(e) => setReviewerData({ ...reviewerData, title: e.target.value })}
              sx={{ mb: 2, mt: 1 }}
              required
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={reviewerData.description}
              onChange={(e) => setReviewerData({ ...reviewerData, description: e.target.value })}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>CLC</InputLabel>
              <Select
                value={reviewerData.fk_clc_id}
                label="CLC"
                onChange={(e) => setReviewerData({ ...reviewerData, fk_clc_id: e.target.value })}
                required
              >
                {clcs.map((clc) => (
                  <MenuItem key={clc.clc_id} value={clc.clc_id}>{clc.clc_name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={reviewerData.posting_status}
                label="Status"
                onChange={(e) => setReviewerData({ ...reviewerData, posting_status: e.target.value })}
              >
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="posted">Posted</MenuItem>
              </Select>
            </FormControl>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setReviewerData({ ...reviewerData, file: e.target.files[0] })}
              style={{ marginBottom: '16px' }}
              required
            />
            <Typography variant="body2" color="textSecondary">
              Upload reviewer materials (PDFs, documents) that CAIs can download and use to create practice questionnaires.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setReviewerUploadOpen(false)}>Cancel</Button>
            <Button onClick={handleReviewerUpload} variant="contained">
              Upload Material
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AdminLayout>
  );
}
