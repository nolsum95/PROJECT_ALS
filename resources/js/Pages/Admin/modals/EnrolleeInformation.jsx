import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';

export default function EnrolleeInformation({ open, onClose, enrollee }) {
  if (!enrollee) return null;

  // Support both flat and nested shapes
  const alpha = enrollee.alpha ?? enrollee;
  const household = enrollee.household ?? enrollee.household_status ?? {};
  const address = enrollee.address ?? enrollee.enrollment_address ?? {};
  const guardian = enrollee.guardian ?? enrollee.enrollment_guardian ?? {};
  const pwd = enrollee.pwd ?? enrollee.enrollment_pwd ?? {};
  const education = enrollee.education ?? enrollee.enrollment_info ?? {};
  const clc = enrollee.clc ?? enrollee.distance_availability ?? {};

  // Derive CLC fields from stored formats
  let clcKm = clc?.distance_km ?? clc?.distance_clc_km ?? '';
  let clcHours = clc?.distance_hours ?? '';
  let clcMins = clc?.distance_mins ?? '';

  if (!clcHours || !clcMins) {
    // Try parsing distance_clc_km as km|hours|mins
    if (typeof clcKm === 'string' && clcKm.includes('|')) {
      const [km, h, m] = clcKm.split('|');
      clcKm = km ?? clcKm;
      clcHours = clcHours || h || '';
      clcMins = clcMins || m || '';
    }
  }
  if ((!clcHours || !clcMins) && typeof clc?.travel_hours_minutes === 'string' && clc.travel_hours_minutes.includes(':')) {
    const [h, m] = clc.travel_hours_minutes.split(':');
    clcHours = clcHours || h || '';
    clcMins = clcMins || m || '';
  }

  const fullName = [alpha?.firstname, alpha?.middlename, alpha?.lastname].filter(Boolean).join(' ');

  const renderRow = (label, value) => (
    <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between' }}>
      <div style={{ opacity: 0.8 }}>{label}</div>
      <div style={{ fontWeight: 600 }}>{(value !== undefined && value !== null && value !== '') ? value : '—'}</div>
    </div>
  );

  const pad2 = (v) => (v === undefined || v === null || v === '' ? '' : String(v).padStart(2, '0'));
  const clcTime = (clcHours || clcMins) ? `${pad2(clcHours)}:${pad2(clcMins)}` : '';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth scroll="paper">
      <DialogTitle sx={{ background: '#161e31', color: '#e5e7eb' }}>Enrollee Information</DialogTitle>
      <DialogContent sx={{ background: '#1e293b', color: '#e5e7eb' }}>
        <Stack spacing={3}>
          {/* Personal Information */}
          <div>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Personal Information</div>
            <Stack spacing={1}>
              {renderRow("Learner's Reference No.", alpha?.learner_ref_no ? `LRN-${alpha.learner_ref_no}` : '—')}
              {renderRow('Status', alpha?.enrollee_status ?? enrollee?.status)}
              {renderRow('Date Enrolled', alpha?.date_enrolled ?? enrollee?.date)}
              {renderRow('Name', fullName || enrollee?.learner)}
              {renderRow('Birthdate', alpha?.birthdate)}
              {renderRow('Gender', alpha?.gender)}
              {renderRow('Mobile No.', alpha?.mobile_no ?? enrollee?.contact)}
              {renderRow('Email', alpha?.email_address)}
              {renderRow('Religion', alpha?.religion)}
              {renderRow('Mother Tongue', alpha?.mother_tongue)}
              {renderRow('Civil Status', alpha?.civil_status)}
            </Stack>
          </div>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />

          {/* Household Status */}
          <div>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Household Status</div>
            <Stack spacing={1}>
              {renderRow('Indigenous Person (IP)?', household?.isIndegenous)}
              {household?.isIndegenous === 'Yes' && renderRow('IP Community', household?.ipCommunityName)}
              {renderRow('4Ps Member?', household?.is4PsMember)}
              {household?.is4PsMember === 'Yes' && renderRow('4Ps Household ID', household?.household_Id_4Ps)}
            </Stack>
          </div>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />

          {/* Address */}
          <div>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Address</div>
            <div style={{ opacity: 0.9, marginBottom: 6 }}>Current Address</div>
            <Stack spacing={1}>
              {renderRow('House No.', address?.cur_house_no)}
              {renderRow('Street', address?.cur_streetname)}
              {renderRow('Barangay', address?.cur_barangay)}
              {renderRow('Municipality', address?.cur_municipality)}
              {renderRow('Province', address?.cur_province)}
              {renderRow('Zip Code', address?.cur_zip_code)}
            </Stack>
            <div style={{ opacity: 0.9, marginTop: 10, marginBottom: 6 }}>Permanent Address</div>
            <Stack spacing={1}>
              {renderRow('House No.', address?.perm_house_no)}
              {renderRow('Street', address?.perm_streetname)}
              {renderRow('Barangay', address?.perm_barangay)}
              {renderRow('Municipality', address?.perm_municipality)}
              {renderRow('Province', address?.perm_province)}
              {renderRow('Zip Code', address?.perm_zip_code)}
            </Stack>
          </div>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />

          {/* Guardian */}
          <div>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Parent's/Guardian's Information</div>
            <div style={{ opacity: 0.9, marginBottom: 6 }}>Father/Guardian</div>
            <Stack spacing={1}>
              {renderRow('Last Name', guardian?.pa_lastname)}
              {renderRow('First Name', guardian?.pa_firstname)}
              {renderRow('Middle Name', guardian?.pa_middlename)}
              {renderRow('Occupation', guardian?.pa_occupation)}
            </Stack>
            <div style={{ opacity: 0.9, marginTop: 10, marginBottom: 6 }}>Mother/Guardian</div>
            <Stack spacing={1}>
              {renderRow('Last Name', guardian?.ma_lastname)}
              {renderRow('First Name', guardian?.ma_firstname)}
              {renderRow('Middle Name', guardian?.ma_middlename)}
              {renderRow('Occupation', guardian?.ma_occupation)}
            </Stack>
          </div>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />

          {/* PWD */}
          <div>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>PWD Information</div>
            <Stack spacing={1}>
              {renderRow('Is PWD?', pwd?.is_pwd)}
              {renderRow('Disabilities', Array.isArray(pwd?.disability_name) ? pwd.disability_name.join(', ') : (pwd?.disability_name ?? '—'))}
              {renderRow('Special Health Problem', pwd?.spec_health_prob)}
              {renderRow('Visual Impairment', pwd?.visual_impairment)}
            </Stack>
          </div>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />

          {/* Education */}
          <div>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Educational Information</div>
            <Stack spacing={1}>
              {renderRow('Last Level Completed', education?.lastLevelCompleted)}
              {renderRow('Reason for not completing', education?.nonCompletionReason)}
              {renderRow('Custom Reason', education?.custom_reason)}
              {renderRow('Has attended ALS?', education?.hasAttendedAls)}
              {renderRow('ALS Program Attended', education?.alsProgramAttended)}
              {renderRow('Has completed ALS?', education?.hasCompletedAls)}
              {renderRow('Reason for not completing ALS', education?.alsNonCompletedReason)}
            </Stack>
          </div>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />

          {/* CLC Accessibility */}
          <div>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>CLC Accessibility</div>
            <Stack spacing={1}>
              {renderRow('Distance (km)', clcKm)}
              {renderRow('Time (hh:mm)', clcTime)}
              {renderRow('Transport Mode', clc?.transport_mode)}
              {renderRow('Mon', clc?.mon)}
              {renderRow('Tue', clc?.tue)}
              {renderRow('Wed', clc?.wed)}
              {renderRow('Thu', clc?.thur)}
              {renderRow('Fri', clc?.fri)}
              {renderRow('Sat', clc?.sat)}
              {renderRow('Sun', clc?.sun)}
            </Stack>
          </div>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ background: '#161e31' }}>
        <Button onClick={onClose} variant="contained" sx={{ backgroundColor: '#3b82f6', color: '#fff', '&:hover': { backgroundColor: '#2563eb' } }}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}






