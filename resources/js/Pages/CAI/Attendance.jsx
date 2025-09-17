import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import CaiLayout from '@/Layouts/CaiLayout';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Avatar,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Tabs,
    Tab,
    LinearProgress,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Pagination
} from '@mui/material';
import {
    Person as PersonIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Schedule as ScheduleIcon,
    Info as InfoIcon,
    Edit as EditIcon,
    Save as SaveIcon,
    Today as TodayIcon,
    History as HistoryIcon,
    Assessment as AssessmentIcon,
    EventAvailable as EventAvailableIcon,
    TrendingUp as TrendingUpIcon,
    Warning as WarningIcon,
    School as SchoolIcon
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

export default function Attendance({ auth, cai, view, learners, selectedDate, stats, attendanceRecords, startDate, endDate, learnerReports, monthlyStats, selectedMonth }) {
    const [tabValue, setTabValue] = useState(
        view === 'mark' ? 0 : view === 'records' ? 1 : view === 'reports' ? 2 : 0
    );
    const [currentDate, setCurrentDate] = useState(selectedDate || new Date().toISOString().split('T')[0]);
    const [editingLearner, setEditingLearner] = useState(null);
    const [attendanceData, setAttendanceData] = useState({
        attendance_status: 'Present',
        attendance_remarks: ''
    });

    const handleViewChange = (event, newValue) => {
        setTabValue(newValue);
        const viewMap = { 0: 'mark', 1: 'records', 2: 'reports' };
        router.get(route('cai.attendance'), {
            view: viewMap[newValue],
            date: currentDate
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleDateChange = (newDate) => {
        setCurrentDate(newDate);
        router.get(route('cai.attendance'), {
            view: view || 'mark',
            date: newDate
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleMarkAttendance = (learner, status) => {
        const data = {
            learner_id: learner.learner_id,
            attendance_date: currentDate,
            attendance_status: status,
            attendance_remarks: ''
        };

        router.post(route('cai.attendance.store'), data, {
            onSuccess: () => {
                // Success handled by backend
            },
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleEditAttendance = (learnerData) => {
        setEditingLearner(learnerData.learner);
        setAttendanceData({
            attendance_status: learnerData.status || 'Present',
            attendance_remarks: learnerData.remarks || ''
        });
    };

    const handleSaveAttendance = () => {
        const data = {
            learner_id: editingLearner.learner_id,
            attendance_date: currentDate,
            attendance_status: attendanceData.attendance_status,
            attendance_remarks: attendanceData.attendance_remarks
        };

        router.post(route('cai.attendance.store'), data, {
            onSuccess: () => {
                setEditingLearner(null);
                setAttendanceData({ attendance_status: 'Present', attendance_remarks: '' });
            },
            preserveState: true,
            preserveScroll: true
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Present': return 'success';
            case 'Absent': return 'error';
            case 'Late': return 'warning';
            case 'Excused': return 'info';
            default: return 'default';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Present': return <CheckCircleIcon />;
            case 'Absent': return <CancelIcon />;
            case 'Late': return <ScheduleIcon />;
            case 'Excused': return <InfoIcon />;
            default: return <PersonIcon />;
        }
    };

    const getAttendanceRate = (rate) => {
        if (rate >= 90) return { color: 'success', label: 'Excellent' };
        if (rate >= 80) return { color: 'info', label: 'Good' };
        if (rate >= 70) return { color: 'warning', label: 'Fair' };
        return { color: 'error', label: 'Poor' };
    };

    return (
        <CaiLayout
            auth={auth}
            title="Attendance Management"
            selectedSection="attendance"
        >
            <Head title="CAI - Attendance" />

            <Box sx={{ flexGrow: 1, p: 3 }}>
                {/* Navigation Tabs */}
                <Paper sx={{ mb: 3 }}>
                    <Tabs value={tabValue} onChange={handleViewChange} variant="fullWidth">
                        <Tab 
                            icon={<TodayIcon />} 
                            label="Mark Attendance" 
                            sx={{ minHeight: 72 }}
                        />
                        <Tab 
                            icon={<HistoryIcon />} 
                            label="Attendance Records" 
                            sx={{ minHeight: 72 }}
                        />
                        <Tab 
                            icon={<AssessmentIcon />} 
                            label="Attendance Reports" 
                            sx={{ minHeight: 72 }}
                        />
                    </Tabs>
                </Paper>

                {/* Tab Content */}
                <TabPanel value={tabValue} index={0}>
                    {/* Mark Attendance View */}
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                        <Grid item xs={12} md={3}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Select Date"
                                value={currentDate}
                                onChange={(e) => handleDateChange(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} md={9}>
                            <Grid container spacing={2}>
                                <Grid item xs={6} sm={3} md={2}>
                                    <StatCard
                                        title="Present"
                                        value={stats?.present || 0}
                                        icon={<CheckCircleIcon fontSize="large" />}
                                        color="success"
                                    />
                                </Grid>
                                <Grid item xs={6} sm={3} md={2}>
                                    <StatCard
                                        title="Absent"
                                        value={stats?.absent || 0}
                                        icon={<CancelIcon fontSize="large" />}
                                        color="error"
                                    />
                                </Grid>
                                <Grid item xs={6} sm={3} md={2}>
                                    <StatCard
                                        title="Late"
                                        value={stats?.late || 0}
                                        icon={<ScheduleIcon fontSize="large" />}
                                        color="warning"
                                    />
                                </Grid>
                                <Grid item xs={6} sm={3} md={2}>
                                    <StatCard
                                        title="Excused"
                                        value={stats?.excused || 0}
                                        icon={<InfoIcon fontSize="large" />}
                                        color="info"
                                    />
                                </Grid>
                                <Grid item xs={6} sm={3} md={2}>
                                    <StatCard
                                        title="Total"
                                        value={stats?.total || 0}
                                        icon={<PersonIcon fontSize="large" />}
                                        color="primary"
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Paper>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Learner</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Remarks</TableCell>
                                        <TableCell>Quick Actions</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {learners?.map((item) => (
                                        <TableRow key={item.learner.learner_id} hover>
                                            <TableCell>
                                                <Box display="flex" alignItems="center">
                                                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                                        {item.learner.learner_firstName?.charAt(0)}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="subtitle1" fontWeight="bold">
                                                            {item.learner.learner_firstName} {item.learner.learner_lastName}
                                                        </Typography>
                                                        <Typography variant="body2" color="textSecondary">
                                                            ID: {item.learner.learner_id}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    icon={getStatusIcon(item.status)}
                                                    label={item.status || 'Not Marked'}
                                                    color={getStatusColor(item.status)}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {item.remarks || '-'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Box display="flex" gap={1}>
                                                    <Button
                                                        size="small"
                                                        variant={item.status === 'Present' ? 'contained' : 'outlined'}
                                                        color="success"
                                                        onClick={() => handleMarkAttendance(item.learner, 'Present')}
                                                    >
                                                        Present
                                                    </Button>
                                                    <Button
                                                        size="small"
                                                        variant={item.status === 'Absent' ? 'contained' : 'outlined'}
                                                        color="error"
                                                        onClick={() => handleMarkAttendance(item.learner, 'Absent')}
                                                    >
                                                        Absent
                                                    </Button>
                                                    <Button
                                                        size="small"
                                                        variant={item.status === 'Excused' ? 'contained' : 'outlined'}
                                                        color="info"
                                                        onClick={() => handleMarkAttendance(item.learner, 'Excused')}
                                                    >
                                                        Excused
                                                    </Button>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => handleEditAttendance(item)}
                                                    title="Edit Attendance"
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                    {/* Attendance Records View */}
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Start Date"
                                value={startDate}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                type="date"
                                label="End Date"
                                value={endDate}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Button
                                fullWidth
                                variant="contained"
                                sx={{ height: 56 }}
                                onClick={() => {
                                    router.get(route('cai.attendance'), {
                                        view: 'records',
                                        start_date: startDate,
                                        end_date: endDate
                                    });
                                }}
                            >
                                Filter Records
                            </Button>
                        </Grid>
                    </Grid>

                    <Paper>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Learner</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Remarks</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {attendanceRecords?.data?.map((record) => (
                                        <TableRow key={`${record.learner_id}-${record.attendance_date}`} hover>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight="bold">
                                                    {new Date(record.attendance_date).toLocaleDateString()}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Box display="flex" alignItems="center">
                                                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                                        {record.learner?.fullname?.charAt(0) || 'L'}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="subtitle2" fontWeight="bold">
                                                            {record.learner?.fullname || 'Unknown Learner'}
                                                        </Typography>
                                                        <Typography variant="caption" color="textSecondary">
                                                            ID: {record.learner?.learner_re_no || record.learner?.learner_id}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={record.status}
                                                    color={getStatusColor(record.status)}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {record.remarks || '-'}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        
                        {attendanceRecords?.last_page > 1 && (
                            <Box display="flex" justifyContent="center" p={2}>
                                <Pagination
                                    count={attendanceRecords.last_page}
                                    page={attendanceRecords.current_page}
                                    onChange={(event, page) => {
                                        router.get(route('cai.attendance'), {
                                            view: 'records',
                                            start_date: startDate,
                                            end_date: endDate,
                                            page: page
                                        });
                                    }}
                                    color="primary"
                                />
                            </Box>
                        )}
                    </Paper>
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                    {/* Attendance Reports View */}
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                type="month"
                                label="Select Month"
                                value={selectedMonth}
                                InputLabelProps={{ shrink: true }}
                                onChange={(e) => {
                                    router.get(route('cai.attendance'), {
                                        view: 'reports',
                                        month: e.target.value
                                    });
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Grid container spacing={2}>
                                <Grid item xs={6} md={3}>
                                    <StatCard
                                        title="Total Learners"
                                        value={monthlyStats?.totalLearners || 0}
                                        icon={<PersonIcon fontSize="large" />}
                                        color="primary"
                                    />
                                </Grid>
                                <Grid item xs={6} md={3}>
                                    <StatCard
                                        title="Avg Attendance"
                                        value={`${Math.round(monthlyStats?.averageAttendanceRate || 0)}%`}
                                        icon={<TrendingUpIcon fontSize="large" />}
                                        color="info"
                                    />
                                </Grid>
                                <Grid item xs={6} md={3}>
                                    <StatCard
                                        title="High Attendance"
                                        value={monthlyStats?.highAttendance || 0}
                                        icon={<SchoolIcon fontSize="large" />}
                                        color="success"
                                        subtitle="≥90%"
                                    />
                                </Grid>
                                <Grid item xs={6} md={3}>
                                    <StatCard
                                        title="Low Attendance"
                                        value={monthlyStats?.lowAttendance || 0}
                                        icon={<WarningIcon fontSize="large" />}
                                        color="error"
                                        subtitle="<70%"
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Paper>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Learner</TableCell>
                                        <TableCell>Total Days</TableCell>
                                        <TableCell>Present Days</TableCell>
                                        <TableCell>Attendance Rate</TableCell>
                                        <TableCell>Performance</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {learnerReports?.map((report) => {
                                        const rateInfo = getAttendanceRate(report.attendanceRate);
                                        return (
                                            <TableRow key={report.learner.learner_id} hover>
                                                <TableCell>
                                                    <Box display="flex" alignItems="center">
                                                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                                            {report.learner.learner_firstName?.charAt(0)}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="subtitle1" fontWeight="bold">
                                                                {report.learner.learner_firstName} {report.learner.learner_lastName}
                                                            </Typography>
                                                            <Typography variant="body2" color="textSecondary">
                                                                ID: {report.learner.learner_id}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight="bold">
                                                        {report.totalDays}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight="bold">
                                                        {report.presentDays}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ minWidth: 120 }}>
                                                        <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.5}>
                                                            <Typography variant="body2" fontWeight="bold">
                                                                {report.attendanceRate}%
                                                            </Typography>
                                                        </Box>
                                                        <LinearProgress
                                                            variant="determinate"
                                                            value={report.attendanceRate}
                                                            color={rateInfo.color}
                                                            sx={{ height: 8, borderRadius: 4 }}
                                                        />
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={rateInfo.label}
                                                        color={rateInfo.color}
                                                        size="small"
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </TabPanel>

                {/* Edit Attendance Dialog */}
                <Dialog open={!!editingLearner} onClose={() => setEditingLearner(null)} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        Edit Attendance - {editingLearner?.learner_firstName} {editingLearner?.learner_lastName}
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{ pt: 2 }}>
                            <FormControl fullWidth sx={{ mb: 3 }}>
                                <InputLabel>Attendance Status</InputLabel>
                                <Select
                                    value={attendanceData.attendance_status}
                                    label="Attendance Status"
                                    onChange={(e) => setAttendanceData({ ...attendanceData, attendance_status: e.target.value })}
                                >
                                    <MenuItem value="Present">Present</MenuItem>
                                    <MenuItem value="Absent">Absent</MenuItem>
                                    <MenuItem value="Late">Late</MenuItem>
                                    <MenuItem value="Excused">Excused</MenuItem>
                                </Select>
                            </FormControl>
                            
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Remarks (Optional)"
                                value={attendanceData.attendance_remarks}
                                onChange={(e) => setAttendanceData({ ...attendanceData, attendance_remarks: e.target.value })}
                                placeholder="Add any additional notes about this attendance record..."
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => setEditingLearner(null)}
                            startIcon={<CancelIcon />}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSaveAttendance}
                            variant="contained"
                            startIcon={<SaveIcon />}
                        >
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </CaiLayout>
    );
}
