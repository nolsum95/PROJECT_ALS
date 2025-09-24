import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import {
    Box, Card, CardContent, Typography, Grid, Table, TableBody, TableCell,
    TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent,
    DialogActions, Button, Alert, Chip, List, ListItem, ListItemText, Divider
} from '@mui/material';
import {
    Visibility as VisibilityIcon, Quiz as QuizIcon,
    School as SchoolIcon, QuestionAnswer as QuestionAnswerIcon
} from '@mui/icons-material';

export default function ReviewerManagement({ auth, stats = {}, clcsWithStats = [] }) {
    const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
    const [selectedReviewer, setSelectedReviewer] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleViewDetails = (clc) => {
        setSelectedReviewer(clc);
        setViewDetailsOpen(true);
    };

    const handleCloseDetails = () => {
        setViewDetailsOpen(false);
        setSelectedReviewer(null);
    };

    return (
        <AdminLayout auth={auth} selectedSection="reviewers">
            <Head title="Admin - Reviewer Management" />
            <Box sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>Reviewer Management</Typography>
                <Typography variant="body1" sx={{ mb: 3, color: '#666' }}>
                    Monitor CAI-created reviewer classworks for learner practice.
                </Typography>
                
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                {/* Summary Cards */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" variant="h6">CAI Reviewers</Typography>
                                <Typography variant="h3" color="primary.main">{stats?.total_cai_reviewers || 0}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" variant="h6">Questionnaires</Typography>
                                <Typography variant="h3" color="info.main">{stats?.total_questionnaires || 0}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" variant="h6">Questions</Typography>
                                <Typography variant="h3" color="warning.main">{stats?.total_questions || 0}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" variant="h6">Active CLCs</Typography>
                                <Typography variant="h3" color="success.main">{stats?.active_clcs || 0}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>


                {/* CLC Statistics Section */}
                <Paper sx={{ p: 2, mt: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>CLC Statistics - CAI Created Content</Typography>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>CLC Name</TableCell>
                                <TableCell>CAI Name</TableCell>
                                <TableCell>Classworks</TableCell>
                                <TableCell>Questionnaires</TableCell>
                                <TableCell>Questions</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {clcsWithStats?.length === 0 ? (
                                <TableRow><TableCell colSpan={6} align="center">No CLC statistics available.</TableCell></TableRow>
                            ) : clcsWithStats?.map((clc) => (
                                <TableRow key={clc.clc_id}>
                                    <TableCell>{clc.clc_name}</TableCell>
                                    <TableCell>{clc.cai?.name || 'No CAI assigned'}</TableCell>
                                    <TableCell>{clc.classworks_count || 0}</TableCell>
                                    <TableCell>{clc.questionnaires_count || 0}</TableCell>
                                    <TableCell>{clc.questions_count || 0}</TableCell>
                                    <TableCell>
                                        <IconButton 
                                            size="small" 
                                            color="primary"
                                            onClick={() => handleViewDetails(clc)}
                                        >
                                            <VisibilityIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>

                {/* View Details Modal */}
                <Dialog open={viewDetailsOpen} onClose={handleCloseDetails} maxWidth="lg" fullWidth>
                    <DialogTitle>
                        CLC Details: {selectedReviewer?.clc_name}
                    </DialogTitle>
                    <DialogContent>
                        {selectedReviewer && (
                            <Box>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    {selectedReviewer.clc_name}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                                    Assigned CAI: {selectedReviewer.cai?.name || 'No CAI assigned'}
                                </Typography>
                                
                                <Divider sx={{ my: 2 }} />
                                
                                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                    CAI Activity Summary:
                                </Typography>
                                
                                {selectedReviewer.cais?.map((cai) => (
                                    <Box key={cai.cai_id} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                                        <Typography variant="h6">{cai.firstname} {cai.lastname}</Typography>
                                        <Typography variant="body2">Questionnaires: {cai.questionnaires_count || 0}</Typography>
                                        <Typography variant="body2">Questions: {cai.questions_count || 0}</Typography>
                                    </Box>
                                )) || (
                                    <Typography variant="body2" color="textSecondary">
                                        No CAI activity data available.
                                    </Typography>
                                )}
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDetails}>Close</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </AdminLayout>
    );
}
