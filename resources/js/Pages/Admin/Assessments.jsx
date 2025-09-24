import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Divider
} from '@mui/material';
import { 
  CloudUpload as CloudUploadIcon, 
  Description as DescriptionIcon,
  Quiz as QuizIcon,
  School as SchoolIcon,
  Visibility as VisibilityIcon,
  PictureAsPdf as PdfIcon,
  Close as CloseIcon
} from '@mui/icons-material';

export default function Assessments({ auth, clcs = [], assessments = [], reviewerMaterials = [], clcsWithStats = [], stats = {} }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assessment_type: 'pretest',
    schedule_date: '',
    clc_id: '',
    file: null,
  });
  
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.file) {
      setError('Please select a file to upload.');
      return;
    }
    if (!formData.clc_id) {
      setError('Please select a CLC.');
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => {
      if (v !== null && v !== undefined) data.append(k, v);
    });

    router.post(route('admin.assessments.store'), data, {
      forceFormData: true,
      onSuccess: () => {
        setSuccess('Assessment uploaded successfully.');
        setFormData({ title: '', description: '', assessment_type: 'pretest', schedule_date: '', clc_id: '', file: null });
      },
      onError: (errs) => {
        setError('Failed to upload assessment. Please check inputs.');
      }
    });
  };


  return (
    <AdminLayout auth={auth} selectedSection="assessments" title="Assessments">
      <Head title="Admin - Assessments" />

      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>Exam Management</Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Upload and manage pretest and posttest exam files for CLCs. Monitor CAI-created classworks and questionnaires.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>Upload Exam File</Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                  <TextField
                    fullWidth
                    label="Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    sx={{ mb: 2 }}
                  />
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Type</InputLabel>
                    <Select
                      label="Type"
                      value={formData.assessment_type}
                      onChange={(e) => setFormData({ ...formData, assessment_type: e.target.value })}
                    >
                      <MenuItem value="pretest">Pretest</MenuItem>
                      <MenuItem value="posttest">Posttest</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    type="datetime-local"
                    label="Schedule Date"
                    InputLabelProps={{ shrink: true }}
                    value={formData.schedule_date}
                    onChange={(e) => setFormData({ ...formData, schedule_date: e.target.value })}
                    sx={{ mb: 2 }}
                  />
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>CLC</InputLabel>
                    <Select
                      label="CLC"
                      value={formData.clc_id}
                      onChange={(e) => setFormData({ ...formData, clc_id: e.target.value })}
                    >
                      {clcs.map((c) => (
                        <MenuItem key={c.clc_id} value={c.clc_id}>{c.clc_name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    sx={{ mb: 2 }}
                  >
                    Choose File
                    <input type="file" hidden onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })} />
                  </Button>
                  <Typography variant="caption" display="block" sx={{ mb: 2 }}>
                    {formData.file ? formData.file.name : 'No file selected'}
                  </Typography>
                  <Button type="submit" variant="contained">Upload</Button>
                </Box>
              </CardContent>
            </Card>
            
          </Grid>
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Recent Assessments</Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>CLC</TableCell>
                    <TableCell>Schedule</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>File</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assessments.length === 0 ? (
                    <TableRow><TableCell colSpan={6} align="center">No assessments yet.</TableCell></TableRow>
                  ) : assessments.map((a) => (
                    <TableRow key={a.assessment_id}>
                      <TableCell>{a.title}</TableCell>
                      <TableCell>{a.assessment_type}</TableCell>
                      <TableCell>{a.clc?.clc_name || a.clc_id}</TableCell>
                      <TableCell>{a.schedule_date ? new Date(a.schedule_date).toLocaleString() : '-'}</TableCell>
                      <TableCell>{a.status}</TableCell>
                      <TableCell>
                        <Button
                          href={a.file_path ? `/storage/${a.file_path}` : '#'}
                          target="_blank"
                          startIcon={<DescriptionIcon />}
                          disabled={!a.file_path}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
            
          </Grid>
          
        </Grid>
        
      </Box>
    </AdminLayout>
  );
}
