import React, { useState } from 'react';
import CaiLayout from '../../Layouts/CaiLayout';
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
  LinearProgress,
  Avatar,
  Tabs,
  Tab,
  Paper
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  Person as PersonIcon,
  EventAvailable as EventAvailableIcon,
  MenuBook as MenuBookIcon,
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon
} from '@mui/icons-material';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`report-tabpanel-${index}`}
      aria-labelledby={`report-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function CaiReports({ auth, cai, attendanceReport, moduleReport, performanceReport }) {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'info';
    if (percentage >= 40) return 'warning';
    return 'error';
  };

  const getAttendanceColor = (count, total) => {
    if (total === 0) return 'default';
    const percentage = (count / total) * 100;
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'warning';
    return 'error';
  };

  return (
    <CaiLayout user={auth?.user} selectedSection="reports">
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Reports & Analytics
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          Comprehensive reports on learner performance and progress
        </Typography>

        {/* Report Tabs */}
        <Card sx={{ mb: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="report tabs">
              <Tab label="Attendance Report" />
              <Tab label="Module Progress" />
              <Tab label="Learner Performance" />
            </Tabs>
          </Box>

          {/* Attendance Report Tab */}
          <TabPanel value={tabValue} index={0}>
            <Typography variant="h6" gutterBottom>
              Attendance Trends (Last 30 Days)
            </Typography>
            
            {attendanceReport && attendanceReport.length > 0 ? (
              <>
                {/* Attendance Chart Area */}
                <Card sx={{ mb: 3, p: 2 }}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Daily Attendance Overview
                  </Typography>
                  <Box sx={{ height: 200, display: 'flex', alignItems: 'end', gap: 1 }}>
                    {attendanceReport.slice(-14).map((day, index) => {
                      const percentage = day.total > 0 ? (day.present / day.total) * 100 : 0;
                      return (
                        <Box key={index} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <Box
                            sx={{
                              width: '100%',
                              height: `${Math.max(percentage, 5)}%`,
                              bgcolor: percentage >= 80 ? 'success.main' : percentage >= 60 ? 'warning.main' : 'error.main',
                              borderRadius: 1,
                              mb: 1
                            }}
                          />
                          <Typography variant="caption" sx={{ transform: 'rotate(-45deg)', fontSize: '10px' }}>
                            {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </Card>

                {/* Attendance Summary */}
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Card>
                      <CardContent>
                        <Typography color="textSecondary" gutterBottom variant="body2">
                          Average Daily Attendance
                        </Typography>
                        <Typography variant="h4" color="primary">
                          {Math.round(attendanceReport.reduce((sum, day) => 
                            sum + (day.total > 0 ? (day.present / day.total) * 100 : 0), 0
                          ) / attendanceReport.length)}%
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card>
                      <CardContent>
                        <Typography color="textSecondary" gutterBottom variant="body2">
                          Best Attendance Day
                        </Typography>
                        <Typography variant="h4" color="success">
                          {Math.max(...attendanceReport.map(day => 
                            day.total > 0 ? Math.round((day.present / day.total) * 100) : 0
                          ))}%
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card>
                      <CardContent>
                        <Typography color="textSecondary" gutterBottom variant="body2">
                          Total Present Days
                        </Typography>
                        <Typography variant="h4" color="info">
                          {attendanceReport.reduce((sum, day) => sum + day.present, 0)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </>
            ) : (
              <Box textAlign="center" py={4}>
                <EventAvailableIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="textSecondary">
                  No attendance data available
                </Typography>
              </Box>
            )}
          </TabPanel>

          {/* Module Progress Tab */}
          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" gutterBottom>
              Module Completion Progress
            </Typography>
            
            {moduleReport && moduleReport.length > 0 ? (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Module</TableCell>
                      <TableCell>Completed</TableCell>
                      <TableCell>Progress</TableCell>
                      <TableCell>Completion Rate</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {moduleReport.map((item, index) => (
                      <TableRow key={index} hover>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                              <MenuBookIcon />
                            </Avatar>
                            <Typography variant="subtitle1">
                              {item.module.subject}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {item.completed} / {item.total} learners
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ minWidth: 120 }}>
                            <LinearProgress
                              variant="determinate"
                              value={item.percentage}
                              color={getProgressColor(item.percentage)}
                              sx={{ mb: 1 }}
                            />
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${item.percentage}%`}
                            color={getProgressColor(item.percentage)}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box textAlign="center" py={4}>
                <MenuBookIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="textSecondary">
                  No module data available
                </Typography>
              </Box>
            )}
          </TabPanel>

          {/* Learner Performance Tab */}
          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" gutterBottom>
              Individual Learner Performance
            </Typography>
            
            {performanceReport && performanceReport.length > 0 ? (
              <>
                {/* Performance Summary Cards */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid item xs={12} md={3}>
                    <Card>
                      <CardContent>
                        <Typography color="textSecondary" gutterBottom variant="body2">
                          Top Performers
                        </Typography>
                        <Typography variant="h4" color="success">
                          {performanceReport.filter(p => p.progress >= 80).length}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Card>
                      <CardContent>
                        <Typography color="textSecondary" gutterBottom variant="body2">
                          Average Progress
                        </Typography>
                        <Typography variant="h4" color="info">
                          {Math.round(performanceReport.reduce((sum, p) => sum + p.progress, 0) / performanceReport.length)}%
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Card>
                      <CardContent>
                        <Typography color="textSecondary" gutterBottom variant="body2">
                          Need Support
                        </Typography>
                        <Typography variant="h4" color="warning">
                          {performanceReport.filter(p => p.progress < 40).length}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Card>
                      <CardContent>
                        <Typography color="textSecondary" gutterBottom variant="body2">
                          Total Learners
                        </Typography>
                        <Typography variant="h4" color="primary">
                          {performanceReport.length}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* Detailed Performance Table */}
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Learner</TableCell>
                        <TableCell>Modules Completed</TableCell>
                        <TableCell>Progress</TableCell>
                        <TableCell>Monthly Attendance</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {performanceReport
                        .sort((a, b) => b.progress - a.progress)
                        .map((item, index) => (
                        <TableRow key={index} hover>
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                <PersonIcon />
                              </Avatar>
                              <Box>
                                <Typography variant="subtitle1">
                                  {item.learner.fullname}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                  ID: {item.learner.learner_re_no || item.learner.learner_id}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <SchoolIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                              <Typography variant="body2">
                                {item.completedModules} modules
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ minWidth: 120 }}>
                              <Box display="flex" justifyContent="space-between" mb={0.5}>
                                <Typography variant="body2">
                                  {item.progress}%
                                </Typography>
                              </Box>
                              <LinearProgress
                                variant="determinate"
                                value={item.progress}
                                color={getProgressColor(item.progress)}
                              />
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <EventAvailableIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                              <Typography variant="body2">
                                {item.monthlyAttendance} days ({item.attendancePercentage}%)
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={
                                item.progress >= 80 ? 'Excellent' :
                                item.progress >= 60 ? 'Good' :
                                item.progress >= 40 ? 'Fair' : 'Needs Support'
                              }
                              color={getProgressColor(item.progress)}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            ) : (
              <Box textAlign="center" py={4}>
                <PersonIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="textSecondary">
                  No learner performance data available
                </Typography>
              </Box>
            )}
          </TabPanel>
        </Card>

        {/* Quick Insights */}
        {(attendanceReport || moduleReport || performanceReport) && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Insights
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      📊 Class Performance Summary
                    </Typography>
                    <Typography variant="body1">
                      {performanceReport && performanceReport.length > 0 ? (
                        `Your class has an average progress of ${Math.round(
                          performanceReport.reduce((sum, p) => sum + p.progress, 0) / performanceReport.length
                        )}% with ${performanceReport.filter(p => p.progress >= 80).length} top performers.`
                      ) : (
                        'No performance data available yet.'
                      )}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      📈 Attendance Insights
                    </Typography>
                    <Typography variant="body1">
                      {attendanceReport && attendanceReport.length > 0 ? (
                        `Average daily attendance is ${Math.round(
                          attendanceReport.reduce((sum, day) => 
                            sum + (day.total > 0 ? (day.present / day.total) * 100 : 0), 0
                          ) / attendanceReport.length
                        )}% over the last 30 days.`
                      ) : (
                        'No attendance data available yet.'
                      )}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
      </Box>
    </CaiLayout>
  );
}
