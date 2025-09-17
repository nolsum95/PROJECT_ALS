import React from 'react';
import { Head, Link } from '@inertiajs/react';
import CaiLayout from '@/Layouts/CaiLayout';
import '../../../css/dashboard.css';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Avatar,
    Paper,
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Toolbar,
    Stack,
    IconButton
} from '@mui/material';
import {
    Person as PersonIcon,
    School as SchoolIcon,
    Assignment as AssignmentIcon,
    Today as TodayIcon,
    Business as BusinessIcon,
    TrendingUp as TrendingUpIcon,
    CheckCircle as CheckCircleIcon,
    EventAvailable as EventAvailableIcon,
    Visibility as VisibilityIcon,
    Edit as EditIcon
} from '@mui/icons-material';

import '../../../css/adminTables.css';

const StatCard = ({ title, value, icon, color = 'primary', subtitle, onClick }) => (
    <Card 
        sx={{ 
            height: '100%', 
            cursor: onClick ? 'pointer' : 'default', 
            '&:hover': onClick ? { boxShadow: 4 } : {} 
        }}
        onClick={onClick}
    >
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

export default function Dashboard({ auth, cai, stats, error, recentLearners = [], recentModules = [], recentAttendance = [] }) {
    if (error) {
        return (
            <CaiLayout
                auth={auth}
                title="CAI Dashboard"
                selectedSection="dashboard"
            >
                <Head title="CAI - Dashboard" />
                <div className="dashboard-content">
                    <Typography variant="h6" color="error">
                        {error}
                    </Typography>
                </div>
            </CaiLayout>
        );
    }

    return (
        <CaiLayout
            auth={auth}
            title="CAI Dashboard"
            selectedSection="dashboard"
        >
            <Head title="CAI - Dashboard" />

            <div className="dashboard-content">
                {/* Statistics Grid - Admin Style */}
                <div className="stats-grid">
                    <div className="stat-card" style={{ 
                       
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                       
                    }}>
                        <div>
                            <div className="stat-title" style={{ fontSize: '14px', fontWeight: '600', color: '#d1d5db', marginBottom: '8px' }}>
                                TOTAL LEARNERS
                            </div>
                            <div className="stat-number" style={{ fontSize: '32px', fontWeight: 'bold', color: '#ffffff' }}>
                                {stats?.directlyAssignedLearners || 0}
                            </div>
                            <div className="stat-subtitle" style={{ fontSize: '12px', color: '#9ca3af' }}>
                                Assigned to me
                            </div>
                        </div>
                        <div style={{ width: '2px', height: '60px', backgroundColor: '#6b7280', margin: '0 20px' }}></div>
                        <div>
                            <div className="stat-title" style={{ fontSize: '14px', fontWeight: '600', color: '#d1d5db', marginBottom: '8px' }}>
                                TOTAL UNDER CLC
                            </div>
                            <div className="stat-number" style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6' }}>
                                {stats?.clcLearners || 0}
                            </div>
                            <div className="stat-subtitle" style={{ fontSize: '12px', color: '#9ca3af' }}>
                                In my learning center
                            </div>
                        </div>
                    </div>
                    
                    <div className="stat-card">
                        <div className="stat-title">CLCs Handled</div>
                        <div className="stat-number">{stats?.clcsHandled || 1}</div>
                        <div className="stat-subtitle">Learning centers</div>
                    </div>
                    
                    <div className="stat-card">
                        <div className="stat-title">Learning Materials</div>
                        <div className="stat-number">{stats?.modulesCreated || 0}</div>
                        <div className="stat-subtitle">Uploaded content</div>
                    </div>
                    
                    <div className="stat-card">
                        <div className="stat-title">Attendance Today</div>
                        <div className="stat-number">{stats?.attendanceToday || 0}</div>
                        <div className="stat-subtitle">Present learners</div>
                    </div>
                </div>

            </div>
        </CaiLayout>
    );
}
