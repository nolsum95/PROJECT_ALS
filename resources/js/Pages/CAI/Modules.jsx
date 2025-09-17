import React, { useState } from 'react';
import CaiLayout from '../../Layouts/CaiLayout';
import CreateModuleModal from './modals/CreateModuleModal';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import {
  MenuBook as MenuBookIcon,
  Visibility as VisibilityIcon,
  Add as AddIcon,
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material';

export default function CaiModules({ auth, cai, modules }) {
  const [selectedModule, setSelectedModule] = useState(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [createModuleOpen, setCreateModuleOpen] = useState(false);

  const handleViewDetails = (module) => {
    setSelectedModule(module);
    setViewDetailsOpen(true);
  };

  return (
    <CaiLayout user={auth?.user} selectedSection="modules">
      <Box sx={{ flexGrow: 1, p: 3 }}>
        {/* Page Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Learning Materials
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Manage your learning modules and educational content
          </Typography>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      Total Learning Materials
                    </Typography>
                    <Typography variant="h4">
                      {modules?.length || 0}
                    </Typography>
                  </Box>
                  <MenuBookIcon sx={{ fontSize: 40, color: 'primary.main', opacity: 0.7 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      Text Content
                    </Typography>
                    <Typography variant="h4">
                      {modules?.filter(m => m.content_type === 'text').length || 0}
                    </Typography>
                  </Box>
                  <MenuBookIcon sx={{ fontSize: 40, color: 'success.main', opacity: 0.7 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      File Uploads
                    </Typography>
                    <Typography variant="h4">
                      {modules?.filter(m => m.content_type === 'file').length || 0}
                    </Typography>
                  </Box>
                  <CloudUploadIcon sx={{ fontSize: 40, color: 'info.main', opacity: 0.7 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Module List */}
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                My Learning Modules
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setCreateModuleOpen(true)}
              >
                Create Module
              </Button>
            </Box>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Module</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Content Type</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {modules && modules.length > 0 ? (
                    modules.map((module) => (
                      <TableRow key={module.module_id} hover>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                              <MenuBookIcon />
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2">
                                {module.subject}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {module.description || 'No description available'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={module.content_type || 'text'}
                            color={module.content_type === 'file' ? 'info' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(module.created_at).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleViewDetails(module)}
                            title="View Details"
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Box py={4}>
                          <MenuBookIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                          <Typography variant="h6" color="textSecondary">
                            No modules created yet
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Create your first learning module to get started
                          </Typography>
                          <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setCreateModuleOpen(true)}
                            sx={{ mt: 2 }}
                          >
                            Create Module
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Module Details Dialog */}
        <Dialog 
          open={viewDetailsOpen} 
          onClose={() => setViewDetailsOpen(false)} 
          maxWidth="md" 
          fullWidth
        >
          <DialogTitle>
            Module Details - {selectedModule?.subject}
          </DialogTitle>
          <DialogContent>
            {selectedModule && (
              <Box sx={{ pt: 2 }}>
                <Typography variant="body1" paragraph>
                  <strong>Description:</strong> {selectedModule.description || 'No description available'}
                </Typography>
                
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Module Information
                </Typography>
                
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <Card>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" color="primary.main">
                          {selectedModule.content_type || 'text'}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Content Type
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6}>
                    <Card>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" color="info.main">
                          {new Date(selectedModule.created_at).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Created Date
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {selectedModule.content && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Content Preview
                    </Typography>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="body2">
                          {selectedModule.content_type === 'file' 
                            ? `File: ${selectedModule.content}` 
                            : selectedModule.content}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewDetailsOpen(false)}>
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Create Module Modal */}
        <CreateModuleModal 
          open={createModuleOpen} 
          onClose={() => setCreateModuleOpen(false)} 
        />
      </Box>
    </CaiLayout>
  );
}
