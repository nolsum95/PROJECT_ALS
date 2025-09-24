import React, { useState } from 'react';
import LearnerLayout from '@/Layouts/LearnerLayout';
import { Head, router } from '@inertiajs/react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Divider
} from '@mui/material';
import {
  Description as DescriptionIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Email as EmailIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
  CalendarToday as CalendarIcon,
  Visibility as VisibilityIcon,
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
  Share as ShareIcon
} from '@mui/material';

export default function Reports({ 
  auth, 
  learner = {}, 
  availableReports = [],
  reportHistory = [],
  flash = {}
}) {
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [reportRequest, setReportRequest] = useState({
    type: '',
    period: '',
    format: 'pdf',
    email: auth.user?.email_address || ''
  });

  // Mock data for available reports
  const mockAvailableReports = availableReports.length > 0 ? availableReports : [
    {
      id: 1,
      title: 'Academic Progress Report',
      description: 'Comprehensive overview of your academic performance including exam scores, reviewer completion, and overall progress',
      type: 'academic',
      icon: <AssessmentIcon />,
      available: true,
      last_generated: '2025-01-10',
      file_size: '2.3 MB'
    },
    {
      id: 2,
      title: 'Attendance Report',
      description: 'Detailed attendance record showing present/absent days, attendance rate, and patterns',
      type: 'attendance',
      icon: <CalendarIcon />,
      available: true,
      last_generated: '2025-01-10',
      file_size: '1.1 MB'
    },
    {
      id: 3,
      title: 'Exam Results Summary',
      description: 'Summary of all exam results including pretest/posttest scores and improvement tracking',
      type: 'exams',
      icon: <TrendingUpIcon />,
      available: true,
      last_generated: '2025-01-08',
      file_size: '1.8 MB'
    },
    {
      id: 4,
      title: 'Study Materials Progress',
      description: 'Progress report on reviewer completion, study time, and module downloads',
      type: 'study',
      icon: <SchoolIcon />,
      available: true,
      last_generated: '2025-01-09',
      file_size: '1.5 MB'
    },
    {
      id: 5,
      title: 'Comprehensive Learner Portfolio',
      description: 'Complete learner portfolio including all academic records, achievements, and certifications',
      type: 'portfolio',
      icon: <DescriptionIcon />,
      available: false,
      last_generated: null,
      file_size: null
    }
  ];

  const mockReportHistory = reportHistory.length > 0 ? reportHistory : [
    {
      id: 1,
      title: 'Academic Progress Report - December 2024',
      type: 'academic',
      generated_date: '2025-01-10T10:30:00',
      format: 'PDF',
      file_size: '2.3 MB',
      status: 'ready',
      download_count: 3
    },
    {
      id: 2,
      title: 'Attendance Report - Q4 2024',
      type: 'attendance',
      generated_date: '2025-01-10T14:15:00',
      format: 'PDF',
      file_size: '1.1 MB',
      status: 'ready',
      download_count: 1
    },
    {
      id: 3,
      title: 'Exam Results Summary - December 2024',
      type: 'exams',
      generated_date: '2025-01-08T16:45:00',
      format: 'Excel',
      file_size: '890 KB',
      status: 'ready',
      download_count: 2
    },
    {
      id: 4,
      title: 'Monthly Progress Report - November 2024',
      type: 'academic',
      generated_date: '2024-12-01T09:00:00',
      format: 'PDF',
      file_size: '2.1 MB',
      status: 'expired',
      download_count: 5
    }
  ];

  const reportTypes = [
    { value: 'academic', label: 'Academic Progress Report' },
    { value: 'attendance', label: 'Attendance Report' },
    { value: 'exams', label: 'Exam Results Summary' },
    { value: 'study', label: 'Study Materials Progress' },
    { value: 'portfolio', label: 'Complete Portfolio' }
  ];

  const reportPeriods = [
    { value: 'current_month', label: 'Current Month' },
    { value: 'last_month', label: 'Last Month' },
    { value: 'quarter', label: 'Current Quarter' },
    { value: 'semester', label: 'Current Semester' },
    { value: 'year', label: 'Academic Year' },
    { value: 'custom', label: 'Custom Period' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'ready': return 'success';
      case 'processing': return 'warning';
      case 'expired': return 'error';
      default: return 'default';
    }
  };

  const getFormatIcon = (format) => {
    switch (format.toLowerCase()) {
      case 'pdf': return <PdfIcon color="error" />;
      case 'excel': return <ExcelIcon color="success" />;
      default: return <DescriptionIcon />;
    }
  };

  const handleDownloadReport = (reportId) => {
    router.visit(route('learner.reports.download', reportId));
  };

  const handleViewReport = (reportId) => {
    router.visit(route('learner.reports.view', reportId));
  };

  const handleRequestReport = () => {
    router.post(route('learner.reports.request'), reportRequest, {
      onSuccess: () => {
        setShowRequestDialog(false);
        setReportRequest({ type: '', period: '', format: 'pdf', email: auth.user?.email_address || '' });
      },
      onError: (errors) => {
        console.error('Report request failed:', errors);
      }
    });
  };

  const handleEmailReport = (reportId) => {
    router.post(route('learner.reports.email', reportId), {
      email: auth.user?.email_address
    });
  };

  const handlePrintReport = (reportId) => {
    window.open(route('learner.reports.print', reportId), '_blank');
  };

  return (
    <LearnerLayout auth={auth} selectedSection="reports" title="Reports">
      <Head title="Reports" />

      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
          My Reports
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Download and manage your academic progress reports
        </Typography>
      </Box>

      {flash.success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {flash.success}
        </Alert>
      )}

      {flash.error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {flash.error}
        </Alert>
      )}

      {/* Quick Actions */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Quick Actions</Typography>
            <Button
              variant="contained"
              startIcon={<DescriptionIcon />}
              onClick={() => setShowRequestDialog(true)}
            >
              Request New Report
            </Button>
          </Box>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<AssessmentIcon />}
                onClick={() => handleDownloadReport('latest-academic')}
              >
                Latest Academic Report
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<CalendarIcon />}
                onClick={() => handleDownloadReport('latest-attendance')}
              >
                Attendance Report
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<TrendingUpIcon />}
                onClick={() => handleDownloadReport('latest-progress')}
              >
                Progress Summary
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<DescriptionIcon />}
                onClick={() => handleDownloadReport('portfolio')}
              >
                Complete Portfolio
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Available Reports */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Available Reports
              </Typography>
              
              <List>
                {mockAvailableReports.map((report, index) => (
                  <React.Fragment key={report.id}>
                    <ListItem
                      sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        mb: 2,
                        opacity: report.available ? 1 : 0.6
                      }}
                    >
                      <ListItemIcon>
                        {report.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {report.title}
                            </Typography>
                            <Chip
                              label={report.available ? 'Available' : 'Coming Soon'}
                              color={report.available ? 'success' : 'default'}
                              size="small"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {report.description}
                            </Typography>
                            {report.available && (
                              <Typography variant="caption" color="text.secondary">
                                Last generated: {new Date(report.last_generated).toLocaleDateString()} • 
                                Size: {report.file_size}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        {report.available ? (
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton
                              color="primary"
                              onClick={() => handleViewReport(report.id)}
                              title="View Report"
                            >
                              <VisibilityIcon />
                            </IconButton>
                            <IconButton
                              color="success"
                              onClick={() => handleDownloadReport(report.id)}
                              title="Download Report"
                            >
                              <DownloadIcon />
                            </IconButton>
                            <IconButton
                              color="info"
                              onClick={() => handleEmailReport(report.id)}
                              title="Email Report"
                            >
                              <EmailIcon />
                            </IconButton>
                          </Box>
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            Not Available
                          </Typography>
                        )}
                      </ListItemSecondaryAction>
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Report History */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Report History
              </Typography>
              
              <List>
                {mockReportHistory.map((report) => (
                  <ListItem key={report.id} sx={{ px: 0, py: 1 }}>
                    <ListItemIcon>
                      {getFormatIcon(report.format)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" sx={{ fontSize: '0.9rem' }}>
                          {report.title}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="caption" color="text.secondary" display="block">
                            {new Date(report.generated_date).toLocaleDateString()}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block">
                            {report.file_size} • Downloaded {report.download_count}x
                          </Typography>
                          <Chip
                            label={report.status.toUpperCase()}
                            color={getStatusColor(report.status)}
                            size="small"
                            sx={{ mt: 0.5 }}
                          />
                        </Box>
                      }
                    />
                    {report.status === 'ready' && (
                      <ListItemSecondaryAction>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleDownloadReport(report.id)}
                        >
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                      </ListItemSecondaryAction>
                    )}
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Report Information */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Report Information
              </Typography>
              
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  Reports are automatically generated weekly and are available for download for 30 days.
                </Typography>
              </Alert>
              
              <List dense>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="Report Formats"
                    secondary="PDF for viewing, Excel for data analysis"
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="Availability"
                    secondary="Reports expire after 30 days"
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="Custom Reports"
                    secondary="Request specific periods or subjects"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Request Report Dialog */}
      <Dialog open={showRequestDialog} onClose={() => setShowRequestDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Request Custom Report</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Report Type</InputLabel>
              <Select
                value={reportRequest.type}
                label="Report Type"
                onChange={(e) => setReportRequest(prev => ({ ...prev, type: e.target.value }))}
              >
                {reportTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Time Period</InputLabel>
              <Select
                value={reportRequest.period}
                label="Time Period"
                onChange={(e) => setReportRequest(prev => ({ ...prev, period: e.target.value }))}
              >
                {reportPeriods.map((period) => (
                  <MenuItem key={period.value} value={period.value}>
                    {period.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Format</InputLabel>
              <Select
                value={reportRequest.format}
                label="Format"
                onChange={(e) => setReportRequest(prev => ({ ...prev, format: e.target.value }))}
              >
                <MenuItem value="pdf">PDF Document</MenuItem>
                <MenuItem value="excel">Excel Spreadsheet</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={reportRequest.email}
              onChange={(e) => setReportRequest(prev => ({ ...prev, email: e.target.value }))}
              helperText="Report will be sent to this email address when ready"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRequestDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleRequestReport} 
            variant="contained"
            disabled={!reportRequest.type || !reportRequest.period}
          >
            Request Report
          </Button>
        </DialogActions>
      </Dialog>
    </LearnerLayout>
  );
}
