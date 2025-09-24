import React, { useState } from 'react';
import CaiLayout from '@/Layouts/CaiLayout';
import { Head, router } from '@inertiajs/react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Divider,
    List,
    ListItem,
    ListItemText,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    Tooltip
} from '@mui/material';
import {
    Visibility as VisibilityIcon,
    Quiz as QuizIcon,
    Assignment as AssignmentIcon,
    QuestionAnswer as QuestionAnswerIcon,
    School as SchoolIcon,
    Download as DownloadIcon,
    Add as AddIcon,
    PostAdd as PostAddIcon,
    PictureAsPdf as PdfIcon,
    Description as DocIcon,
    Publish as PublishIcon
} from '@mui/icons-material';

export default function ReviewerMonitoring({ auth, reviewers, stats, subjects = [] }) {
    const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
    const [selectedReviewer, setSelectedReviewer] = useState(null);
    const [createQuestionnaireOpen, setCreateQuestionnaireOpen] = useState(false);
    const [addQuestionsOpen, setAddQuestionsOpen] = useState(false);
    const [createReviewerOpen, setCreateReviewerOpen] = useState(false);
    const [selectedClasswork, setSelectedClasswork] = useState(null);
    const [selectedQuestionnaire, setSelectedQuestionnaire] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    // Questionnaire form data
    const [questionnaireData, setQuestionnaireData] = useState({
        classwork_id: '',
        subject_id: '',
        title: '',
        description: '',
        time_duration: 60
    });

    // Questions form data
    const [questionsData, setQuestionsData] = useState([
        { question_text: '', option_a: '', option_b: '', option_c: '', option_d: '', ans_key: 'A' },
        { question_text: '', option_a: '', option_b: '', option_c: '', option_d: '', ans_key: 'A' },
        { question_text: '', option_a: '', option_b: '', option_c: '', option_d: '', ans_key: 'A' }
    ]);

    // Reviewer creation form data
    const [reviewerData, setReviewerData] = useState({
        test_title: '',
        test_description: '',
        test_level: 'reviewer'
    });

    const handleViewDetails = (reviewer) => {
        setSelectedReviewer(reviewer);
        setViewDetailsOpen(true);
    };

    const handleCloseDetails = () => {
        setViewDetailsOpen(false);
        setSelectedReviewer(null);
    };

    const handleDownloadFile = (classworkId) => {
        window.open(route('cai.reviewers.download', classworkId), '_blank');
    };

    const handleCreateQuestionnaire = (reviewer) => {
        setQuestionnaireData({
            classwork_id: reviewer.classwork_id,
            subject_id: '',
            title: '',
            description: '',
            time_duration: 60
        });
        setSelectedReviewer(reviewer);
        setCreateQuestionnaireOpen(true);
    };

    const handleAddQuestions = (questionnaire) => {
        setSelectedQuestionnaire(questionnaire);
        // Reset questions data when opening modal
        setQuestionsData([
            { question_text: '', option_a: '', option_b: '', option_c: '', option_d: '', ans_key: 'A' },
            { question_text: '', option_a: '', option_b: '', option_c: '', option_d: '', ans_key: 'A' },
            { question_text: '', option_a: '', option_b: '', option_c: '', option_d: '', ans_key: 'A' }
        ]);
        setAddQuestionsOpen(true);
    };

    const submitQuestionnaire = () => {
        setLoading(true);
        setError('');

        router.post(route('cai.reviewers.questionnaires.store'), questionnaireData, {
            onSuccess: () => {
                setSuccess('Questionnaire created successfully!');
                setCreateQuestionnaireOpen(false);
                setQuestionnaireData({ classwork_id: '', subject_id: '', title: '', description: '', time_duration: 60 });
            },
            onError: (errors) => {
                setError(Object.values(errors).flat().join(', '));
            },
            onFinish: () => setLoading(false)
        });
    };

    const submitQuestions = () => {
        setLoading(true);
        setError('');

        const validQuestions = questionsData.filter(q => q.question_text.trim() !== '');
        if (validQuestions.length === 0) {
            setError('Please add at least one question');
            setLoading(false);
            return;
        }

        router.post(route('cai.reviewers.questions.store'), {
            questionnaire_id: selectedQuestionnaire.qn_id,
            questions: validQuestions
        }, {
            onSuccess: () => {
                setSuccess(`${validQuestions.length} questions added successfully!`);
                setAddQuestionsOpen(false);
                setSelectedQuestionnaire(null);
            },
            onError: (errors) => {
                setError(Object.values(errors).flat().join(', '));
            },
            onFinish: () => setLoading(false)
        });
    };

    const updateQuestion = (index, field, value) => {
        setQuestionsData(prev => prev.map((q, i) => 
            i === index ? { ...q, [field]: value } : q
        ));
    };

    const handleCreateReviewer = () => {
        if (!reviewerData.test_title.trim()) {
            setError('Please enter a reviewer title');
            return;
        }

        router.post(route('cai.classwork.store'), reviewerData, {
            onSuccess: () => {
                setSuccess('Reviewer classwork created successfully!');
                setCreateReviewerOpen(false);
                setReviewerData({
                    test_title: '',
                    test_description: '',
                    test_level: 'reviewer'
                });
            },
            onError: (errors) => {
                setError(Object.values(errors).flat().join(', '));
            }
        });
    };

    const getTestLevelColor = (level) => {
        switch (level) {
            case 'reviewer': return 'primary';
            case 'pretest': return 'warning';
            case 'posttest': return 'success';
            default: return 'default';
        }
    };

    const getTestLevelIcon = (level) => {
        switch (level) {
            case 'reviewer': return <QuizIcon />;
            case 'pretest': return <AssignmentIcon />;
            case 'posttest': return <SchoolIcon />;
            default: return <QuestionAnswerIcon />;
        }
    };

    return (
        <CaiLayout auth={auth} title="Reviewer Monitoring">
            <Head title="Reviewer Monitoring" />
            
            <Box sx={{ p: 3 }}>
                {/* Header */}
                <Typography variant="h4" sx={{ mb: 2, color: '#fff' }}>
                    Reviewer Management - {stats.clc_name}
                </Typography>
                <Typography variant="body1" sx={{ color: '#e0e0e0' }}>
                    Download admin materials and create reviewer classworks for your learners to practice.
                </Typography>

                {/* Success/Error Messages */}
                {success && (
                    <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
                        {success}
                    </Alert>
                )}
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                        {error}
                    </Alert>
                )}

                {/* Statistics Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                            <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                <QuizIcon sx={{ fontSize: 40, mb: 1 }} />
                                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    {stats.total_reviewers}
                                </Typography>
                                <Typography variant="body2">
                                    Total Reviewers
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
                            <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                <AssignmentIcon sx={{ fontSize: 40, mb: 1 }} />
                                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    {stats.total_pretests}
                                </Typography>
                                <Typography variant="body2">
                                    Pre-Tests
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
                            <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                <SchoolIcon sx={{ fontSize: 40, mb: 1 }} />
                                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    {stats.total_posttests}
                                </Typography>
                                <Typography variant="body2">
                                    Post-Tests
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
                            <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                <QuestionAnswerIcon sx={{ fontSize: 40, mb: 1 }} />
                                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    {stats.total_questions}
                                </Typography>
                                <Typography variant="body2">
                                    Total Questions
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Reviewers Table */}
                <Card>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                Available Tests & Reviewers
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<PostAddIcon />}
                                onClick={() => setCreateReviewerOpen(true)}
                                sx={{ 
                                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                    boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)'
                                }}
                            >
                                Create Reviewer
                            </Button>
                        </Box>
                        <TableContainer component={Paper} elevation={0}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Test Level</TableCell>
                                         <TableCell sx={{ fontWeight: 'bold' }}>Title & Description</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>CLC & Questionnaires</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Questions</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Posted Date</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {reviewers.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                                                <Typography variant="body1" color="textSecondary">
                                                    No reviewers or tests available yet. Admin needs to create tests for monitoring.
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        reviewers.map((reviewer) => (
                                            <TableRow key={reviewer.classwork_id} hover>
                                                <TableCell>
                                                    <Chip
                                                        icon={getTestLevelIcon(reviewer.test_level)}
                                                        label={reviewer.test_level.charAt(0).toUpperCase() + reviewer.test_level.slice(1)}
                                                        color={getTestLevelColor(reviewer.test_level)}
                                                        variant="outlined"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Box>
                                                        {reviewer.questionnaires.length > 0 ? (
                                                            <Box>
                                                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                                                    {reviewer.questionnaires[0].title || 'Untitled'}
                                                                </Typography>
                                                                <Typography variant="body2" color="textSecondary">
                                                                    {reviewer.questionnaires[0].description || 'No description'}
                                                                </Typography>
                                                            </Box>
                                                        ) : (
                                                            <Typography variant="body2" color="textSecondary">
                                                                No questionnaire yet
                                                            </Typography>
                                                        )}
                                                        {reviewer.fileStorage && (
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                                                {reviewer.fileStorage.mime_type?.includes('pdf') ? 
                                                                    <PdfIcon color="error" fontSize="small" /> : 
                                                                    <DocIcon color="primary" fontSize="small" />
                                                                }
                                                                <Typography variant="caption" color="primary">
                                                                    {reviewer.fileStorage.original_name}
                                                                </Typography>
                                                            </Box>
                                                        )}
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box>
                                                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                            {reviewer.clc?.clc_name || 'All CLCs'}
                                                        </Typography>
                                                        <Typography variant="caption" color="textSecondary">
                                                            {reviewer.questionnaires.length} questionnaire(s)
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label="Posted"
                                                        color="success"
                                                        size="small"
                                                        icon={<PublishIcon />}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {reviewer.questionnaires.reduce((total, q) => total + q.questions.length, 0)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Box>
                                                        <Typography variant="body2">
                                                            {new Date(reviewer.posted_at || reviewer.created_at).toLocaleDateString()}
                                                        </Typography>
                                                        <Typography variant="caption" color="textSecondary">
                                                            Posted
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                        <Tooltip title="View Details">
                                                            <IconButton
                                                                color="primary"
                                                                onClick={() => handleViewDetails(reviewer)}
                                                                size="small"
                                                            >
                                                                <VisibilityIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                        {reviewer.fileStorage && (
                                                            <Tooltip title="Download File">
                                                                <IconButton
                                                                    color="success"
                                                                    onClick={() => handleDownloadFile(reviewer.classwork_id)}
                                                                    size="small"
                                                                >
                                                                    <DownloadIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                        )}
                                                        <Tooltip title="Create Questionnaire">
                                                            <IconButton
                                                                color="secondary"
                                                                onClick={() => handleCreateQuestionnaire(reviewer)}
                                                                size="small"
                                                            >
                                                                <AddIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>

                {/* View Details Dialog */}
                <Dialog
                    open={viewDetailsOpen}
                    onClose={handleCloseDetails}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {selectedReviewer && getTestLevelIcon(selectedReviewer.test_level)}
                            Test Details
                        </Box>
                    </DialogTitle>
                    <DialogContent dividers>
                        {selectedReviewer && (
                            <Box>
                                <Grid container spacing={2} sx={{ mb: 3 }}>
                                    <Grid item xs={6}>
                                        <Typography variant="subtitle2" color="textSecondary">Test Level:</Typography>
                                        <Chip
                                            icon={getTestLevelIcon(selectedReviewer.test_level)}
                                            label={selectedReviewer.test_level.charAt(0).toUpperCase() + selectedReviewer.test_level.slice(1)}
                                            color={getTestLevelColor(selectedReviewer.test_level)}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="subtitle2" color="textSecondary">Created Date:</Typography>
                                        <Typography variant="body1">
                                            {new Date(selectedReviewer.created_at).toLocaleDateString()}
                                        </Typography>
                                    </Grid>
                                </Grid>

                                <Divider sx={{ my: 2 }} />

                                <Typography variant="h6" sx={{ mb: 2 }}>Questionnaires</Typography>
                                {selectedReviewer.questionnaires.length === 0 ? (
                                    <Typography variant="body2" color="textSecondary">
                                        No questionnaires available.
                                    </Typography>
                                ) : (
                                    selectedReviewer.questionnaires.map((questionnaire, index) => (
                                        <Card key={questionnaire.qn_id} sx={{ mb: 2 }}>
                                            <CardContent>
                                                <Typography variant="h6" sx={{ mb: 1 }}>
                                                    {questionnaire.title || `Questionnaire ${index + 1}`}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                                                    {questionnaire.description || 'No description'}
                                                </Typography>
                                                
                                                <Grid container spacing={2} sx={{ mb: 2 }}>
                                                    <Grid item xs={6}>
                                                        <Typography variant="subtitle2" color="textSecondary">Subject:</Typography>
                                                        <Typography variant="body2">
                                                            {questionnaire.subject?.subject_name || 'No subject'}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Typography variant="subtitle2" color="textSecondary">Duration:</Typography>
                                                        <Typography variant="body2">
                                                            {questionnaire.time_duration || 'Not set'} minutes
                                                        </Typography>
                                                    </Grid>
                                                </Grid>

                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                    <Typography variant="subtitle2">
                                                        Questions ({questionnaire.questions.length}):
                                                    </Typography>
                                                    <Button
                                                        size="small"
                                                        startIcon={<PostAddIcon />}
                                                        onClick={() => handleAddQuestions(questionnaire)}
                                                        variant="outlined"
                                                    >
                                                        Add Questions
                                                    </Button>
                                                </Box>
                                                <List dense>
                                                    {questionnaire.questions.map((question, qIndex) => (
                                                        <ListItem key={question.question_id} sx={{ pl: 0 }}>
                                                            <ListItemText
                                                                primary={`${qIndex + 1}. ${question.question_text}`}
                                                                secondary={
                                                                    <Box sx={{ mt: 1 }}>
                                                                        <Typography variant="caption" display="block">
                                                                            A) {question.option_a}
                                                                        </Typography>
                                                                        <Typography variant="caption" display="block">
                                                                            B) {question.option_b}
                                                                        </Typography>
                                                                        <Typography variant="caption" display="block">
                                                                            C) {question.option_c}
                                                                        </Typography>
                                                                        <Typography variant="caption" display="block">
                                                                            D) {question.option_d}
                                                                        </Typography>
                                                                        <Typography variant="caption" display="block" sx={{ color: 'green', fontWeight: 'bold' }}>
                                                                            Correct Answer: {question.correct_answer}
                                                                        </Typography>
                                                                    </Box>
                                                                }
                                                            />
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDetails} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Create Questionnaire Modal */}
                <Dialog open={createQuestionnaireOpen} onClose={() => setCreateQuestionnaireOpen(false)} maxWidth="md" fullWidth>
                    <DialogTitle>Create Questionnaire for {selectedReviewer?.test_level}</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Questionnaire Title"
                                    value={questionnaireData.title}
                                    onChange={(e) => setQuestionnaireData(prev => ({ ...prev, title: e.target.value }))}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Description"
                                    value={questionnaireData.description}
                                    onChange={(e) => setQuestionnaireData(prev => ({ ...prev, description: e.target.value }))}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Subject</InputLabel>
                                    <Select
                                        value={questionnaireData.subject_id}
                                        label="Subject"
                                        onChange={(e) => setQuestionnaireData(prev => ({ ...prev, subject_id: e.target.value }))}
                                    >
                                        {subjects.map((subject) => (
                                            <MenuItem key={subject.subject_id} value={subject.subject_id}>
                                                {subject.subject_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Time Duration (minutes)"
                                    value={questionnaireData.time_duration}
                                    onChange={(e) => setQuestionnaireData(prev => ({ ...prev, time_duration: parseInt(e.target.value) }))}
                                    inputProps={{ min: 1, max: 300 }}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setCreateQuestionnaireOpen(false)}>Cancel</Button>
                        <Button onClick={submitQuestionnaire} variant="contained" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Questionnaire'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Add Questions Modal */}
                <Dialog open={addQuestionsOpen} onClose={() => setAddQuestionsOpen(false)} maxWidth="lg" fullWidth>
                    <DialogTitle>Add Questions to {selectedQuestionnaire?.title}</DialogTitle>
                    <DialogContent>
                        {questionsData.map((question, index) => (
                            <Card key={index} sx={{ mb: 2, mt: index === 0 ? 2 : 0 }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ mb: 2 }}>Question {index + 1}</Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={2}
                                                label="Question Text"
                                                value={question.question_text}
                                                onChange={(e) => updateQuestion(index, 'question_text', e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Option A"
                                                value={question.option_a}
                                                onChange={(e) => updateQuestion(index, 'option_a', e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Option B"
                                                value={question.option_b}
                                                onChange={(e) => updateQuestion(index, 'option_b', e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Option C"
                                                value={question.option_c}
                                                onChange={(e) => updateQuestion(index, 'option_c', e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Option D"
                                                value={question.option_d}
                                                onChange={(e) => updateQuestion(index, 'option_d', e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormControl fullWidth>
                                                <InputLabel>Correct Answer</InputLabel>
                                                <Select
                                                    value={question.ans_key}
                                                    label="Correct Answer"
                                                    onChange={(e) => updateQuestion(index, 'ans_key', e.target.value)}
                                                >
                                                    <MenuItem value="A">A</MenuItem>
                                                    <MenuItem value="B">B</MenuItem>
                                                    <MenuItem value="C">C</MenuItem>
                                                    <MenuItem value="D">D</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        ))}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setAddQuestionsOpen(false)}>Cancel</Button>
                        <Button onClick={submitQuestions} variant="contained" disabled={loading}>
                            {loading ? 'Adding Questions...' : 'Add Questions'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Create Reviewer Modal */}
                <Dialog open={createReviewerOpen} onClose={() => setCreateReviewerOpen(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>Create New Reviewer</DialogTitle>
                    <DialogContent>
                        <TextField
                            fullWidth
                            label="Reviewer Title"
                            value={reviewerData.test_title}
                            onChange={(e) => setReviewerData(prev => ({ ...prev, test_title: e.target.value }))}
                            sx={{ mb: 2, mt: 1 }}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            multiline
                            rows={3}
                            value={reviewerData.test_description}
                            onChange={(e) => setReviewerData(prev => ({ ...prev, test_description: e.target.value }))}
                            sx={{ mb: 2 }}
                        />
                        <Typography variant="body2" color="textSecondary">
                            This will create a reviewer classwork that you can add questionnaires and questions to for learner practice.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setCreateReviewerOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreateReviewer} variant="contained">
                            Create Reviewer
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </CaiLayout>
    );
}
