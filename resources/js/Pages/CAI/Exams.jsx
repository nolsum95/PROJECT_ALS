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
  Tooltip
} from '@mui/material';
import { 
  Quiz as QuizIcon, 
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  PostAdd as PostAddIcon,
  Publish as PublishIcon,
  Archive as ArchiveIcon
} from '@mui/icons-material';
import Swal from 'sweetalert2';
import CreateExamModal from './modals/CreateExamModal';
import CreateQuestionsModal from './modals/CreateQuestionsModal';

export default function Exams({ auth, classworks = [], subjects = [] }) {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [questionsModalOpen, setQuestionsModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [success, setSuccess] = useState('');

  const handlePostExam = (classwork) => {
    Swal.fire({
      title: 'Post Exam?',
      html: `Are you sure you want to post <strong>"${classwork.questionnaires?.[0]?.title || 'Untitled'}"</strong>?<br/>Learners will be able to take it once posted (or at the scheduled time).`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Post it!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        router.post('/cai/classwork/post', { classwork_id: classwork.classwork_id }, {
          onSuccess: () => {
            Swal.fire({
              title: 'Posted',
              text: 'Exam has been posted.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
            router.reload({ only: ['classworks'] });
          }
        });
      }
    });
  };

  const handleArchiveExam = (classwork) => {
    Swal.fire({
      title: 'Archive Exam?',
      html: `Archive <strong>"${classwork.questionnaires?.[0]?.title || 'Untitled'}"</strong>?<br/>Learners will no longer see it until you post it again.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f59e0b',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Archive',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        router.post('/cai/classwork/archive', { classwork_id: classwork.classwork_id }, {
          onSuccess: () => {
            Swal.fire({
              title: 'Archived',
              text: 'Exam has been archived.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
            router.reload({ only: ['classworks'] });
          }
        });
      }
    });
  };

  const handleAddQuestions = (exam) => {
    setSelectedExam(exam);
    setQuestionsModalOpen(true);
  };

  return (
    <CaiLayout auth={auth} title="Exams">
      <Head title="CAI - Exams" />
      <Box>
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>Exams (Pretest/Posttest)</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Create Pretest and Posttest exams. Admin will upload assessment files separately.
        </Typography>

        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Grid container spacing={3} alignItems="flex-start">
          {/* Stats Cards - Always on top */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {/* Total Exams */}
              <Grid item xs={6} sm={3} md={3} lg={3}>
                <Card sx={{ borderRadius: 3, boxShadow: 2, backgroundColor: '#ffffff', minHeight: 140 }}>
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="h1" sx={{ fontWeight: 700, color: 'primary.main', mb: 1, fontSize: '3rem' }}>
                      {classworks.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 2 }}>
                      Total Exams
                    </Typography>
                    <Box sx={{ p: 1, backgroundColor: 'primary.main', borderRadius: 2, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 35, minHeight: 35 }}>
                      <QuizIcon sx={{ color: 'white', fontSize: 20 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              {/* Posttests */}
              <Grid item xs={6} sm={3} md={3} lg={3}>
                <Card sx={{ borderRadius: 3, boxShadow: 2, backgroundColor: '#ffffff', minHeight: 140 }}>
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="h1" sx={{ fontWeight: 700, color: 'success.main', mb: 1, fontSize: '3rem' }}>
                      {classworks.filter(c => c.test_level === 'posttest').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 2 }}>
                      Posttests
                    </Typography>
                    <Chip label="POST" color="success" sx={{ fontWeight: 600, fontSize: '0.75rem', minWidth: 50 }} />
                  </CardContent>
                </Card>
              </Grid>
              {/* Pretests */}
              <Grid item xs={6} sm={3} md={3} lg={3}>
                <Card sx={{ borderRadius: 3, boxShadow: 2, backgroundColor: '#ffffff', minHeight: 140 }}>
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="h1" sx={{ fontWeight: 700, color: 'warning.main', mb: 1, fontSize: '3rem' }}>
                      {classworks.filter(c => c.test_level === 'pretest').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 2 }}>
                      Pretests
                    </Typography>
                    <Chip label="PRE" color="warning" sx={{ fontWeight: 600, fontSize: '0.75rem', minWidth: 50 }} />
                  </CardContent>
                </Card>
              </Grid>
              {/* Total Questions */}
              <Grid item xs={6} sm={3} md={3} lg={3}>
                <Card sx={{ borderRadius: 3, boxShadow: 2, backgroundColor: '#ffffff', minHeight: 140 }}>
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="h1" sx={{ fontWeight: 700, color: 'info.main', mb: 1, fontSize: '3rem' }}>
                      {classworks.reduce((total, c) => total + (c.questionnaires?.reduce((t, q) => t + (q.questions?.length || 0), 0) || 0), 0)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 2 }}>
                      Total Questions
                    </Typography>
                    <Box sx={{ p: 1, backgroundColor: 'info.main', borderRadius: 2, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 35, minHeight: 35 }}>
                      <EditIcon sx={{ color: 'white', fontSize: 20 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          {/* Main Content Area - Full width below cards */}
          <Grid item xs={12}>
            <Paper elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
              {/* Header with Create Button */}
              <Box sx={{ 
                p: 2, 
                display: 'flex', 
                justifyContent: 'flex-end',
              }}>
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />} 
                  onClick={() => setCreateModalOpen(true)}
                  sx={{ borderRadius: 2 }}
                >
                  CREATE NEW EXAM
                </Button>
              </Box>

              {/* Table */}
              <Table stickyHeader size="medium" aria-label="classwork table" sx={{ '& .MuiTableHead-root': { bgcolor: 'grey.100' }, '& .MuiTableCell-head': { color: 'text.secondary', fontWeight: 600 } }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Subject</TableCell>
                    <TableCell>Questions</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {classworks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                        <Typography variant="body1" color="text.secondary">
                          No exams created yet. Click "CREATE NEW EXAM" to get started.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : classworks.map((classwork) => (
                    <TableRow key={classwork.classwork_id} hover>
                      <TableCell>
                        <Chip 
                          label={classwork.test_level} 
                          color={classwork.test_level === 'pretest' ? 'warning' : 'success'} 
                          size="small"
                          sx={{ 
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            minWidth: 80
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {classwork.questionnaires?.[0]?.title || 'Untitled'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {classwork.questionnaires?.[0]?.description || 'No description'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {classwork.questionnaires?.[0]?.subject?.subject_name || 
                           classwork.questionnaires?.[0]?.subject?.title || 
                           'No Subject'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {classwork.questionnaires?.reduce((total, q) => total + (q.questions?.length || 0), 0) || 0}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={classwork.posting_status || 'draft'}
                          size="small"
                          color={classwork.posting_status === 'posted' ? 'success' : (classwork.posting_status === 'archived' ? 'default' : (classwork.posting_status === 'scheduled' ? 'warning' : 'default'))}
                          variant={classwork.posting_status === 'posted' ? 'filled' : 'outlined'}
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {classwork.questionnaires?.[0]?.time_duration || 30} min
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(classwork.created_at).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(classwork.created_at).toLocaleTimeString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <Tooltip title="View Details">
                            <IconButton size="small" color="primary">
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Add Questions">
                            <IconButton 
                              size="small" 
                              color="success"
                              onClick={() => handleAddQuestions(classwork)}
                            >
                              <PostAddIcon />
                            </IconButton>
                          </Tooltip>
                          {(() => {
                            const hasQuestions = (classwork.questionnaires || []).some(q => (q.questions || []).length > 0);
                            const isPosted = classwork.posting_status === 'posted';
                            if (hasQuestions && !isPosted) {
                              return (
                                <Tooltip title="Post Exam">
                                  <IconButton size="small" color="success" onClick={() => handlePostExam(classwork)}>
                                    <PublishIcon />
                                  </IconButton>
                                </Tooltip>
                              );
                            }
                            if (isPosted) {
                              return (
                                <Tooltip title="Archive Exam">
                                  <IconButton size="small" color="warning" onClick={() => handleArchiveExam(classwork)}>
                                    <ArchiveIcon />
                                  </IconButton>
                                </Tooltip>
                              );
                            }
                            return null;
                          })()}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
        </Grid>

        {/* Create Exam Modal */}
        <CreateExamModal
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          subjects={subjects}
        />

        {/* Create Questions Modal */}
        <CreateQuestionsModal
          open={questionsModalOpen}
          onClose={() => {
            setQuestionsModalOpen(false);
            setSelectedExam(null);
          }}
          exam={selectedExam}
        />
      </Box>
    </CaiLayout>
  );
}
