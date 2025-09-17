import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import CaiLayout from '@/Layouts/CaiLayout';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Avatar,
    Paper,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    LinearProgress,
    Pagination,
    IconButton,
    InputAdornment,
    Tooltip,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tabs,
    Tab
} from '@mui/material';
import {
    Person as PersonIcon,
    Search as SearchIcon,
    Visibility as VisibilityIcon,
    Assessment as AssessmentIcon,
    TrendingUp as TrendingUpIcon,
    School as SchoolIcon,
    CheckCircle as CheckCircleIcon,
    Close as CloseIcon,
    LocationOn as LocationOnIcon,
    Cake as CakeIcon,
    FilterList as FilterListIcon
} from '@mui/icons-material';

const StatCard = ({ title, value, icon, color = 'primary', subtitle }) => (
    <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { boxShadow: 4 } }}>
        <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                    <Typography color="textSecondary" gutterBottom variant="h6">
                        {title}
                    </Typography>
                    <Typography variant="h3" component="h2" color={`${color}.main`} fontWeight="bold">
                        {value}
                    </Typography>
                    {subtitle && (
                        <Typography color="textSecondary" variant="body2" sx={{ mt: 1 }}>
                            {subtitle}
                        </Typography>
                    )}
                </Box>
                <Avatar sx={{ bgcolor: `${color}.main`, width: 56, height: 56 }}>
                    {icon}
                </Avatar>
            </Box>
        </CardContent>
    </Card>
);

function TabPanel({ children, value, index }) {
    return value === index ? <Box sx={{ p: 3 }}>{children}</Box> : null;
}

export default function Learners({ auth, cai, learners, filters, stats }) {
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [statusFilter, setStatusFilter] = useState(filters?.status || '');
    const [selectedLearner, setSelectedLearner] = useState(null);
    const [profileOpen, setProfileOpen] = useState(false);
    const [tabValue, setTabValue] = useState(0);

    const handleSearch = () => {
        router.get(route('cai.learners'), {
            search: searchTerm,
            status: statusFilter
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleReset = () => {
        setSearchTerm('');
        setStatusFilter('');
        router.get(route('cai.learners'));
    };

    const handleViewProfile = (learner) => {
        setSelectedLearner(learner);
        setProfileOpen(true);
        setTabValue(0);
    };

    const handleViewReports = (learner) => {
        setSelectedLearner(learner);
        setProfileOpen(true);
        setTabValue(2);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'success';
            case 'Inactive': return 'default';
            case 'Completed': return 'info';
            default: return 'default';
        }
    };

    const getProgressColor = (progress) => {
        if (progress >= 80) return 'success';
        if (progress >= 50) return 'warning';
        return 'error';
    };

    return (
        <CaiLayout
            auth={auth}
            title="Learners Management"
            selectedSection="learners"
        >
            <Head title="CAI - Learners" />

            <Box sx={{ flexGrow: 1, p: 3 }}>
                {/* Summary Cards */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Total Learners"
                            value={stats?.total || 0}
                            icon={<PersonIcon fontSize="large" />}
                            color="primary"
                            subtitle="Assigned to you"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Active Learners"
                            value={stats?.active || 0}
                            icon={<CheckCircleIcon fontSize="large" />}
                            color="success"
                            subtitle="Currently enrolled"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Average Progress"
                            value={`${Math.round(learners?.data?.reduce((sum, learner) => sum + learner.progress, 0) / learners?.data?.length || 0)}%`}
                            icon={<TrendingUpIcon fontSize="large" />}
                            color="info"
                            subtitle="Module completion"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="High Performers"
                            value={stats?.highPerformers || 0}
                            icon={<SchoolIcon fontSize="large" />}
                            color="warning"
                            subtitle="≥80% progress"
                        />
                    </Grid>
                </Grid>

                {/* Search and Filter */}
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Learner List - Your assigned learners
                    </Typography>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Search learners"
                                variant="outlined"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    endAdornment: <SearchIcon />
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={statusFilter}
                                    label="Status"
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <MenuItem value="">All Status</MenuItem>
                                    <MenuItem value="Active">Active</MenuItem>
                                    <MenuItem value="Inactive">Inactive</MenuItem>
                                    <MenuItem value="Completed">Completed</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Button
                                variant="contained"
                                onClick={handleSearch}
                                startIcon={<SearchIcon />}
                                sx={{ mr: 1 }}
                            >
                                Search
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={handleReset}
                                startIcon={<FilterListIcon />}
                            >
                                Reset
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Learners Table */}
                <Paper>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Learner</TableCell>
                                    <TableCell>Contact Info</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Module Progress</TableCell>
                                    <TableCell>Attendance Rate</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {learners?.data?.map((learner) => (
                                    <TableRow key={learner.learner_id} hover>
                                        <TableCell>
                                            <Box display="flex" alignItems="center">
                                                <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                                    {learner.fullname?.charAt(0) || 'L'}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="subtitle1" fontWeight="bold">
                                                        {learner.fullname}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        ID: {learner.learner_re_no || learner.learner_id}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="textSecondary">
                                                Contact info available in profile
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={learner.status}
                                                color={getStatusColor(learner.status)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ minWidth: 120 }}>
                                                <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.5}>
                                                    <Typography variant="body2" fontWeight="bold">
                                                        {learner.progress}%
                                                    </Typography>
                                                    <Typography variant="caption" color="textSecondary">
                                                        {learner.completedModules}/{learner.totalModules}
                                                    </Typography>
                                                </Box>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={learner.progress}
                                                    color={getProgressColor(learner.progress)}
                                                    sx={{ height: 8, borderRadius: 4 }}
                                                />
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="bold">
                                                {learner.attendanceRate}%
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary">
                                                {learner.presentDays}/{learner.totalAttendanceDays} days
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                title="View Profile"
                                                onClick={() => handleViewProfile(learner)}
                                            >
                                                <VisibilityIcon />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color="secondary"
                                                title="View Reports"
                                                onClick={() => handleViewReports(learner)}
                                            >
                                                <AssessmentIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Pagination */}
                    <Box display="flex" justifyContent="center" p={2}>
                        <Pagination
                            count={learners?.last_page || 1}
                            page={learners?.current_page || 1}
                            onChange={(event, page) => {
                                router.get(route('cai.learners'), {
                                    ...filters,
                                    page: page
                                }, {
                                    preserveState: true,
                                    preserveScroll: true
                                });
                            }}
                            color="primary"
                        />
                    </Box>
                </Paper>

                {/* Learner Profile Dialog */}
                <Dialog
                    open={profileOpen}
                    onClose={() => setProfileOpen(false)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Typography variant="h6">
                                {selectedLearner ? selectedLearner.fullname : 'Learner Profile'}
                            </Typography>
                            <IconButton onClick={() => setProfileOpen(false)}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
                            <Tab label="Personal Info" />
                            <Tab label="Module Assignments" />
                            <Tab label="Reports" />
                        </Tabs>
                    </DialogTitle>
                    <DialogContent>
                        {selectedLearner && (
                            <>
                                <TabPanel value={tabValue} index={0}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={6}>
                                            <List>
                                                <ListItem>
                                                    <ListItemIcon><PersonIcon /></ListItemIcon>
                                                    <ListItemText
                                                        primary="Full Name"
                                                        secondary={selectedLearner.fullname}
                                                    />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemIcon><PersonIcon /></ListItemIcon>
                                                    <ListItemText
                                                        primary="Reference Number"
                                                        secondary={selectedLearner.learner_re_no || 'Not assigned'}
                                                    />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemIcon><CheckCircleIcon /></ListItemIcon>
                                                    <ListItemText
                                                        primary="Status"
                                                        secondary={
                                                            <Chip
                                                                label={selectedLearner.status}
                                                                color={getStatusColor(selectedLearner.status)}
                                                                size="small"
                                                            />
                                                        }
                                                    />
                                                </ListItem>
                                            </List>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Card>
                                                <CardContent>
                                                    <Typography variant="h6" gutterBottom>Performance Metrics</Typography>
                                                    <Box sx={{ mt: 2 }}>
                                                        <Typography variant="body2" color="textSecondary">Module Progress</Typography>
                                                        <Box display="flex" alignItems="center" sx={{ mt: 1 }}>
                                                            <LinearProgress 
                                                                variant="determinate" 
                                                                value={selectedLearner.progress || 0}
                                                                sx={{ flexGrow: 1, mr: 2 }}
                                                                color={getProgressColor(selectedLearner.progress || 0)}
                                                            />
                                                            <Typography variant="body2">{selectedLearner.progress || 0}%</Typography>
                                                        </Box>
                                                        <Typography variant="caption" color="textSecondary">
                                                            {selectedLearner.completedModules || 0} of {selectedLearner.totalModules || 0} modules completed
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ mt: 3 }}>
                                                        <Typography variant="body2" color="textSecondary">Attendance Rate</Typography>
                                                        <Typography variant="h4" color="primary.main">
                                                            {selectedLearner.attendanceRate || 0}%
                                                        </Typography>
                                                        <Typography variant="caption" color="textSecondary">
                                                            {selectedLearner.presentDays || 0} present out of {selectedLearner.totalAttendanceDays || 0} days
                                                        </Typography>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </Grid>
                                </TabPanel>

                                <TabPanel value={tabValue} index={1}>
                                    <Typography variant="h6" gutterBottom>
                                        Module Assignments & Progress
                                    </Typography>
                                    <Box sx={{ mb: 2 }}>
                                        <LinearProgress
                                            variant="determinate"
                                            value={selectedLearner.progress}
                                            color={getProgressColor(selectedLearner.progress)}
                                            sx={{ height: 12, borderRadius: 6 }}
                                        />
                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                            Overall Progress: {selectedLearner.progress}% 
                                            ({selectedLearner.completedModules}/{selectedLearner.totalModules} modules completed)
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" color="textSecondary">
                                        Detailed module assignments and attendance history would be loaded from the backend.
                                    </Typography>
                                </TabPanel>

                                <TabPanel value={tabValue} index={2}>
                                    <Typography variant="h6" gutterBottom>
                                        Learner Performance Report
                                    </Typography>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={6}>
                                            <Card>
                                                <CardContent>
                                                    <Typography variant="subtitle1" gutterBottom>
                                                        Module Performance
                                                    </Typography>
                                                    <Typography variant="h4" color="primary">
                                                        {selectedLearner.progress}%
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        {selectedLearner.completedModules} completed, {selectedLearner.inProgressModules || 0} in progress
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Card>
                                                <CardContent>
                                                    <Typography variant="subtitle1" gutterBottom>
                                                        Attendance Rate
                                                    </Typography>
                                                    <Typography variant="h4" color="success.main">
                                                        {selectedLearner.attendanceRate}%
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        {selectedLearner.presentDays} present out of {selectedLearner.totalAttendanceDays} days
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </Grid>
                                </TabPanel>
                            </>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setProfileOpen(false)}>Close</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </CaiLayout>
    );
}
