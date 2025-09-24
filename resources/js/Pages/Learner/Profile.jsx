import React, { useState } from 'react';
import LearnerLayout from '@/Layouts/LearnerLayout';
import { Head, router } from '@inertiajs/react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  TextField,
  Button,
  Divider,
  Alert,
  Paper,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  School as SchoolIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Security as SecurityIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';

export default function LearnerProfile({ 
  auth, 
  learner = {}, 
  enrollment = {},
  flash = {} 
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    // Contact Information (editable)
    mobile_no: enrollment?.mobile_no || '',
    email_address: auth.user?.email_address || '',
    // Address Information (editable)
    cur_house_no: enrollment?.cur_house_no || '',
    cur_streetname: enrollment?.cur_streetname || '',
    cur_barangay: enrollment?.cur_barangay || '',
    cur_municipality: enrollment?.cur_municipality || '',
    cur_province: enrollment?.cur_province || '',
    cur_zip_code: enrollment?.cur_zip_code || '',
  });
  
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    router.put(route('learner.profile.update'), formData, {
      onSuccess: () => {
        setIsEditing(false);
      },
      onError: (errors) => {
        console.error('Update failed:', errors);
      }
    });
  };

  const handlePasswordChange = () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      alert('New passwords do not match');
      return;
    }
    
    router.put(route('learner.password.update'), passwordData, {
      onSuccess: () => {
        setShowPasswordDialog(false);
        setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
      },
      onError: (errors) => {
        console.error('Password update failed:', errors);
      }
    });
  };

  // Profile data with proper null checks and consistent defaults
  const profileData = {
    learner_ref_no: learner?.learner_ref_no || 'ALS-2025-001',
    fullname: learner?.fullname || auth?.user?.name || 'Juan Dela Cruz',
    firstname: enrollment?.firstname || 'Juan',
    middlename: enrollment?.middlename || 'Santos',
    lastname: enrollment?.lastname || 'Dela Cruz',
    birthdate: enrollment?.birthdate || '1990-05-15',
    gender: enrollment?.gender || 'Male',
    civil_status: enrollment?.civil_status || 'Single',
    religion: enrollment?.religion || 'Catholic',
    mother_tongue: enrollment?.mother_tongue || 'Tagalog',
    clc_name: learner?.clc?.clc_name || 'Poblacion Community Learning Center',
    cai_name: `${learner?.cai?.firstname || 'Maria'} ${learner?.cai?.lastname || 'Santos'}`,
    status: learner?.status || 'Active',
    date_enrolled: enrollment?.date_enrolled || '2025-01-01'
  };

  return (
    <LearnerLayout auth={auth} selectedSection="profile" title="My Profile">
      <Head title="My Profile" />

      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
          My Profile
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and update your personal information
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

      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <Grid container spacing={3}>
          {/* Profile Overview Card */}
          <Grid item xs={12} md={4}>
          <Card sx={{ textAlign: 'center', p: 3 }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                mx: 'auto',
                mb: 2,
                bgcolor: 'primary.main',
                fontSize: '3rem'
              }}
            >
              {profileData.firstname?.charAt(0) || 'J'}{profileData.lastname?.charAt(0) || 'D'}
            </Avatar>
            
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
              {profileData.fullname}
            </Typography>
            
            <Chip
              label={profileData.learner_ref_no}
              color="primary"
              sx={{ mb: 2 }}
            />
            
            <Divider sx={{ my: 2 }} />
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <SchoolIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="CLC"
                  secondary={profileData.clc_name}
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <PersonIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="CAI"
                  secondary={profileData.cai_name}
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <SecurityIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Status"
                  secondary={
                    <Chip 
                      label={profileData.status} 
                      color="success" 
                      size="small"
                    />
                  }
                />
              </ListItem>
            </List>
            
            <Button
              fullWidth
              variant="outlined"
              startIcon={<SecurityIcon />}
              onClick={() => setShowPasswordDialog(true)}
              sx={{ mt: 2 }}
            >
              Change Password
            </Button>
          </Card>
        </Grid>

        {/* Personal Information */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Personal Information</Typography>
                {!isEditing ? (
                  <Button
                    startIcon={<EditIcon />}
                    onClick={() => setIsEditing(true)}
                    variant="outlined"
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      startIcon={<SaveIcon />}
                      onClick={handleSave}
                      variant="contained"
                      color="primary"
                    >
                      Save
                    </Button>
                    <Button
                      startIcon={<CancelIcon />}
                      onClick={() => setIsEditing(false)}
                      variant="outlined"
                    >
                      Cancel
                    </Button>
                  </Box>
                )}
              </Box>

              <Grid container spacing={2}>
                {/* Read-only Personal Details */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'primary.main' }}>
                    Basic Information (Read-only)
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={profileData.firstname}
                    disabled
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Middle Name"
                    value={profileData.middlename}
                    disabled
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={profileData.lastname}
                    disabled
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Birthdate"
                    value={profileData.birthdate}
                    disabled
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Gender"
                    value={profileData.gender}
                    disabled
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Civil Status"
                    value={profileData.civil_status}
                    disabled
                    variant="outlined"
                    size="small"
                  />
                </Grid>

                {/* Two Column Layout for Editable Information */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>
                
                {/* Left Column - Contact Information */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'success.main' }}>
                    Contact Information (Editable)
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Mobile Number"
                        value={formData.mobile_no}
                        onChange={(e) => handleInputChange('mobile_no', e.target.value)}
                        disabled={!isEditing}
                        variant="outlined"
                        size="small"
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        value={formData.email_address}
                        onChange={(e) => handleInputChange('email_address', e.target.value)}
                        disabled={!isEditing}
                        variant="outlined"
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </Grid>

                {/* Right Column - Address Information */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'success.main' }}>
                    Current Address (Editable)
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="House Number"
                        value={formData.cur_house_no}
                        onChange={(e) => handleInputChange('cur_house_no', e.target.value)}
                        disabled={!isEditing}
                        variant="outlined"
                        size="small"
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Street Name"
                        value={formData.cur_streetname}
                        onChange={(e) => handleInputChange('cur_streetname', e.target.value)}
                        disabled={!isEditing}
                        variant="outlined"
                        size="small"
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Barangay"
                        value={formData.cur_barangay}
                        onChange={(e) => handleInputChange('cur_barangay', e.target.value)}
                        disabled={!isEditing}
                        variant="outlined"
                        size="small"
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Municipality"
                        value={formData.cur_municipality}
                        onChange={(e) => handleInputChange('cur_municipality', e.target.value)}
                        disabled={!isEditing}
                        variant="outlined"
                        size="small"
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Province"
                        value={formData.cur_province}
                        onChange={(e) => handleInputChange('cur_province', e.target.value)}
                        disabled={!isEditing}
                        variant="outlined"
                        size="small"
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="ZIP Code"
                        value={formData.cur_zip_code}
                        onChange={(e) => handleInputChange('cur_zip_code', e.target.value)}
                        disabled={!isEditing}
                        variant="outlined"
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      </Box>

      {/* Password Change Dialog */}
      <Dialog open={showPasswordDialog} onClose={() => setShowPasswordDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Current Password"
              type={showPassword ? 'text' : 'password'}
              value={passwordData.current_password}
              onChange={(e) => setPasswordData(prev => ({ ...prev, current_password: e.target.value }))}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                )
              }}
            />
            
            <TextField
              fullWidth
              label="New Password"
              type="password"
              value={passwordData.new_password}
              onChange={(e) => setPasswordData(prev => ({ ...prev, new_password: e.target.value }))}
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              label="Confirm New Password"
              type="password"
              value={passwordData.confirm_password}
              onChange={(e) => setPasswordData(prev => ({ ...prev, confirm_password: e.target.value }))}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPasswordDialog(false)}>Cancel</Button>
          <Button onClick={handlePasswordChange} variant="contained">
            Update Password
          </Button>
        </DialogActions>
      </Dialog>
    </LearnerLayout>
  );
}
