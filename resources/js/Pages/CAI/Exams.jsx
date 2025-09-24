import React, { useState } from 'react';
import CaiLayout from '@/Layouts/CaiLayout';
import { Head } from '@inertiajs/react';
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
  PostAdd as PostAddIcon
} from '@mui/icons-material';
import CreateExamModal from './modals/CreateExamModal';
import CreateQuestionsModal from './modals/CreateQuestionsModal';

export default function Exams({ auth, classworks = [], subjects = [] }) {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [questionsModalOpen, setQuestionsModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [success, setSuccess] = useState('');

  const handleAddQuestions = (exam) => {
    setSelectedExam(exam);
    setQuestionsModalOpen(true);
  };

  return (
    <CaiLayout auth={auth} title="Exams">
      <Head title="CAI - Exams" />
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>Exams (Pretest/Posttest)</Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Create Pretest and Posttest exams. Admin will upload assessment files separately.
        </Typography>

        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Grid container spacing={3}>
          {/* Main Content Area */}
          <Grid item xs={12} lg={9}>
            <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
              {/* Header with Create Button */}
              <Box sx={{ 
                p: 2, 
                display: 'flex', 
                justifyContent: 'flex-end',
                borderBottom: '1px solid #e0e0e0'
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
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Subject</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Questions</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Duration</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {classworks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                        <Typography variant="body1" color="textSecondary">
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
                        <Typography variant="caption" color="textSecondary">
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
                        <Typography variant="body2">
                          {classwork.questionnaires?.[0]?.time_duration || 30} min
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(classwork.created_at).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
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
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Grid>

          {/* Statistics Cards - Right Side */}
          <Grid item xs={18} lg={3}>
            <Grid container spacing={2}>
              {/* Total Exams */}
              <Grid item xs={6}>
                <Card sx={{ 
                  borderRadius: 3, 
                  boxShadow: 2, 
                  backgroundColor: '#ffffff',
                  minHeight: 140
                }}>
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="h1" sx={{ 
                      fontWeight: 700, 
                      color: 'primary.main', 
                      mb: 1,
                      fontSize: '3rem'
                    }}>
                      {classworks.length}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ 
                      fontWeight: 500,
                      mb: 2
                    }}>
                      Total Exams
                    </Typography>
                    <Box sx={{ 
                      p: 1, 
                      backgroundColor: 'primary.main', 
                      borderRadius: 2,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: 35,
                      minHeight: 35
                    }}>
                      <QuizIcon sx={{ color: 'white', fontSize: 20 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Posttests */}
              <Grid item xs={6}>
                <Card sx={{ 
                  borderRadius: 3, 
                  boxShadow: 2, 
                  backgroundColor: '#ffffff',
                  minHeight: 140
                }}>
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="h1" sx={{ 
                      fontWeight: 700, 
                      color: 'success.main', 
                      mb: 1,
                      fontSize: '3rem'
                    }}>
                      {classworks.filter(c => c.test_level === 'posttest').length}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ 
                      fontWeight: 500,
                      mb: 2
                    }}>
                      Posttests
                    </Typography>
                    <Chip 
                      label="POST" 
                      color="success" 
                      sx={{ 
                        fontWeight: 600, 
                        fontSize: '0.75rem',
                        minWidth: 50
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>

              {/* Pretests */}
              <Grid item xs={6}>
                <Card sx={{ 
                  borderRadius: 3, 
                  boxShadow: 2, 
                  backgroundColor: '#ffffff',
                  minHeight: 140
                }}>
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="h1" sx={{ 
                      fontWeight: 700, 
                      color: 'warning.main', 
                      mb: 1,
                      fontSize: '3rem'
                    }}>
                      {classworks.filter(c => c.test_level === 'pretest').length}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ 
                      fontWeight: 500,
                      mb: 2
                    }}>
                      Pretests
                    </Typography>
                    <Chip 
                      label="PRE" 
                      color="warning" 
                      sx={{ 
                        fontWeight: 600, 
                        fontSize: '0.75rem',
                        minWidth: 50
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>

              {/* Total Questions */}
              <Grid item xs={6}>
                <Card sx={{ 
                  borderRadius: 3, 
                  boxShadow: 2, 
                  backgroundColor: '#ffffff',
                  minHeight: 140
                }}>
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="h1" sx={{ 
                      fontWeight: 700, 
                      color: 'info.main', 
                      mb: 1,
                      fontSize: '3rem'
                    }}>
                      {classworks.reduce((total, c) => total + (c.questionnaires?.reduce((t, q) => t + (q.questions?.length || 0), 0) || 0), 0)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ 
                      fontWeight: 500,
                      mb: 2
                    }}>
                      Total Questions
                    </Typography>
                    <Box sx={{ 
                      p: 1, 
                      backgroundColor: 'info.main', 
                      borderRadius: 2,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: 35,
                      minHeight: 35
                    }}>
                      <EditIcon sx={{ color: 'white', fontSize: 20 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
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
