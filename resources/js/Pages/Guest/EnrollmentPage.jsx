import { useState } from 'react';
import ProgressIndicator from './ProgressIndicator';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import { router } from '@inertiajs/react';

const steps = [
  "Learner's Personal Information",
  'Household Status',
  'Address',
  "Parent's/Guardian's Information",
  'PWD Information',
  'Educational Information',
  'CLC Accessibility',
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
    mobile_no: '',
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
    nonCompletionReason: '',
    custom_reason: '',
    hasAttendedAls: '',
    alsProgramAttended: '',
    hasCompletedAls: '',
    alsNonCompletedReason: '',
  });
  const [clc, setClc] = useState({
    distance_km: '',
    distance_hours: '',
    distance_mins: '',
    transport_mode: '',
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

  const gradeLevels = [
    'Kinder',
    'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6',
    'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11',
  ];

  const handleNext = () => {
    if (activeStep < steps.length - 1) setActiveStep(activeStep + 1);
  };
  const handleBack = () => {
    if (activeStep > 0) setActiveStep(activeStep - 1);
  };

  const handleSubmit = () => {
    const payload = {
      alpha: learner,
      household,
      address,
      guardian,
      pwd,
      education,
      clc,
    };
    router.post(route('enrollment.store'), payload, {
      onSuccess: () => {
        // You can replace with SweetAlert if desired
        alert('Enrollment submitted successfully.');
      },
    });
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#e5e7eb', fontFamily: 'Poppins, sans-serif' }}>
      <ProgressIndicator steps={steps} activeStep={activeStep} />
      <div style={{ maxWidth: 600, margin: '0 auto', background: 'rgba(30,41,59,0.85)', borderRadius: 16, padding: '2rem', minHeight: 300 }}>
        <h2 style={{ marginBottom: 24 }}>{steps[activeStep]}</h2>
        {activeStep === 0 && (
          <form autoComplete="off">
            <Stack spacing={2}>
              <TextField
                label="Learner's Reference No. (LRN) — If available"
                placeholder="LRN-##########"
                value={learner.learner_ref_no}
                onChange={e => {
                  const raw = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                  setLearner(l => ({ ...l, learner_ref_no: raw }));
                }}
                helperText="Enter exactly 10 digits if available"
                fullWidth
                size="small"
                InputLabelProps={{ style: { color: '#cbd5e1' } }}
                sx={{ input: { color: '#e5e7eb' } }}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', maxLength: 10 }}
              />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField label="Last Name" value={learner.lastname} onChange={e => setLearner(l => ({ ...l, lastname: e.target.value }))} required fullWidth size="small" InputLabelProps={{ style: { color: '#cbd5e1' } }} sx={{ input: { color: '#e5e7eb' } }} />
                <TextField label="First Name" value={learner.firstname} onChange={e => setLearner(l => ({ ...l, firstname: e.target.value }))} required fullWidth size="small" InputLabelProps={{ style: { color: '#cbd5e1' } }} sx={{ input: { color: '#e5e7eb' } }} />
                <TextField label="Middle Name" value={learner.middlename} onChange={e => setLearner(l => ({ ...l, middlename: e.target.value }))} fullWidth size="small" InputLabelProps={{ style: { color: '#cbd5e1' } }} sx={{ input: { color: '#e5e7eb' } }} />
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField label="Birthdate" type="date" value={learner.birthdate} onChange={e => setLearner(l => ({ ...l, birthdate: e.target.value }))} required fullWidth size="small" InputLabelProps={{ shrink: true, style: { color: '#cbd5e1' } }} sx={{ input: { color: '#e5e7eb' } }} />
                <TextField label="Gender" select value={learner.gender} onChange={e => setLearner(l => ({ ...l, gender: e.target.value }))} required fullWidth size="small" InputLabelProps={{ style: { color: '#cbd5e1' } }} sx={{ input: { color: '#e5e7eb' } }}>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </TextField>
                <TextField label="Extension Name" value={learner.extension_name} onChange={e => setLearner(l => ({ ...l, extension_name: e.target.value }))} fullWidth size="small" InputLabelProps={{ style: { color: '#cbd5e1' } }} sx={{ input: { color: '#e5e7eb' } }} />
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField label="Mobile No." value={learner.mobile_no} onChange={e => setLearner(l => ({ ...l, mobile_no: e.target.value }))} required fullWidth size="small" InputLabelProps={{ style: { color: '#cbd5e1' } }} sx={{ input: { color: '#e5e7eb' } }} />
                <TextField label="Email Address" value={learner.email_address} onChange={e => setLearner(l => ({ ...l, email_address: e.target.value }))} fullWidth size="small" InputLabelProps={{ style: { color: '#cbd5e1' } }} sx={{ input: { color: '#e5e7eb' } }} />
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField label="Religion" value={learner.religion} onChange={e => setLearner(l => ({ ...l, religion: e.target.value }))} fullWidth size="small" InputLabelProps={{ style: { color: '#cbd5e1' } }} sx={{ input: { color: '#e5e7eb' } }} />
                <TextField label="Mother Tongue" value={learner.mother_tongue} onChange={e => setLearner(l => ({ ...l, mother_tongue: e.target.value }))} fullWidth size="small" InputLabelProps={{ style: { color: '#cbd5e1' } }} sx={{ input: { color: '#e5e7eb' } }} />
                <TextField label="Civil Status" select value={learner.civil_status} onChange={e => setLearner(l => ({ ...l, civil_status: e.target.value }))} fullWidth size="small" InputLabelProps={{ style: { color: '#cbd5e1' } }} sx={{ input: { color: '#e5e7eb' } }}>
                  <MenuItem value="Single">Single</MenuItem>
                  <MenuItem value="Married">Married</MenuItem>
                  <MenuItem value="Widowed">Widowed</MenuItem>
                  <MenuItem value="Separated">Separated</MenuItem>
                </TextField>
              </Stack>
              <TextField label="Date Enrolled" type="date" value={learner.date_enrolled} onChange={e => setLearner(l => ({ ...l, date_enrolled: e.target.value }))} required fullWidth size="small" InputLabelProps={{ shrink: true, style: { color: '#cbd5e1' } }} sx={{ input: { color: '#e5e7eb' } }} inputProps={{ readOnly: true }} />
            </Stack>
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
            <Stack spacing={3}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                <span style={{ minWidth: 180 }}>Is the Learner PWD?</span>
                <TextField select value={pwd.is_pwd} onChange={e => setPwd(p => ({ ...p, is_pwd: e.target.value, disability_name: [], spec_health_prob: '', visual_impairment: '' }))} size="small" sx={{ minWidth: 120, input: { color: '#e5e7eb' } }}>
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </TextField>
              </Stack>
              {pwd.is_pwd === 'Yes' && (
                <>
                  <div style={{ fontWeight: 600, color: '#38bdf8' }}>Specify the type of disability</div>
                  <Stack spacing={1} sx={{ pl: 2 }}>
                    {disabilityOptions.map(opt => (
                      <label key={opt} style={{ color: '#e5e7eb', display: 'flex', alignItems: 'center', gap: 8 }}>
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
                        />
                        {opt}
                      </label>
                    ))}
                  </Stack>
                  <div style={{ fontWeight: 600, color: '#38bdf8', marginTop: 16 }}>Special Health Problem/Chronic Disease</div>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <label style={{ color: '#e5e7eb' }}>
                      <input
                        type="radio"
                        name="spec_health_prob"
                        value="Cancer"
                        checked={pwd.spec_health_prob === 'Cancer'}
                        onChange={e => setPwd(p => ({ ...p, spec_health_prob: e.target.value }))}
                      /> Cancer
                    </label>
                    <label style={{ color: '#e5e7eb' }}>
                      <input
                        type="radio"
                        name="spec_health_prob"
                        value="Non-Cancer"
                        checked={pwd.spec_health_prob === 'Non-Cancer'}
                        onChange={e => setPwd(p => ({ ...p, spec_health_prob: e.target.value }))}
                      /> Non-Cancer
                    </label>
                  </Stack>
                  <div style={{ fontWeight: 600, color: '#38bdf8', marginTop: 16 }}>Visual Impairment</div>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <label style={{ color: '#e5e7eb' }}>
                      <input
                        type="radio"
                        name="visual_impairment"
                        value="Blind"
                        checked={pwd.visual_impairment === 'Blind'}
                        onChange={e => setPwd(p => ({ ...p, visual_impairment: e.target.value }))}
                      /> Blind
                    </label>
                    <label style={{ color: '#e5e7eb' }}>
                      <input
                        type="radio"
                        name="visual_impairment"
                        value="Low Vision"
                        checked={pwd.visual_impairment === 'Low Vision'}
                        onChange={e => setPwd(p => ({ ...p, visual_impairment: e.target.value }))}
                      /> Low Vision
                    </label>
                  </Stack>
                </>
              )}
            </Stack>
          </form>
        )}
        {activeStep === 5 && (
          <form autoComplete="off">
            <Stack spacing={3}>
              <TextField
                label="Last Level Completed"
                select
                value={education.lastLevelCompleted}
                onChange={e => setEducation(ed => ({ ...ed, lastLevelCompleted: e.target.value }))}
                fullWidth
                size="small"
                InputLabelProps={{ style: { color: '#cbd5e1' } }}
                sx={{ input: { color: '#e5e7eb' } }}
              >
                {gradeLevels.map(level => (
                  <MenuItem key={level} value={level}>{level}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="Reason for not completing last level (if applicable)"
                value={education.nonCompletionReason}
                onChange={e => setEducation(ed => ({ ...ed, nonCompletionReason: e.target.value }))}
                fullWidth
                size="small"
                InputLabelProps={{ style: { color: '#cbd5e1' } }}
                sx={{ input: { color: '#e5e7eb' } }}
              />
              <TextField
                label="Custom Reason (if other)"
                value={education.custom_reason}
                onChange={e => setEducation(ed => ({ ...ed, custom_reason: e.target.value }))}
                fullWidth
                size="small"
                InputLabelProps={{ style: { color: '#cbd5e1' } }}
                sx={{ input: { color: '#e5e7eb' } }}
              />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                <span style={{ minWidth: 180 }}>Has attended ALS before?</span>
                <TextField select value={education.hasAttendedAls} onChange={e => setEducation(ed => ({ ...ed, hasAttendedAls: e.target.value }))} size="small" sx={{ minWidth: 120, input: { color: '#e5e7eb' } }}>
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </TextField>
              </Stack>
              {education.hasAttendedAls === 'Yes' && (
                <TextField
                  label="ALS Program Attended"
                  value={education.alsProgramAttended}
                  onChange={e => setEducation(ed => ({ ...ed, alsProgramAttended: e.target.value }))}
                  fullWidth
                  size="small"
                  InputLabelProps={{ style: { color: '#cbd5e1' } }}
                  sx={{ input: { color: '#e5e7eb' } }}
                />
              )}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                <span style={{ minWidth: 180 }}>Has completed ALS?</span>
                <TextField select value={education.hasCompletedAls} onChange={e => setEducation(ed => ({ ...ed, hasCompletedAls: e.target.value }))} size="small" sx={{ minWidth: 120, input: { color: '#e5e7eb' } }}>
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </TextField>
              </Stack>
              {education.hasCompletedAls === 'No' && (
                <TextField
                  label="Reason for not completing ALS"
                  value={education.alsNonCompletedReason}
                  onChange={e => setEducation(ed => ({ ...ed, alsNonCompletedReason: e.target.value }))}
                  fullWidth
                  size="small"
                  InputLabelProps={{ style: { color: '#cbd5e1' } }}
                  sx={{ input: { color: '#e5e7eb' } }}
                />
              )}
            </Stack>
          </form>
        )}
        {activeStep === 6 && (
          <form autoComplete="off">
            <Stack spacing={3}>
              <div style={{ fontWeight: 600, color: '#38bdf8' }}>1. How far is your home to your Learning Center?</div>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField label="in kms" value={clc.distance_km} onChange={e => setClc(c => ({ ...c, distance_km: e.target.value }))} size="small" InputLabelProps={{ style: { color: '#cbd5e1' } }} sx={{ input: { color: '#e5e7eb' }, minWidth: 120 }} />
                <TextField label="in hours" value={clc.distance_hours} onChange={e => setClc(c => ({ ...c, distance_hours: e.target.value }))} size="small" InputLabelProps={{ style: { color: '#cbd5e1' } }} sx={{ input: { color: '#e5e7eb' }, minWidth: 120 }} />
                <TextField label="in mins" value={clc.distance_mins} onChange={e => setClc(c => ({ ...c, distance_mins: e.target.value }))} size="small" InputLabelProps={{ style: { color: '#cbd5e1' } }} sx={{ input: { color: '#e5e7eb' }, minWidth: 120 }} />
              </Stack>

              <div style={{ fontWeight: 600, color: '#38bdf8' }}>2. How do you get from your home to your learning center?</div>
              <TextField label="Mode of Transportation" value={clc.transport_mode} onChange={e => setClc(c => ({ ...c, transport_mode: e.target.value }))} fullWidth size="small" InputLabelProps={{ style: { color: '#cbd5e1' } }} sx={{ input: { color: '#e5e7eb' } }} />

              <div style={{ fontWeight: 600, color: '#38bdf8' }}>3. Please provide the specific day and time you can be at your learning center:</div>
              <Stack spacing={2}>
                {['mon','tue','wed','thur','fri','sat','sun'].map((day) => (
                  <div key={day} style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    <label style={{ color: '#e5e7eb', minWidth: 110, textTransform: 'capitalize' }}>
                      <input type="checkbox" checked={clc[day]} onChange={e => setClc(c => ({ ...c, [day]: e.target.checked }))} /> {day}
                    </label>
                    {clc[day] && (
                      <TextField
                        label="Time (e.g., 9:00-11:00 AM)"
                        value={clc[`${day}_time`]}
                        onChange={e => setClc(c => ({ ...c, [`${day}_time`]: e.target.value }))}
                        size="small"
                        InputLabelProps={{ style: { color: '#cbd5e1' } }}
                        sx={{ input: { color: '#e5e7eb' }, minWidth: 220 }}
                      />
                    )}
                  </div>
                ))}
              </Stack>
            </Stack>
          </form>
        )}
        {/* TODO: Render form for other steps here */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
          <button onClick={handleBack} disabled={activeStep === 0} style={{ padding: '0.5rem 1.5rem', borderRadius: 8, border: 'none', background: '#334155', color: '#fff', opacity: activeStep === 0 ? 0.5 : 1, cursor: activeStep === 0 ? 'not-allowed' : 'pointer' }}>Back</button>
          {activeStep < steps.length - 1 ? (
            <button onClick={handleNext} style={{ padding: '0.5rem 1.5rem', borderRadius: 8, border: 'none', background: '#14b8a6', color: '#fff' }}>Next</button>
          ) : (
            <button onClick={handleSubmit} style={{ padding: '0.5rem 1.5rem', borderRadius: 8, border: 'none', background: '#22c55e', color: '#fff' }}>Submit</button>
          )}
        </div>
      </div>
    </div>
  );
}