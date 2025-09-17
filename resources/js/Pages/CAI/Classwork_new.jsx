import React, { useState } from 'react';
import CaiLayout from '../../Layouts/CaiLayout';
import AddSubjectModal from './modals/AddSubjectModal';
import { router, Head } from '@inertiajs/react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Checkbox,
  FormControlLabel,
  Toolbar,
  Stack
} from '@mui/material';
import {
  Quiz as QuizIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Group as GroupIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
  Timer as TimerIcon,
  PostAdd as PostAddIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import '../../../css/adminTables.css';

export default function CaiClasswork({ auth, cai, classworks, subjects }) {
  const [selectedClasswork, setSelectedClasswork] = useState(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [addSubjectOpen, setAddSubjectOpen] = useState(false);
  const [questionnaireModalOpen, setQuestionnaireModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [testTypeFilter, setTestTypeFilter] = useState('All');
  const [newClasswork, setNewClasswork] = useState({
    test_level: 'reviewer'
  });
  
  // Multi-step questionnaire creation
  const [currentStep, setCurrentStep] = useState(1); // 1: Setup, 2: Questions
  const [currentQuestionnaireId, setCurrentQuestionnaireId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    id: Date.now(),
    question_text: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_answer: 'A'
  });
  const [questionnaireData, setQuestionnaireData] = useState({
    classwork_id: '',
    subject_id: '',
    title: '',
    description: '',
    time_duration: 30
  });

  const handleCreateClasswork = () => {
    router.post(route('cai.classwork.store'), newClasswork, {
      onSuccess: () => {
        setNewClasswork({ test_level: 'reviewer' });
      }
    });
  };

  const handleNextStep = () => {
    if (questionnaireData.subject_id && questionnaireData.title && questionnaireData.classwork_id) {
      router.post(route('cai.classwork.questionnaire.store'), questionnaireData, {
        onSuccess: (page) => {
          // Get the created questionnaire ID from response
          const createdQuestionnaire = page.props.questionnaire;
          if (createdQuestionnaire) {
            setCurrentQuestionnaireId(createdQuestionnaire.qn_id);
            setCurrentStep(2);
          }
        }
      });
    }
  };

  const handleAddQuestion = () => {
    if (currentQuestion.question_text && currentQuestion.option_a && currentQuestion.option_b) {
      setQuestions([...questions, { ...currentQuestion, id: Date.now() }]);
      setCurrentQuestion({
        id: Date.now(),
        question_text: '',
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        correct_answer: 'A'
      });
    }
  };

  const handleRemoveQuestion = (questionId) => {
    setQuestions(questions.filter(q => q.id !== questionId));
  };

  const handleSaveQuestions = () => {
    if (questions.length > 0 && currentQuestionnaireId) {
      const questionsData = {
        questionnaire_id: currentQuestionnaireId,
        questions: questions.map(q => ({
          question_text: q.question_text,
          option_a: q.option_a,
          option_b: q.option_b,
          option_c: q.option_c,
          option_d: q.option_d,
          correct_answer: q.correct_answer
        }))
      };

      router.post(route('cai.classwork.questions.store'), questionsData, {
        onSuccess: () => {
          handleResetQuestionnaire();
        }
      });
    }
  };

  const handleResetQuestionnaire = () => {
    setCurrentStep(1);
    setCurrentQuestionnaireId(null);
    setQuestions([]);
    setCurrentQuestion({
      id: Date.now(),
      question_text: '',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      correct_answer: 'A'
    });
    setQuestionnaireData({
      classwork_id: '',
      subject_id: '',
      title: '',
      description: '',
      time_duration: 30
    });
    setQuestionnaireModalOpen(false);
  };

  const handleViewDetails = (classwork) => {
    setSelectedClasswork(classwork);
    setViewDetailsOpen(true);
  };

  const handleAddQuestionnaire = (classwork) => {
    setQuestionnaireData({
      ...questionnaireData,
      classwork_id: classwork.classwork_id
    });
    setCurrentStep(1);
    setQuestionnaireModalOpen(true);
  };

  const getTestLevelColor = (level) => {
    switch(level) {
      case 'reviewer': return 'info';
      case 'pretest': return 'warning';
      case 'posttest': return 'success';
      default: return 'default';
    }
  };

  const getTestLevelLabel = (level) => {
    switch(level) {
      case 'reviewer': return 'Reviewer';
      case 'pretest': return 'Pre-test';
      case 'posttest': return 'Post-test';
      default: return level;
    }
  };

  // Filter classworks based on search and test type
  const filteredClassworks = classworks.filter(classwork => {
    const matchesSearch = classwork.test_title.toLowerCase().includes(search.toLowerCase()) ||
                         classwork.test_description.toLowerCase().includes(search.toLowerCase());
    const matchesType = testTypeFilter === 'All' || classwork.test_level === testTypeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <CaiLayout user={auth?.user} selectedSection="classwork">
      <Head title="Classwork Management" />
      
      <Box sx={{ width: '100%', p: 3 }}>
        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      Total Tests
                    </Typography>
                    <Typography variant="h4" color="primary">
                      {classworks?.length || 0}
                    </Typography>
                  </Box>
                  <QuizIcon sx={{ fontSize: 40, color: 'primary.main', opacity: 0.7 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      Questionnaires
                    </Typography>
                    <Typography variant="h4" color="success">
                      {classworks?.reduce((acc, cw) => acc + (cw.questionnaires?.length || 0), 0) || 0}
                    </Typography>
                  </Box>
                  <AssignmentIcon sx={{ fontSize: 40, color: 'success.main', opacity: 0.7 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      Available Subjects
                    </Typography>
                    <Typography variant="h4" color="info">
                      {subjects?.length || 0}
                    </Typography>
                    <Button
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => setAddSubjectOpen(true)}
                      sx={{ mt: 1 }}
                    >
                      Add Subject
                    </Button>
                  </Box>
                  <SchoolIcon sx={{ fontSize: 40, color: 'info.main', opacity: 0.7 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      Test Types
                    </Typography>
                    <Typography variant="h4" color="warning">
                      3
                    </Typography>
                  </Box>
                  <TimerIcon sx={{ fontSize: 40, color: 'warning.main', opacity: 0.7 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Box sx={{ mb: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateClasswork}
            sx={{ 
              backgroundColor: '#3b82f6',
              '&:hover': { backgroundColor: '#2563eb' }
            }}
          >
            Create Test
          </Button>
        </Box>

        {/* Search and Filter Toolbar */}
        <Toolbar sx={{ px: 0, pb: 2, display: 'flex', gap: 2, justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search classwork..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{ sx: { color: '#e5e7eb' } }}
              sx={{ minWidth: 280, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.15)' } }}
            />
            <TextField
              select
              variant="outlined"
              size="small"
              value={testTypeFilter}
              onChange={(e) => setTestTypeFilter(e.target.value)}
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    sx: { backgroundColor: '#161e31ff', color: '#e5e7eb', '& .MuiMenuItem-root': { color: '#e5e7eb' } }
                  }
                }
              }}
              sx={{ minWidth: 200, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.15)' }, '& .MuiInputBase-input': { color: '#e5e7eb' } }}
            >
              <MenuItem value="All">All Types</MenuItem>
              <MenuItem value="reviewer">Reviewer</MenuItem>
              <MenuItem value="pretest">Pre-test</MenuItem>
              <MenuItem value="posttest">Post-test</MenuItem>
            </TextField>
          </Stack>
        </Toolbar>

        {/* Classwork Table */}
        <div className="admin-table-container">
          <Table stickyHeader size="medium" aria-label="classwork table" className="admin-table">
            <TableHead>
              <TableRow>
                <TableCell className="admin-table-header">Test Level</TableCell>
                <TableCell className="admin-table-header">Title & Description</TableCell>
                <TableCell className="admin-table-header">Questionnaires</TableCell>
                <TableCell className="admin-table-header">Created</TableCell>
                <TableCell align="right" className="admin-table-header actions">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredClassworks.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} style={{ opacity: 0.8, textAlign: 'center', py: 4 }}>
                    {classworks.length === 0 ? (
                      <Box>
                        <QuizIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" color="textSecondary" gutterBottom>
                          No classwork created yet
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Create your first test or assessment to get started
                        </Typography>
                      </Box>
                    ) : (
                      "No classwork found matching your search criteria."
                    )}
                  </TableCell>
                </TableRow>
              )}
              {filteredClassworks.map((classwork) => (
                <TableRow key={classwork.classwork_id} hover>
                  <TableCell>
                    <Chip 
                      label={getTestLevelLabel(classwork.test_level)}
                      color={getTestLevelColor(classwork.test_level)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {classwork.test_title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                        {classwork.test_description}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      {classwork.questionnaires && classwork.questionnaires.length > 0 ? (
                        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                          {classwork.questionnaires.map((q) => (
                            <Chip 
                              key={q.qn_id}
                              label={`${q.subject?.subject_name}: ${q.title}`}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.75rem' }}
                            />
                          ))}
                        </Stack>
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          No questionnaires yet
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {new Date(classwork.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right" className="actions">
                    <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
                      <IconButton 
                        size="small" 
                        sx={{ color: '#93c5fd' }}
                        onClick={() => handleViewDetails(classwork)}
                        title="View Details"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        sx={{ color: '#34d399' }}
                        onClick={() => handleAddQuestionnaire(classwork)}
                        title="Add Questionnaire"
                      >
                        <PostAddIcon />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* View Details Modal */}
        <Dialog open={viewDetailsOpen} onClose={() => setViewDetailsOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            <Box display="flex" alignItems="center" gap={2}>
              <QuizIcon color="primary" />
              <Typography variant="h6">Classwork Details</Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            {selectedClasswork && (
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Test Level:</strong> {getTestLevelLabel(selectedClasswork.test_level)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Created:</strong> {new Date(selectedClasswork.created_at).toLocaleDateString()}
                    </Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>
                  Questionnaires ({selectedClasswork.questionnaires?.length || 0})
                </Typography>
                
                {selectedClasswork.questionnaires && selectedClasswork.questionnaires.length > 0 ? (
                  <List>
                    {selectedClasswork.questionnaires.map((questionnaire) => (
                      <ListItem key={questionnaire.qn_id}>
                        <ListItemAvatar>
                          <AssignmentIcon color="success" />
                        </ListItemAvatar>
                        <ListItemText
                          primary={questionnaire.title}
                          secondary={`Subject: ${questionnaire.subject?.subject_name} • Duration: ${questionnaire.time_duration} minutes`}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography color="textSecondary">
                    No questionnaires created yet for this classwork.
                  </Typography>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewDetailsOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Add Subject Modal */}
        <AddSubjectModal 
          open={addSubjectOpen} 
          onClose={() => setAddSubjectOpen(false)} 
        />

        {/* Questionnaire Creation Modal */}
        <Dialog 
          open={questionnaireModalOpen} 
          onClose={handleResetQuestionnaire}
          maxWidth={currentStep === 1 ? "md" : "lg"}
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" alignItems="center" gap={2}>
              <QuizIcon color="primary" />
              <Typography variant="h6">
                {currentStep === 1 ? 'Create Questionnaire' : 'Add Questions'}
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ minHeight: 400 }}>
            <Box display="flex" sx={{ gap: 3, mt: 2 }}>
              {/* Left Side - Questionnaire Setup */}
              <Box sx={{ 
                width: currentStep === 1 ? '100%' : '45%', 
                transition: 'all 0.3s ease-in-out'
              }}>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Questionnaire Setup
                  </Typography>
                  {currentStep === 2 && (
                    <Chip label="Completed" color="success" size="small" />
                  )}
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {/* Row 1: Subject and Time Duration */}
                  <Box display="flex" gap={2}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                        Subject
                      </Typography>
                      <FormControl fullWidth size="small" disabled={currentStep === 2}>
                        <Select
                          value={questionnaireData.subject_id}
                          onChange={(e) => setQuestionnaireData({ ...questionnaireData, subject_id: e.target.value })}
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
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                        Time Duration
                      </Typography>
                      <TextField
                        type="number"
                        value={questionnaireData.time_duration}
                        onChange={(e) => setQuestionnaireData({ ...questionnaireData, time_duration: parseInt(e.target.value) })}
                        size="small"
                        fullWidth
                        disabled={currentStep === 2}
                        helperText="hh:mm"
                        sx={{ 
                          '& .MuiInputBase-root': { 
                            backgroundColor: '#f5f5f5', 
                            borderRadius: 2 
                          }
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Row 2: Title */}
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                      Title
                    </Typography>
                    <TextField
                      value={questionnaireData.title}
                      onChange={(e) => setQuestionnaireData({ ...questionnaireData, title: e.target.value })}
                      size="small"
                      fullWidth
                      disabled={currentStep === 2}
                      sx={{ 
                        '& .MuiInputBase-root': { 
                          backgroundColor: '#f5f5f5', 
                          borderRadius: 2 
                        }
                      }}
                    />
                  </Box>

                  {/* Row 3: Description */}
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                      Description
                    </Typography>
                    <TextField
                      value={questionnaireData.description}
                      onChange={(e) => setQuestionnaireData({ ...questionnaireData, description: e.target.value })}
                      multiline
                      rows={4}
                      size="small"
                      fullWidth
                      disabled={currentStep === 2}
                      sx={{ 
                        '& .MuiInputBase-root': { 
                          backgroundColor: '#f5f5f5', 
                          borderRadius: 2 
                        }
                      }}
                    />
                  </Box>

                  {currentStep === 1 && (
                    <Button
                      variant="contained"
                      onClick={handleNextStep}
                      disabled={!questionnaireData.subject_id || !questionnaireData.title}
                      sx={{ mt: 2 }}
                    >
                      Next: Add Questions
                    </Button>
                  )}
                </Box>
              </Box>

              {/* Right Side - Question Form (only visible in step 2) */}
              {currentStep === 2 && (
                <Box sx={{ 
                  width: '55%',
                  pl: 3,
                  borderLeft: '1px solid #e0e0e0',
                  transform: 'translateX(0)',
                  opacity: 1,
                  transition: 'all 0.3s ease-in-out'
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Add Questions ({questions.length})
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                      label="Question"
                      value={currentQuestion.question_text}
                      onChange={(e) => setCurrentQuestion({ ...currentQuestion, question_text: e.target.value })}
                      multiline
                      rows={2}
                      fullWidth
                      size="small"
                    />

                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField
                          label="Option A"
                          value={currentQuestion.option_a}
                          onChange={(e) => setCurrentQuestion({ ...currentQuestion, option_a: e.target.value })}
                          fullWidth
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="Option B"
                          value={currentQuestion.option_b}
                          onChange={(e) => setCurrentQuestion({ ...currentQuestion, option_b: e.target.value })}
                          fullWidth
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="Option C"
                          value={currentQuestion.option_c}
                          onChange={(e) => setCurrentQuestion({ ...currentQuestion, option_c: e.target.value })}
                          fullWidth
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="Option D"
                          value={currentQuestion.option_d}
                          onChange={(e) => setCurrentQuestion({ ...currentQuestion, option_d: e.target.value })}
                          fullWidth
                          size="small"
                        />
                      </Grid>
                    </Grid>

                    <FormControl size="small" sx={{ minWidth: 200 }}>
                      <InputLabel>Correct Answer</InputLabel>
                      <Select
                        value={currentQuestion.correct_answer}
                        onChange={(e) => setCurrentQuestion({ ...currentQuestion, correct_answer: e.target.value })}
                      >
                        <MenuItem value="A">A</MenuItem>
                        <MenuItem value="B">B</MenuItem>
                        <MenuItem value="C">C</MenuItem>
                        <MenuItem value="D">D</MenuItem>
                      </Select>
                    </FormControl>

                    <Button
                      variant="outlined"
                      onClick={handleAddQuestion}
                      disabled={!currentQuestion.question_text || !currentQuestion.option_a || !currentQuestion.option_b}
                      sx={{ mt: 1 }}
                    >
                      Add Question
                    </Button>
                  </Box>

                  {/* Questions List */}
                  {questions.length > 0 && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Added Questions:
                      </Typography>
                      <List dense>
                        {questions.map((q, index) => (
                          <ListItem key={q.id} sx={{ px: 0 }}>
                            <ListItemText
                              primary={`${index + 1}. ${q.question_text}`}
                              secondary={`Correct: ${q.correct_answer}`}
                            />
                            <IconButton 
                              size="small" 
                              onClick={() => handleRemoveQuestion(q.id)}
                              color="error"
                            >
                              <CancelIcon />
                            </IconButton>
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleResetQuestionnaire}
              startIcon={<CancelIcon />}
            >
              Cancel
            </Button>
            {currentStep === 2 && (
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSaveQuestions}
                disabled={questions.length === 0}
              >
                Save Questions
              </Button>
            )}
          </DialogActions>
        </Dialog>

      </Box>
    </CaiLayout>
  );
}
