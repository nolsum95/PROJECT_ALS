import { useState } from 'react';
import ProgressIndicator from './ProgressIndicator';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import { router } from '@inertiajs/react';

const steps = [
  "Learner's Personal Information",
  "Household Status", 
  "Address",
  "Parent's/Guardian's Information",
  "PWD Information",
  "Educational Information",
  "CLC Accessibility"
];

export default function EnrollmentPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [learner, setLearner] = useState({
    lastname: '',
    firstname: '',
    middlename: '',
    birthdate: '',
    gender: '',
    extension_name: '',
    mobile_no: '+63',
    email_address: '',
    religion: '',
    mother_tongue: '',
    civil_status: '',
    date_enrolled: new Date().toISOString().slice(0, 10),
    learner_ref_no: '',
  });
  const [household, setHousehold] = useState({
    isIndegenous: '',
    ipCommunityName: '',
    is4PsMember: '',
    household_Id_4Ps: '',
  });
  const [address, setAddress] = useState({
    cur_house_no: '',
    cur_streetname: '',
    cur_barangay: '',
    cur_municipality: '',
    cur_province: '',
    cur_zip_code: '',
    perm_house_no: '',
    perm_streetname: '',
    perm_barangay: '',
    perm_municipality: '',
    perm_province: '',
    perm_zip_code: '',
  });
  const [guardian, setGuardian] = useState({
    pa_lastname: '',
    pa_firstname: '',
    pa_middlename: '',
    pa_occupation: '',
    ma_lastname: '',
    ma_firstname: '',
    ma_middlename: '',
    ma_occupation: '',
  });
  const [pwd, setPwd] = useState({
    is_pwd: '',
    disability_name: [],
    spec_health_prob: '',
    visual_impairment: '',
  });
  const [education, setEducation] = useState({
    lastLevelCompleted: '',
    nonCompletionReasons: [], // Array for checkboxes
    customReason: '',
    hasAttendedAls: '',
    alsProgramsAttended: [], // Array for ALS programs checkboxes
    hasCompletedAls: '',
    alsNonCompletedReason: '',
  });
  const [clc, setClc] = useState({
    distance_km: '',
    distance_hours: '',
    distance_mins: '',
    transport_modes: [], // Array for multiple transport modes
    transport_other: '', // For "Others" specification
    mon: false, mon_time: '',
    tue: false, tue_time: '',
    wed: false, wed_time: '',
    thur: false, thur_time: '',
    fri: false, fri_time: '',
    sat: false, sat_time: '',
    sun: false, sun_time: '',
  });

  const disabilityOptions = [
    'Attention Deficit Hyperactivity Disorder (ADHD)',
    'Autism Spectrum Disorder',
    'Cerebral Palsy',
    'Emotional-Behavior Disorder',
    'Hearing Impairment',
    'Intellectual Disablity',
    'Leaming Disability',
    'Multiple Disabilities',
    'Orthopedic/Physical Handicap',
    'Speech/Language Disorder',
  ];

  const gradeLevels = {
    elementary: [
      'Kinder',
      'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'
    ],
    juniorHigh: [
      'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'
    ],
    seniorHigh: [
      'Grade 11'
    ]
  };

  const nonCompletionReasons = [
    'No schooling in barangay',
    'School too far from home',
    'Needed to help family',
    'Unable to pay for miscellaneous and other expenses',
    'Other'
  ];

  const alsProgramOptions = [
    'Basic Literacy',
    'A&E Elementary',
    'A&E Secondary',
    'ALS SHS'
  ];

  const transportationOptions = [
    'Walking',
    'Motorcycle',
    'Bicycle',
    'Others'
  ];

  const motherTongueOptions = [
    'Tagalog',
    'Cebuano (Bisaya)',
    'Ilocano',
    'Hiligaynon (Ilonggo)',
    'Waray',
    'Kapampangan',
    'Pangasinense',
    'Bikol',
    'Maranao',
    'Tausug',
    'Maguindanaon'
  ];

  const handleNext = () => {
    if (activeStep < steps.length - 1) setActiveStep(activeStep + 1);
  };
  const handleBack = () => {
    if (activeStep > 0) setActiveStep(activeStep - 1);
  };

  const handleSubmit = () => {
    // Transform the data to match backend expectations
    const transformedEducation = {
      ...education,
      // Convert array to comma-separated string for backend compatibility
      nonCompletionReason: education.nonCompletionReasons.join(', '),
      // Convert array to comma-separated string for ALS programs
      alsProgramAttended: education.alsProgramsAttended.join(', ')
    };

    // Transform CLC data to match backend expectations
    const transformedClc = {
      ...clc,
      // Convert transport modes array to comma-separated string
      transport_mode: clc.transport_modes.includes('Others') 
        ? clc.transport_modes.filter(mode => mode !== 'Others').concat(clc.transport_other).join(', ')
        : clc.transport_modes.join(', ')
    };

    const payload = {
      alpha: learner,
      household,
      address,
      guardian,
      pwd,
      education: transformedEducation,
      clc: transformedClc,
    };
    
    router.post(route('enrollment.store'), payload, {
      onSuccess: (response) => {
        // Redirect to receipt page with enrollment data
        router.visit('/enrollment/receipt', {
          method: 'get',
          data: { 
            enrollmentData: JSON.stringify(learner)
          }
        });
      },
      onError: (errors) => {
        console.error('Enrollment submission failed:', errors);
        alert('Enrollment submission failed. Please try again.');
      }
    });
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 50%, #cbd5e1 100%)', 
      color: '#1e293b', 
      fontFamily: 'Inter, system-ui, sans-serif',
      padding: '2rem 1rem'
    }}>
      {/* Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', 
        color: 'white', 
        padding: '2rem 0',
        textAlign: 'center',
        marginBottom: '2rem',
        borderRadius: '16px',
        boxShadow: '0 10px 40px rgba(30, 41, 59, 0.3)'
      }}>
        <h1 style={{ 
          margin: 0, 
          fontSize: '2rem', 
          fontWeight: '700',
          letterSpacing: '-0.025em'
        }}>
          Enrollment Page
        </h1>
      </div>
      
      <ProgressIndicator steps={steps} activeStep={activeStep} />
      
      <div style={{ 
        maxWidth: 900, 
        margin: '0 auto', 
        background: 'white', 
        borderRadius: 20, 
        padding: '3rem', 
        minHeight: 500, 
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid rgba(226, 232, 240, 0.8)'
      }}>
        <h2 style={{ 
          marginBottom: 32, 
          color: '#1e293b', 
          textAlign: 'center',
          fontSize: '1.75rem',
          fontWeight: '700',
          letterSpacing: '-0.025em'
        }}>
          {steps[activeStep]}
        </h2>
        {activeStep === 0 && (
          <form autoComplete="off">
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '1.5rem', 
              alignItems: 'start' 
            }}>
              {/* Left Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <TextField
                  label="Learner's Reference No. (If available)"
                  placeholder=""
                  value={learner.learner_ref_no}
                  onChange={e => {
                    const raw = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                    setLearner(l => ({ ...l, learner_ref_no: raw }));
                  }}
                  fullWidth
                  size="small"
                  InputLabelProps={{ style: { color: '#6b7280', fontSize: '14px' } }}
                  sx={{ 
                    input: { color: '#374151', fontSize: '14px' },
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#f3f4f6',
                      '& fieldset': { borderColor: '#d1d5db' },
                      '&:hover fieldset': { borderColor: '#9ca3af' },
                      '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                    }
                  }}
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', maxLength: 10 }}
                />

                <TextField 
                  label="Lastname*" 
                  value={learner.lastname} 
                  onChange={e => setLearner(l => ({ ...l, lastname: e.target.value }))} 
                  required 
                  fullWidth 
                  size="small" 
                  InputLabelProps={{ style: { color: '#6b7280', fontSize: '14px' } }} 
                  sx={{ 
                    input: { color: '#374151', fontSize: '14px' },
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#f3f4f6',
                      '& fieldset': { borderColor: '#d1d5db' },
                      '&:hover fieldset': { borderColor: '#9ca3af' },
                      '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                    }
                  }} 
                />

                <TextField 
                  label="Firstname*" 
                  value={learner.firstname} 
                  onChange={e => setLearner(l => ({ ...l, firstname: e.target.value }))} 
                  required 
                  fullWidth 
                  size="small" 
                  InputLabelProps={{ style: { color: '#6b7280', fontSize: '14px' } }} 
                  sx={{ 
                    input: { color: '#374151', fontSize: '14px' },
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#f3f4f6',
                      '& fieldset': { borderColor: '#d1d5db' },
                      '&:hover fieldset': { borderColor: '#9ca3af' },
                      '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                    }
                  }} 
                />

                <TextField 
                  label="Middlename" 
                  value={learner.middlename} 
                  onChange={e => setLearner(l => ({ ...l, middlename: e.target.value }))} 
                  fullWidth 
                  size="small" 
                  InputLabelProps={{ style: { color: '#6b7280', fontSize: '14px' } }} 
                  sx={{ 
                    input: { color: '#374151', fontSize: '14px' },
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#f3f4f6',
                      '& fieldset': { borderColor: '#d1d5db' },
                      '&:hover fieldset': { borderColor: '#9ca3af' },
                      '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                    }
                  }} 
                />

                <TextField 
                  label="Suffix" 
                  placeholder="e.g., Jr., Sr., III"
                  value={learner.extension_name} 
                  onChange={e => setLearner(l => ({ ...l, extension_name: e.target.value }))} 
                  fullWidth 
                  size="small" 
                  InputLabelProps={{ style: { color: '#6b7280', fontSize: '14px' } }} 
                  sx={{ 
                    input: { color: '#374151', fontSize: '14px' },
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#f3f4f6',
                      '& fieldset': { borderColor: '#d1d5db' },
                      '&:hover fieldset': { borderColor: '#9ca3af' },
                      '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                    }
                  }} 
                />

                <TextField 
                  label="Email Address*" 
                  placeholder="e.g., user@example.com"
                  value={learner.email_address} 
                  onChange={e => setLearner(l => ({ ...l, email_address: e.target.value }))} 
                  fullWidth 
                  size="small" 
                  InputLabelProps={{ style: { color: '#6b7280', fontSize: '14px' } }} 
                  sx={{ 
                    input: { color: '#374151', fontSize: '14px' },
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#f3f4f6',
                      '& fieldset': { borderColor: '#d1d5db' },
                      '&:hover fieldset': { borderColor: '#9ca3af' },
                      '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                    }
                  }} 
                />
              </div>

              {/* Right Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <TextField 
                  label="Enroll Date" 
                  type="date" 
                  value={learner.date_enrolled} 
                  onChange={e => setLearner(l => ({ ...l, date_enrolled: e.target.value }))} 
                  required 
                  fullWidth 
                  size="small" 
                  InputLabelProps={{ shrink: true, style: { color: '#6b7280', fontSize: '14px' } }} 
                  sx={{ 
                    input: { color: '#374151', fontSize: '14px' },
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#f3f4f6',
                      '& fieldset': { borderColor: '#d1d5db' },
                      '&:hover fieldset': { borderColor: '#9ca3af' },
                      '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                    }
                  }} 
                  inputProps={{ readOnly: true }} 
                />

                <TextField 
                  label="Gender*" 
                  select 
                  value={learner.gender} 
                  onChange={e => setLearner(l => ({ ...l, gender: e.target.value }))} 
                  required 
                  fullWidth 
                  size="small" 
                  placeholder="Select Gender"
                  InputLabelProps={{ style: { color: '#6b7280', fontSize: '14px' } }} 
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#f3f4f6',
                      '& fieldset': { borderColor: '#d1d5db' },
                      '&:hover fieldset': { borderColor: '#9ca3af' },
                      '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                    },
                    '& .MuiSelect-select': { color: '#374151', fontSize: '14px' }
                  }}
                >
                  <MenuItem value="">Select Gender</MenuItem>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </TextField>

                <TextField 
                  label="Birth date*" 
                  type="date" 
                  value={learner.birthdate} 
                  onChange={e => setLearner(l => ({ ...l, birthdate: e.target.value }))} 
                  required 
                  fullWidth 
                  size="small" 
                  InputLabelProps={{ shrink: true, style: { color: '#6b7280', fontSize: '14px' } }} 
                  sx={{ 
                    input: { color: '#374151', fontSize: '14px' },
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#f3f4f6',
                      '& fieldset': { borderColor: '#d1d5db' },
                      '&:hover fieldset': { borderColor: '#9ca3af' },
                      '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                    }
                  }} 
                />

                <TextField 
                  label="Civil Status" 
                  select 
                  value={learner.civil_status} 
                  onChange={e => setLearner(l => ({ ...l, civil_status: e.target.value }))} 
                  fullWidth 
                  size="small" 
                  placeholder="Select"
                  InputLabelProps={{ style: { color: '#6b7280', fontSize: '14px' } }} 
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#f3f4f6',
                      '& fieldset': { borderColor: '#d1d5db' },
                      '&:hover fieldset': { borderColor: '#9ca3af' },
                      '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                    },
                    '& .MuiSelect-select': { color: '#374151', fontSize: '14px' }
                  }}
                >
                  <MenuItem value="">Select</MenuItem>
                  <MenuItem value="Single">Single</MenuItem>
                  <MenuItem value="Married">Married</MenuItem>
                  <MenuItem value="Widowed">Widowed</MenuItem>
                  <MenuItem value="Separated">Separated</MenuItem>
                </TextField>

                <TextField 
                  label="Mother Tongue" 
                  select
                  value={learner.mother_tongue} 
                  onChange={e => setLearner(l => ({ ...l, mother_tongue: e.target.value }))} 
                  fullWidth 
                  size="small" 
                  InputLabelProps={{ style: { color: '#6b7280', fontSize: '14px' } }} 
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#f3f4f6',
                      '& fieldset': { borderColor: '#d1d5db' },
                      '&:hover fieldset': { borderColor: '#9ca3af' },
                      '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                    },
                    '& .MuiSelect-select': { color: '#374151', fontSize: '14px' }
                  }}
                >
                  <MenuItem value="">Select Mother Tongue</MenuItem>
                  {motherTongueOptions.map(tongue => (
                    <MenuItem key={tongue} value={tongue}>{tongue}</MenuItem>
                  ))}
                </TextField>

                <TextField 
                  label="Religion" 
                  value={learner.religion} 
                  onChange={e => setLearner(l => ({ ...l, religion: e.target.value }))} 
                  fullWidth 
                  size="small" 
                  InputLabelProps={{ style: { color: '#6b7280', fontSize: '14px' } }} 
                  sx={{ 
                    input: { color: '#374151', fontSize: '14px' },
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#f3f4f6',
                      '& fieldset': { borderColor: '#d1d5db' },
                      '&:hover fieldset': { borderColor: '#9ca3af' },
                      '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                    }
                  }} 
                />

                <TextField 
                  label="Mobile No." 
                  placeholder="+63 9XX XXX XXXX"
                  value={learner.mobile_no} 
                  onChange={e => {
                    let value = e.target.value;
                    
                    // Always ensure it starts with +63
                    if (!value.startsWith('+63')) {
                      value = '+63';
                    }
                    
                    // Remove any non-digit characters after +63
                    const digitsOnly = value.slice(3).replace(/\D/g, '');
                    
                    // Limit to 10 digits after +63
                    const limitedDigits = digitsOnly.slice(0, 10);
                    
                    // Combine +63 with the digits
                    const finalValue = '+63' + limitedDigits;
                    
                    setLearner(l => ({ ...l, mobile_no: finalValue }));
                  }} 
                  required 
                  fullWidth 
                  size="small" 
                  InputLabelProps={{ style: { color: '#6b7280', fontSize: '14px' } }} 
                  helperText="Format: +63 followed by 10 digits (e.g., +639123456789)"
                  sx={{ 
                    input: { color: '#374151', fontSize: '14px' },
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#f3f4f6',
                      '& fieldset': { borderColor: '#d1d5db' },
                      '&:hover fieldset': { borderColor: '#9ca3af' },
                      '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                    },
                    '& .MuiFormHelperText-root': {
                      color: '#6b7280',
                      fontSize: '12px'
                    }
                  }} 
                  inputProps={{ 
                    inputMode: 'tel',
                    pattern: '\\+63[0-9]{10}',
                    maxLength: 13
                  }}
                />
              </div>
            </div>
          </form>
        )}
        {activeStep === 1 && (
          <form autoComplete="off">
            <Stack spacing={3}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                <span style={{ minWidth: 180 }}>Is the learner an Indigenous Person (IP)?</span>
                <TextField select value={household.isIndegenous} onChange={e => setHousehold(h => ({ ...h, isIndegenous: e.target.value }))} size="small" sx={{ minWidth: 120, input: { color: '#e5e7eb' } }}>
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </TextField>
              </Stack>
              {household.isIndegenous === 'Yes' && (
                <TextField label="IP Community Name" value={household.ipCommunityName} onChange={e => setHousehold(h => ({ ...h, ipCommunityName: e.target.value }))} fullWidth size="small" InputLabelProps={{ style: { color: '#cbd5e1' } }} sx={{ input: { color: '#e5e7eb' } }} />
              )}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                <span style={{ minWidth: 180 }}>Is the learner a 4Ps member?</span>
                <TextField select value={household.is4PsMember} onChange={e => setHousehold(h => ({ ...h, is4PsMember: e.target.value }))} size="small" sx={{ minWidth: 120, input: { color: '#e5e7eb' } }}>
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </TextField>
              </Stack>
              {household.is4PsMember === 'Yes' && (
                <TextField label="Household ID (4Ps)" value={household.household_Id_4Ps} onChange={e => setHousehold(h => ({ ...h, household_Id_4Ps: e.target.value }))} fullWidth size="small" InputLabelProps={{ style: { color: '#cbd5e1' } }} sx={{ input: { color: '#e5e7eb' } }} />
              )}
            </Stack>
          </form>
        )}
        {activeStep === 2 && (
          <form autoComplete="off">
            <Stack spacing={3}>
              <div style={{ fontWeight: 600, color: '#38bdf8' }}>Current Address</div>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField label="House No." value={address.cur_house_no} onChange={e => setAddress(a => ({ ...a, cur_house_no: e.target.value }))} size="small" fullWidth InputLabelProps={{ style: { color: '#cbd5e1' } }} sx={{ input: { color: '#e5e7eb' } }} />
                <TextField label="Street Name" value={address.cur_streetname} onChange={e => setAddress(a => ({ ...a, cur_streetname: e.target.value }))} size="small" fullWidth InputLabelProps={{ style: { color: '#cbd5e1' } }} sx={{ input: { color: '#e5e7eb' } }} />
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField label="Barangay" value={address.cur_barangay} onChange={e => setAddress(a => ({ ...a, cur_barangay: e.target.value }))} size="small" fullWidth InputLabelProps={{ style: { color: '#cbd5e1' } }} sx={{ input: { color: '#e5e7eb' } }} />
                <TextField label="Municipality" value={address.cur_municipality} onChange={e => setAddress(a => ({ ...a, cur_municipality: e.target.value }))} size="small" fullWidth InputLabelProps={{ style: { color: '#cbd5e1' } }} sx={{ input: { color: '#e5e7eb' } }} />
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField label="Province" value={address.cur_province} onChange={e => setAddress(a => ({ ...a, cur_province: e.target.value }))} size="small" fullWidth InputLabelProps={{ style: { color: '#cbd5e1' } }} sx={{ input: { color: '#e5e7eb' } }} />
                <TextField label="Zip Code" value={address.cur_zip_code} onChange={e => setAddress(a => ({ ...a, cur_zip_code: e.target.value }))} size="small" fullWidth InputLabelProps={{ style: { color: '#cbd5e1' } }} sx={{ input: { color: '#e5e7eb' } }} />
              </Stack>
              <div style={{ fontWeight: 600, color: '#38bdf8', marginTop: 16 }}>Permanent Address</div>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField label="House No." value={address.perm_house_no} onChange={e => setAddress(a => ({ ...a, perm_house_no: e.target.value }))} size="small" fullWidth InputLabelProps={{ style: { color: '#cbd5e1' } }} sx={{ input: { color: '#e5e7eb' } }} />
                <TextField label="Street Name" value={address.perm_streetname} onChange={e => setAddress(a => ({ ...a, perm_streetname: e.target.value }))} size="small" fullWidth InputLabelProps={{ style: { color: '#cbd5e1' } }} sx={{ input: { color: '#e5e7eb' } }} />
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField label="Barangay" value={address.perm_barangay} onChange={e => setAddress(a => ({ ...a, perm_barangay: e.target.value }))} size="small" fullWidth InputLabelProps={{ style: { color: '#cbd5e1' } }} sx={{ input: { color: '#e5e7eb' } }} />
                <TextField label="Municipality" value={address.perm_municipality} onChange={e => setAddress(a => ({ ...a, perm_municipality: e.target.value }))} size="small" fullWidth InputLabelProps={{ style: { color: '#cbd5e1' } }} sx={{ input: { color: '#e5e7eb' } }} />
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField label="Province" value={address.perm_province} onChange={e => setAddress(a => ({ ...a, perm_province: e.target.value }))} size="small" fullWidth InputLabelProps={{ style: { color: '#cbd5e1' } }} sx={{ input: { color: '#e5e7eb' } }} />
                <TextField label="Zip Code" value={address.perm_zip_code} onChange={e => setAddress(a => ({ ...a, perm_zip_code: e.target.value }))} size="small" fullWidth InputLabelProps={{ style: { color: '#cbd5e1' } }} sx={{ input: { color: '#e5e7eb' } }} />
              </Stack>
            </Stack>
          </form>
        )}
        {activeStep === 3 && (
          <form autoComplete="off">
            <Stack spacing={3}>
              <div style={{ fontWeight: 600, color: '#38bdf8' }}>Father/Guardian</div>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField label="Last Name" value={guardian.pa_lastname} onChange={e => setGuardian(g => ({ ...g, pa_lastname: e.target.value }))} size="small" fullWidth InputLabelProps={{ style: { color: '#cbd5e1' } }} sx={{ input: { color: '#e5e7eb' } }} />
                <TextField label="First Name" value={guardian.pa_firstname} onChange={e => setGuardian(g => ({ ...g, pa_firstname: e.target.value }))} size="small" fullWidth InputLabelProps={{ style: { color: '#cbd5e1' } }} sx={{ input: { color: '#e5e7eb' } }} />
                <TextField label="Middle Name" value={guardian.pa_middlename} onChange={e => setGuardian(g => ({ ...g, pa_middlename: e.target.value }))} size="small" fullWidth InputLabelProps={{ style: { color: '#cbd5e1' } }} sx={{ input: { color: '#e5e7eb' } }} />
              </Stack>
              <TextField label="Occupation" value={guardian.pa_occupation} onChange={e => setGuardian(g => ({ ...g, pa_occupation: e.target.value }))} size="small" fullWidth InputLabelProps={{ style: { color: '#cbd5e1' } }} sx={{ input: { color: '#e5e7eb' } }} />
              <div style={{ fontWeight: 600, color: '#38bdf8', marginTop: 16 }}>Mother/Guardian</div>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField label="Last Name" value={guardian.ma_lastname} onChange={e => setGuardian(g => ({ ...g, ma_lastname: e.target.value }))} size="small" fullWidth InputLabelProps={{ style: { color: '#cbd5e1' } }} sx={{ input: { color: '#e5e7eb' } }} />
                <TextField label="First Name" value={guardian.ma_firstname} onChange={e => setGuardian(g => ({ ...g, ma_firstname: e.target.value }))} size="small" fullWidth InputLabelProps={{ style: { color: '#cbd5e1' } }} sx={{ input: { color: '#e5e7eb' } }} />
                <TextField label="Middle Name" value={guardian.ma_middlename} onChange={e => setGuardian(g => ({ ...g, ma_middlename: e.target.value }))} size="small" fullWidth InputLabelProps={{ style: { color: '#cbd5e1' } }} sx={{ input: { color: '#e5e7eb' } }} />
              </Stack>
              <TextField label="Occupation" value={guardian.ma_occupation} onChange={e => setGuardian(g => ({ ...g, ma_occupation: e.target.value }))} size="small" fullWidth InputLabelProps={{ style: { color: '#cbd5e1' } }} sx={{ input: { color: '#e5e7eb' } }} />
            </Stack>
          </form>
        )}
        {activeStep === 4 && (
          <form autoComplete="off">
            <Stack spacing={4}>
              {/* PWD Question */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '1rem' }}>
                <span style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: '#1e293b',
                  minWidth: '200px'
                }}>
                  Is the Learner PWD?
                </span>
                <TextField 
                  select 
                  value={pwd.is_pwd} 
                  onChange={e => setPwd(p => ({ ...p, is_pwd: e.target.value, disability_name: [], spec_health_prob: '', visual_impairment: '' }))} 
                  size="small" 
                  sx={{ 
                    minWidth: 120,
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#f3f4f6',
                      '& fieldset': { borderColor: '#d1d5db' },
                      '&:hover fieldset': { borderColor: '#9ca3af' },
                      '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                    },
                    '& .MuiSelect-select': { color: '#374151', fontSize: '14px' }
                  }}
                >
                  <MenuItem value="">Select</MenuItem>
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </TextField>
              </div>

              {/* PWD Details in Two Columns */}
              {pwd.is_pwd === 'Yes' && (
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
                  gap: '2rem', 
                  alignItems: 'start' 
                }}>
                  {/* Left Column - Disability Types */}
                  <div>
                    <div style={{ 
                      fontWeight: '600', 
                      color: '#3b82f6', 
                      marginBottom: '1rem',
                      fontSize: '16px'
                    }}>
                      Specify the type of disability
                    </div>
                    <Stack spacing={1.5} sx={{ pl: 1 }}>
                      {disabilityOptions.map(opt => (
                        <label key={opt} style={{ 
                          color: '#374151', 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 12,
                          fontSize: '14px',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}>
                          <input
                            type="checkbox"
                            checked={pwd.disability_name.includes(opt)}
                            onChange={e => {
                              setPwd(p => ({
                                ...p,
                                disability_name: e.target.checked
                                  ? [...p.disability_name, opt]
                                  : p.disability_name.filter(d => d !== opt),
                              }));
                            }}
                            style={{ 
                              marginRight: '8px',
                              transform: 'scale(1.2)',
                              accentColor: '#3b82f6'
                            }}
                          />
                          {opt}
                        </label>
                      ))}
                    </Stack>
                  </div>

                  {/* Right Column - Health Problems and Visual Impairment */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Special Health Problem */}
                    <div>
                      <div style={{ 
                        fontWeight: '600', 
                        color: '#3b82f6', 
                        marginBottom: '1rem',
                        fontSize: '16px'
                      }}>
                        Special Health Problem/Chronic Disease
                      </div>
                      <Stack direction="row" spacing={3} alignItems="center" sx={{ pl: 1 }}>
                        <label style={{ 
                          color: '#374151',
                          fontSize: '14px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8
                        }}>
                          <input
                            type="radio"
                            name="spec_health_prob"
                            value="Cancer"
                            checked={pwd.spec_health_prob === 'Cancer'}
                            onChange={e => setPwd(p => ({ ...p, spec_health_prob: e.target.value }))}
                            style={{ 
                              transform: 'scale(1.2)',
                              accentColor: '#3b82f6'
                            }}
                          /> 
                          Cancer
                        </label>
                        <label style={{ 
                          color: '#374151',
                          fontSize: '14px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8
                        }}>
                          <input
                            type="radio"
                            name="spec_health_prob"
                            value="Non-Cancer"
                            checked={pwd.spec_health_prob === 'Non-Cancer'}
                            onChange={e => setPwd(p => ({ ...p, spec_health_prob: e.target.value }))}
                            style={{ 
                              transform: 'scale(1.2)',
                              accentColor: '#3b82f6'
                            }}
                          /> 
                          Non-Cancer
                        </label>
                      </Stack>
                    </div>

                    {/* Visual Impairment */}
                    <div>
                      <div style={{ 
                        fontWeight: '600', 
                        color: '#3b82f6', 
                        marginBottom: '1rem',
                        fontSize: '16px'
                      }}>
                        Visual Impairment
                      </div>
                      <Stack direction="row" spacing={3} alignItems="center" sx={{ pl: 1 }}>
                        <label style={{ 
                          color: '#374151',
                          fontSize: '14px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8
                        }}>
                          <input
                            type="radio"
                            name="visual_impairment"
                            value="Blind"
                            checked={pwd.visual_impairment === 'Blind'}
                            onChange={e => setPwd(p => ({ ...p, visual_impairment: e.target.value }))}
                            style={{ 
                              transform: 'scale(1.2)',
                              accentColor: '#3b82f6'
                            }}
                          /> 
                          Blind
                        </label>
                        <label style={{ 
                          color: '#374151',
                          fontSize: '14px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8
                        }}>
                          <input
                            type="radio"
                            name="visual_impairment"
                            value="Low Vision"
                            checked={pwd.visual_impairment === 'Low Vision'}
                            onChange={e => setPwd(p => ({ ...p, visual_impairment: e.target.value }))}
                            style={{ 
                              transform: 'scale(1.2)',
                              accentColor: '#3b82f6'
                            }}
                          /> 
                          Low Vision
                        </label>
                      </Stack>
                    </div>
                  </div>
                </div>
              )}
            </Stack>
          </form>
        )}
        {activeStep === 5 && (
          <form autoComplete="off">
            <Stack spacing={4}>
              {/* Two Column Layout */}
              <div style={{ 
                display: 'flex', 
                flexDirection: 'row',
                gap: '3rem', 
                alignItems: 'flex-start',
                flexWrap: 'wrap'
              }}>
                {/* Left Column - Last Level Completed */}
                <div style={{ flex: '1', minWidth: '300px' }}>
                  <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: '1rem', fontSize: '16px' }}>
                    Last Level Completed
                  </div>
                  
                  {/* Elementary Section */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ fontWeight: 600, color: '#3b82f6', marginBottom: '0.5rem', fontSize: '15px' }}>
                      1. Elementary:
                    </div>
                    <Stack spacing={1} sx={{ pl: 1 }}>
                      {gradeLevels.elementary.map(level => (
                        <label key={level} style={{ 
                          color: '#374151', 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 12, 
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}>
                          <input
                            type="radio"
                            name="lastLevelCompleted"
                            value={level}
                            checked={education.lastLevelCompleted === level}
                            onChange={e => setEducation(ed => ({ ...ed, lastLevelCompleted: e.target.value }))}
                            style={{ 
                              marginRight: '8px',
                              transform: 'scale(1.2)',
                              accentColor: '#3b82f6'
                            }}
                          />
                          {level}
                        </label>
                      ))}
                    </Stack>
                  </div>

                  {/* Junior High Section */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ fontWeight: 600, color: '#3b82f6', marginBottom: '0.5rem', fontSize: '15px' }}>
                      2. Junior High:
                    </div>
                    <Stack spacing={1} sx={{ pl: 1 }}>
                      {gradeLevels.juniorHigh.map(level => (
                        <label key={level} style={{ 
                          color: '#374151', 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 12, 
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}>
                          <input
                            type="radio"
                            name="lastLevelCompleted"
                            value={level}
                            checked={education.lastLevelCompleted === level}
                            onChange={e => setEducation(ed => ({ ...ed, lastLevelCompleted: e.target.value }))}
                            style={{ 
                              marginRight: '8px',
                              transform: 'scale(1.2)',
                              accentColor: '#3b82f6'
                            }}
                          />
                          {level}
                        </label>
                      ))}
                    </Stack>
                  </div>

                  {/* Senior High Section */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ fontWeight: 600, color: '#3b82f6', marginBottom: '0.5rem', fontSize: '15px' }}>
                      3. Senior High:
                    </div>
                    <Stack spacing={1} sx={{ pl: 1 }}>
                      {gradeLevels.seniorHigh.map(level => (
                        <label key={level} style={{ 
                          color: '#374151', 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 12, 
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}>
                          <input
                            type="radio"
                            name="lastLevelCompleted"
                            value={level}
                            checked={education.lastLevelCompleted === level}
                            onChange={e => setEducation(ed => ({ ...ed, lastLevelCompleted: e.target.value }))}
                            style={{ 
                              marginRight: '8px',
                              transform: 'scale(1.2)',
                              accentColor: '#3b82f6'
                            }}
                          />
                          {level}
                        </label>
                      ))}
                    </Stack>
                  </div>
                </div>

                {/* Right Column - Reason for not completing schooling */}
                <div style={{ flex: '1', minWidth: '300px' }}>
                  <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: '1rem', fontSize: '16px' }}>
                    Why did you not attend/complete schooling (For OSY only)
                  </div>
                  <Stack spacing={1.5} sx={{ pl: 1 }}>
                    {nonCompletionReasons.map(reason => (
                      <label key={reason} style={{ 
                        color: '#374151', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 12, 
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}>
                        <input
                          type="checkbox"
                          checked={education.nonCompletionReasons.includes(reason)}
                          onChange={e => {
                            setEducation(ed => ({
                              ...ed,
                              nonCompletionReasons: e.target.checked
                                ? [...ed.nonCompletionReasons, reason]
                                : ed.nonCompletionReasons.filter(r => r !== reason),
                            }));
                          }}
                          style={{ 
                            marginRight: '8px',
                            transform: 'scale(1.2)',
                            accentColor: '#3b82f6'
                          }}
                        />
                        {reason === 'Other' ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                            <span>Other: (Pls specify)</span>
                            <TextField
                              size="small"
                              placeholder="Please specify..."
                              value={education.customReason}
                              onChange={e => setEducation(ed => ({ ...ed, customReason: e.target.value }))}
                              disabled={!education.nonCompletionReasons.includes('Other')}
                              sx={{ 
                                flex: 1, 
                                maxWidth: '250px',
                                input: { color: '#374151', fontSize: '14px' },
                                '& .MuiOutlinedInput-root': {
                                  backgroundColor: '#f3f4f6',
                                  '& fieldset': { borderColor: '#d1d5db' },
                                  '&:hover fieldset': { borderColor: '#9ca3af' },
                                  '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                                }
                              }}
                            />
                          </div>
                        ) : reason}
                      </label>
                    ))}
                  </Stack>
                </div>
              </div>

              {/* ALS Attendance Question */}
              <div>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                  <span style={{ 
                    minWidth: 300, 
                    fontWeight: 600, 
                    color: '#1e293b',
                    fontSize: '16px'
                  }}>
                    Have you attended ALS learning session before?
                  </span>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <label style={{ 
                      color: '#374151', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 8, 
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}>
                      <input
                        type="radio"
                        name="hasAttendedAls"
                        value="Yes"
                        checked={education.hasAttendedAls === 'Yes'}
                        onChange={e => setEducation(ed => ({ ...ed, hasAttendedAls: e.target.value }))}
                        style={{ 
                          marginRight: '8px',
                          transform: 'scale(1.2)',
                          accentColor: '#3b82f6'
                        }}
                      />
                      Yes
                    </label>
                    <label style={{ 
                      color: '#374151', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 8, 
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}>
                      <input
                        type="radio"
                        name="hasAttendedAls"
                        value="No"
                        checked={education.hasAttendedAls === 'No'}
                        onChange={e => setEducation(ed => ({ ...ed, hasAttendedAls: e.target.value }))}
                        style={{ 
                          marginRight: '8px',
                          transform: 'scale(1.2)',
                          accentColor: '#3b82f6'
                        }}
                      />
                      No
                    </label>
                  </div>
                </Stack>

                {/* ALS Programs Attended */}
                {education.hasAttendedAls === 'Yes' && (
                  <div style={{ marginTop: '1.5rem', paddingLeft: '1rem' }}>
                    <div style={{ 
                      fontWeight: 600, 
                      color: '#3b82f6', 
                      marginBottom: '1rem',
                      fontSize: '15px'
                    }}>
                      If Yes, check the appropriate program:
                    </div>
                    <Stack spacing={1.5} sx={{ pl: 1 }}>
                      {alsProgramOptions.map(program => (
                        <label key={program} style={{ 
                          color: '#374151', 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 12, 
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}>
                          <input
                            type="checkbox"
                            checked={education.alsProgramsAttended.includes(program)}
                            onChange={e => {
                              setEducation(ed => ({
                                ...ed,
                                alsProgramsAttended: e.target.checked
                                  ? [...ed.alsProgramsAttended, program]
                                  : ed.alsProgramsAttended.filter(p => p !== program),
                              }));
                            }}
                            style={{ 
                              marginRight: '8px',
                              transform: 'scale(1.2)',
                              accentColor: '#3b82f6'
                            }}
                          />
                          {program}
                        </label>
                      ))}
                    </Stack>
                  </div>
                )}
              </div>

              {/* ALS Completion Question */}
              <div>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                  <span style={{ 
                    minWidth: 250, 
                    fontWeight: 600, 
                    color: '#1e293b',
                    fontSize: '16px'
                  }}>
                    Have you completed the program?
                  </span>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <label style={{ 
                      color: '#374151', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 8, 
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}>
                      <input
                        type="radio"
                        name="hasCompletedAls"
                        value="Yes"
                        checked={education.hasCompletedAls === 'Yes'}
                        onChange={e => setEducation(ed => ({ ...ed, hasCompletedAls: e.target.value }))}
                        style={{ 
                          marginRight: '8px',
                          transform: 'scale(1.2)',
                          accentColor: '#3b82f6'
                        }}
                      />
                      Yes
                    </label>
                    <label style={{ 
                      color: '#374151', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 8, 
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}>
                      <input
                        type="radio"
                        name="hasCompletedAls"
                        value="No"
                        checked={education.hasCompletedAls === 'No'}
                        onChange={e => setEducation(ed => ({ ...ed, hasCompletedAls: e.target.value }))}
                        style={{ 
                          marginRight: '8px',
                          transform: 'scale(1.2)',
                          accentColor: '#3b82f6'
                        }}
                      />
                      No
                    </label>
                  </div>
                </Stack>

                {/* Reason for not completing ALS */}
                {education.hasCompletedAls === 'No' && (
                  <div style={{ marginTop: '1.5rem', paddingLeft: '1rem' }}>
                    <TextField
                      label="If no, State the reason:"
                      value={education.alsNonCompletedReason}
                      onChange={e => setEducation(ed => ({ ...ed, alsNonCompletedReason: e.target.value }))}
                      fullWidth
                      size="small"
                      multiline
                      rows={2}
                      InputLabelProps={{ style: { color: '#6b7280', fontSize: '14px' } }}
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: '#f3f4f6',
                          '& fieldset': { borderColor: '#d1d5db' },
                          '&:hover fieldset': { borderColor: '#9ca3af' },
                          '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                        },
                        '& .MuiInputBase-input': { 
                          color: '#374151',
                          fontSize: '14px'
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            </Stack>
          </form>
        )}
        {activeStep === 6 && (
          <form autoComplete="off">
            <Stack spacing={4}>
              {/* Question 1 - Distance */}
              <div>
                <div style={{ 
                  fontWeight: 600, 
                  color: '#3b82f6', 
                  marginBottom: '1rem',
                  fontSize: '16px'
                }}>
                  1. How far is your home to your Learning Center?
                </div>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField 
                    label="in kms" 
                    placeholder="in kms"
                    value={clc.distance_km} 
                    onChange={e => setClc(c => ({ ...c, distance_km: e.target.value }))} 
                    size="small" 
                    InputLabelProps={{ style: { color: '#6b7280', fontSize: '14px' } }} 
                    sx={{ 
                      minWidth: 150,
                      input: { color: '#374151', fontSize: '14px' },
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#f3f4f6',
                        '& fieldset': { borderColor: '#d1d5db' },
                        '&:hover fieldset': { borderColor: '#9ca3af' },
                        '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                      }
                    }} 
                  />
                  <TextField 
                    label="in hours" 
                    placeholder="in hours"
                    value={clc.distance_hours} 
                    onChange={e => setClc(c => ({ ...c, distance_hours: e.target.value }))} 
                    size="small" 
                    InputLabelProps={{ style: { color: '#6b7280', fontSize: '14px' } }} 
                    sx={{ 
                      minWidth: 150,
                      input: { color: '#374151', fontSize: '14px' },
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#f3f4f6',
                        '& fieldset': { borderColor: '#d1d5db' },
                        '&:hover fieldset': { borderColor: '#9ca3af' },
                        '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                      }
                    }} 
                  />
                  <TextField 
                    label="in mins" 
                    placeholder="in mins"
                    value={clc.distance_mins} 
                    onChange={e => setClc(c => ({ ...c, distance_mins: e.target.value }))} 
                    size="small" 
                    InputLabelProps={{ style: { color: '#6b7280', fontSize: '14px' } }} 
                    sx={{ 
                      minWidth: 150,
                      input: { color: '#374151', fontSize: '14px' },
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#f3f4f6',
                        '& fieldset': { borderColor: '#d1d5db' },
                        '&:hover fieldset': { borderColor: '#9ca3af' },
                        '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                      }
                    }} 
                  />
                </Stack>
              </div>

              {/* Question 2 - Transportation */}
              <div>
                <div style={{ 
                  fontWeight: 600, 
                  color: '#3b82f6', 
                  marginBottom: '1rem',
                  fontSize: '16px'
                }}>
                  2. How do you get from your home to your learning center?
                </div>
                <Stack spacing={1.5} sx={{ pl: 1 }}>
                  {transportationOptions.map(option => (
                    <label key={option} style={{ 
                      color: '#374151', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 12, 
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}>
                      <input
                        type="checkbox"
                        checked={clc.transport_modes.includes(option)}
                        onChange={e => {
                          setClc(c => ({
                            ...c,
                            transport_modes: e.target.checked
                              ? [...c.transport_modes, option]
                              : c.transport_modes.filter(mode => mode !== option),
                          }));
                        }}
                        style={{ 
                          marginRight: '8px',
                          transform: 'scale(1.2)',
                          accentColor: '#3b82f6'
                        }}
                      />
                      {option === 'Others' ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                          <span>Others: Please Specify</span>
                          <TextField
                            size="small"
                            placeholder="Please specify..."
                            value={clc.transport_other}
                            onChange={e => setClc(c => ({ ...c, transport_other: e.target.value }))}
                            disabled={!clc.transport_modes.includes('Others')}
                            sx={{ 
                              flex: 1, 
                              maxWidth: '300px',
                              input: { color: '#374151', fontSize: '14px' },
                              '& .MuiOutlinedInput-root': {
                                backgroundColor: '#f3f4f6',
                                '& fieldset': { borderColor: '#d1d5db' },
                                '&:hover fieldset': { borderColor: '#9ca3af' },
                                '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                              }
                            }}
                          />
                        </div>
                      ) : option}
                    </label>
                  ))}
                </Stack>
              </div>

              {/* Question 3 - Schedule */}
              <div>
                <div style={{ 
                  fontWeight: 600, 
                  color: '#3b82f6', 
                  marginBottom: '1.5rem',
                  fontSize: '16px'
                }}>
                  3. Please provide the specific day and time you can be at your learning center:
                </div>
                <Stack spacing={2}>
                  {['mon','tue','wed','thur','fri','sat','sun'].map((day) => (
                    <div key={day} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 16, 
                      flexWrap: 'wrap',
                      padding: '8px 0'
                    }}>
                      <label style={{ 
                        color: '#374151', 
                        minWidth: 110, 
                        textTransform: 'capitalize',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8
                      }}>
                        <input 
                          type="checkbox" 
                          checked={clc[day]} 
                          onChange={e => setClc(c => ({ ...c, [day]: e.target.checked }))}
                          style={{ 
                            transform: 'scale(1.2)',
                            accentColor: '#3b82f6'
                          }}
                        /> 
                        {day === 'mon' ? 'Mon' : 
                         day === 'tue' ? 'Tue' : 
                         day === 'wed' ? 'Wed' : 
                         day === 'thur' ? 'Thur' : 
                         day === 'fri' ? 'Fri' : 
                         day === 'sat' ? 'Sat' : 'Sun'}
                      </label>
                      {clc[day] && (
                        <TextField
                          label="Time (e.g., 9:00-11:00 AM)"
                          placeholder="e.g., 9:00-11:00 AM"
                          value={clc[`${day}_time`]}
                          onChange={e => setClc(c => ({ ...c, [`${day}_time`]: e.target.value }))}
                          size="small"
                          InputLabelProps={{ style: { color: '#6b7280', fontSize: '14px' } }}
                          sx={{ 
                            minWidth: 250,
                            input: { color: '#374151', fontSize: '14px' },
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: '#f3f4f6',
                              '& fieldset': { borderColor: '#d1d5db' },
                              '&:hover fieldset': { borderColor: '#9ca3af' },
                              '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                            }
                          }}
                        />
                      )}
                    </div>
                  ))}
                </Stack>
              </div>
            </Stack>
          </form>
        )}
        {/* Navigation Buttons */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginTop: 48,
          paddingTop: 24,
          borderTop: '1px solid #e2e8f0'
        }}>
          <button 
            onClick={handleBack} 
            disabled={activeStep === 0} 
            style={{ 
              padding: '12px 32px', 
              borderRadius: 12, 
              border: '2px solid #e2e8f0', 
              background: activeStep === 0 ? '#f8fafc' : 'white',
              color: activeStep === 0 ? '#94a3b8' : '#475569',
              opacity: activeStep === 0 ? 0.6 : 1, 
              cursor: activeStep === 0 ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              boxShadow: activeStep === 0 ? 'none' : '0 4px 15px rgba(0, 0, 0, 0.1)'
            }}
            onMouseEnter={e => {
              if (activeStep !== 0) {
                e.target.style.background = '#f8fafc';
                e.target.style.borderColor = '#cbd5e1';
                e.target.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={e => {
              if (activeStep !== 0) {
                e.target.style.background = 'white';
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.transform = 'translateY(0)';
              }
            }}
          >
            Back
          </button>
          
          {activeStep < steps.length - 1 ? (
            <button 
              onClick={handleNext} 
              style={{ 
                padding: '12px 32px', 
                borderRadius: 12, 
                border: 'none', 
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)'
              }}
              onMouseEnter={e => {
                e.target.style.background = 'linear-gradient(135deg, #059669, #047857)';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 12px 35px rgba(16, 185, 129, 0.4)';
              }}
              onMouseLeave={e => {
                e.target.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.3)';
              }}
            >
              Next
            </button>
          ) : (
            <button 
              onClick={handleSubmit} 
              style={{ 
                padding: '12px 32px', 
                borderRadius: 12, 
                border: 'none', 
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)'
              }}
              onMouseEnter={e => {
                e.target.style.background = 'linear-gradient(135deg, #1d4ed8, #1e40af)';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 12px 35px rgba(59, 130, 246, 0.4)';
              }}
              onMouseLeave={e => {
                e.target.style.background = 'linear-gradient(135deg, #3b82f6, #1d4ed8)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.3)';
              }}
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}