import React, { useState } from 'react';
import CaiLayout from '@/Layouts/CaiLayout';
import { Head, router } from '@inertiajs/react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Button,
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
  DialogActions
} from '@mui/material';
import { 
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  MenuBook as MenuBookIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';

export default function Modules({ auth, cai, modules = [], reviewerMaterials = [] }) {
  const [selectedModule, setSelectedModule] = useState(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleViewDetails = (module) => {
    setSelectedModule(module);
    setViewDetailsOpen(true);
  };

  const handleDownload = (moduleId) => {
    window.location.href = route('cai.modules.download', moduleId);
  };

  const handleDownloadReviewerMaterial = (fileId) => {
    window.location.href = route('cai.files.download', fileId);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <CaiLayout user={auth?.user} selectedSection="modules">
      <Head title="CAI - Assigned Modules" />
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>Assigned Learning Modules</Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          View and download learning modules assigned to your CLC by the Admin.
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
                      Assigned Modules
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
                      {modules.filter(m => m.content_type === 'file').length}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      File Modules
                    </Typography>
                  </Box>
                  <DescriptionIcon sx={{ fontSize: 40, color: 'success.main', opacity: 0.3 }} />
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
                      {modules.filter(m => m.content_type === 'text').length}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Text Modules
                    </Typography>
                  </Box>
                  <AssignmentIcon sx={{ fontSize: 40, color: 'info.main', opacity: 0.3 }} />
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
                      {reviewerMaterials.length}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Reviewer Materials
                    </Typography>
                  </Box>
                  <AssignmentIcon sx={{ fontSize: 40, color: 'warning.main', opacity: 0.3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Modules Table */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Available Learning Modules</Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Subject</TableCell>
                    <TableCell>Content Type</TableCell>
                    <TableCell>File</TableCell>
                    <TableCell>Assigned Date</TableCell>
                    <TableCell>Created By</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {modules.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                        <Typography variant="body2" color="textSecondary">
                          No modules assigned to your CLC yet. Contact your Admin for module assignments.
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
                            Text only
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(module.assigned_at).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {new Date(module.assigned_at).toLocaleTimeString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {module.created_by_admin?.name || 'Admin'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <Tooltip title="View Details">
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => handleViewDetails(module)}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          {(module.file_path || module.content_type === 'file') && (
                            <Tooltip title="Download File">
                              <IconButton 
                                size="small" 
                                color="success"
                                onClick={() => handleDownload(module.module_id)}
                              >
                                <DownloadIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Grid>

          {/* Reviewer Materials Table */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, borderRadius: 2, mt: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Admin Reviewer Materials</Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Download reviewer materials uploaded by admin for your CLC reference.
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>CLC</TableCell>
                    <TableCell>File</TableCell>
                    <TableCell>Upload Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reviewerMaterials.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                        <Typography variant="body2" color="textSecondary">
                          No reviewer materials available for your CLC yet.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : reviewerMaterials.map((material) => (
                    <TableRow key={material.id} hover>
                      <TableCell>
                        <Typography variant="subtitle2">
                          {material.metadata?.title || material.original_name}
                        </Typography>
                        {material.metadata?.description && (
                          <Typography variant="caption" color="textSecondary">
                            {material.metadata.description}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {material.clc?.clc_name || 'All CLCs'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <DescriptionIcon color="primary" fontSize="small" />
                          <Box>
                            <Typography variant="body2">
                              {material.original_name}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {formatFileSize(material.file_size || 0)}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(material.created_at).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {new Date(material.created_at).toLocaleTimeString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label="Available" 
                          color="success"
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Download File">
                          <IconButton 
                            size="small" 
                            color="success"
                            onClick={() => handleDownloadReviewerMaterial(material.id)}
                          >
                            <DownloadIcon />
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
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      {selectedModule.subject}
                    </Typography>
                  </Grid>
                  
                  {selectedModule.description && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        Description:
                      </Typography>
                      <Typography variant="body1">
                        {selectedModule.description}
                      </Typography>
                    </Grid>
                  )}

                  {selectedModule.content && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        Text Content:
                      </Typography>
                      <Paper sx={{ p: 2, backgroundColor: 'grey.50' }}>
                        <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
                          {selectedModule.content}
                        </Typography>
                      </Paper>
                    </Grid>
                  )}

                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Content Type:
                    </Typography>
                    <Chip 
                      label={selectedModule.content_type.toUpperCase()} 
                      color={selectedModule.content_type === 'file' ? 'primary' : 'secondary'} 
                      size="small" 
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Assigned Date:
                    </Typography>
                    <Typography variant="body1">
                      {new Date(selectedModule.assigned_at).toLocaleDateString()}
                    </Typography>
                  </Grid>

                  {selectedModule.file_name && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        Attached File:
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body1">
                          {selectedModule.file_name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          ({formatFileSize(selectedModule.file_size)})
                        </Typography>
                        <Button
                          size="small"
                          startIcon={<DownloadIcon />}
                          onClick={() => handleDownload(selectedModule.module_id)}
                        >
                          Download
                        </Button>
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
      </Box>
    </CaiLayout>
  );
}
