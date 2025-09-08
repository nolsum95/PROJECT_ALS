import { useMemo, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Toolbar from '@mui/material/Toolbar';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import EditDocumentIcon from '@mui/icons-material/EditDocument';
import EnrolleeInformation from './modals/EnrolleeInformation.jsx';
import '../../../css/adminTables.css';
import { router } from '@inertiajs/react';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import EnrolledUser from './modals/EnrolledUser.jsx';

export default function EnrollmentContent({ enrollments = {}, canCreate = false, title = 'Enrollment Management', routes = {} }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [openInfo, setOpenInfo] = useState(false);
  const [selectedEnrollee, setSelectedEnrollee] = useState(null);

  // Track which enrollments already had user accounts created in this session
  const [createdUserIds, setCreatedUserIds] = useState(new Set());

  // Derive rows from props to avoid extra state loops
  const rows = useMemo(() => {
    return (enrollments.data || []).map(e => ({
      id: e.id,
      learner: [e.firstname, e.middlename, e.lastname].filter(Boolean).join(' '),
      address: [e.cur_barangay, e.cur_municipality].filter(Boolean).join(', '),
      contact: e.mobile_no,
      status: e.enrollee_status,
      date: e.date_enrolled,
      alpha: e,
      created_user_id: e.created_user_id,
    }));
  }, [enrollments]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((e) => {
      const hay = `${e.learner ?? ''} ${e.address ?? ''} ${e.contact ?? ''} ${e.status ?? ''} ${e.date ?? ''}`.toLowerCase();
      const matchesQuery = q ? hay.includes(q) : true;
      const matchesStatus = statusFilter === 'All' ? true : ((e.status ?? '').toLowerCase() === statusFilter.toLowerCase());
      return matchesQuery && matchesStatus;
    });
  }, [rows, search, statusFilter]);

  const handlePageChange = (url) => {
    if (url) router.get(url, {}, { preserveState: true, preserveScroll: true });
  };

  // Update Status Dialog
  const [openStatus, setOpenStatus] = useState(false);
  const [statusTargetId, setStatusTargetId] = useState(null);
  const [newStatus, setNewStatus] = useState('Pre-enrolled');

  const openStatusDialog = (row) => {
    setStatusTargetId(row.id);
    setNewStatus(row.status === 'Enrolled' ? 'Enrolled' : 'Pre-enrolled');
    setOpenStatus(true);
  };

  const applyStatus = () => {
    if (!statusTargetId) return;
    const url = route('admin.enrollments.updateStatus', statusTargetId);
    router.post(url, { status: newStatus }, {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        setOpenStatus(false);
        setStatusTargetId(null);
      },
    });
  };

  const [openCreateUser, setOpenCreateUser] = useState(false);
  const [createUserPayload, setCreateUserPayload] = useState(null);

  const handleCreatedUserSuccess = () => {
    const id = createUserPayload?.alpha?.id || createUserPayload?.alpha?.enrollment_id;
    if (id) {
      setCreatedUserIds(prev => {
        const copy = new Set(prev);
        copy.add(id);
        return copy;
      });
    }
  };

  return (
    <div className="dashboard-content">
      <Toolbar sx={{ px: 0, pb: 2, display: 'flex', gap: 2, justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search enrollments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{ sx: { color: '#e5e7eb' } }}
            sx={{ minWidth: 280, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.15)' } }}
          />
          <TextField
            select
            variant="outlined"
            size="small"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            SelectProps={{
              MenuProps: {
                PaperProps: {
                  sx: { backgroundColor: '#161e31ff', color: '#e5e7eb', '& .MuiMenuItem-root': { color: '#e5e7eb' } }
                }
              }
            }}
            sx={{ minWidth: 200, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.15)' }, '& .MuiInputBase-input': { color: '#e5e7eb' } }}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Applied">Applied</MenuItem>
            <MenuItem value="Pre-enrolled">Pre-enrolled</MenuItem>
            <MenuItem value="Enrolled">Enrolled</MenuItem>
          </TextField>
        </Stack>
      </Toolbar>
      <div className="admin-table-container">
        <Table stickyHeader size="medium" aria-label="enrollments table" className="admin-table">
          <TableHead>
            <TableRow>
              <TableCell className="admin-table-header">Enrollees</TableCell>
              <TableCell className="admin-table-header">Address</TableCell>
              <TableCell className="admin-table-header">Contact</TableCell>
              <TableCell className="admin-table-header">Status</TableCell>
              <TableCell className="admin-table-header">Date Enroll</TableCell>
              <TableCell align="right" className="admin-table-header actions">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} style={{ opacity: 0.8 }}>No enrollments found.</TableCell>
              </TableRow>
            )}
            {filtered.map((e) => {
              const showCreateIcon = e.status === 'Enrolled' && !e.created_user_id;
              const showLockIcon = e.status === 'Enrolled' && !!e.created_user_id;
              return (
                <TableRow key={e.id} hover>
                  <TableCell>{e.learner ?? '—'}</TableCell>
                  <TableCell>{e.address ?? '—'}</TableCell>
                  <TableCell>{e.contact ?? '—'}</TableCell>
                  <TableCell>{e.status ?? '—'}</TableCell>
                  <TableCell>{e.date ?? '—'}</TableCell>
                  <TableCell align="right" className="actions">
                    <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
                      <IconButton size="small" sx={{ color: '#93c5fd' }} aria-label="View enrollment" onClick={() => {
                        const payload = {
                          alpha: {
                            learner_ref_no: e.alpha?.learner_ref_no,
                            enrollee_status: e.alpha?.enrollee_status ?? e.status,
                            date_enrolled: e.alpha?.date_enrolled,
                            firstname: e.alpha?.firstname,
                            middlename: e.alpha?.middlename,
                            lastname: e.alpha?.lastname,
                            birthdate: e.alpha?.birthdate,
                            gender: e.alpha?.gender,
                            extension_name: e.alpha?.extension_name,
                            mobile_no: e.alpha?.mobile_no,
                            email_address: e.alpha?.email_address,
                            religion: e.alpha?.religion,
                            mother_tongue: e.alpha?.mother_tongue,
                            civil_status: e.alpha?.civil_status,
                          },
                          address: {
                            cur_house_no: e.alpha?.cur_house_no,
                            cur_streetname: e.alpha?.cur_streetname,
                            cur_barangay: e.alpha?.cur_barangay,
                            cur_municipality: e.alpha?.cur_municipality,
                            cur_province: e.alpha?.cur_province,
                            cur_zip_code: e.alpha?.cur_zip_code,
                            perm_house_no: e.alpha?.perm_house_no,
                            perm_streetname: e.alpha?.perm_streetname,
                            perm_barangay: e.alpha?.perm_barangay,
                            perm_municipality: e.alpha?.perm_municipality,
                            perm_province: e.alpha?.perm_province,
                            perm_zip_code: e.alpha?.perm_zip_code,
                          },
                          guardian: {
                            pa_lastname: e.alpha?.pa_lastname,
                            pa_firstname: e.alpha?.pa_firstname,
                            pa_middlename: e.alpha?.pa_middlename,
                            pa_occupation: e.alpha?.pa_occupation,
                            ma_lastname: e.alpha?.ma_lastname,
                            ma_firstname: e.alpha?.ma_firstname,
                            ma_middlename: e.alpha?.ma_middlename,
                            ma_occupation: e.alpha?.ma_occupation,
                          },
                          education: {
                            lastLevelCompleted: e.alpha?.lastLevelCompleted,
                            nonCompletionReason: e.alpha?.nonCompletionReason,
                            custom_reason: e.alpha?.custom_reason,
                            hasAttendedAls: e.alpha?.hasAttendedAls,
                            alsProgramAttended: e.alpha?.alsProgramAttended,
                            hasCompletedAls: e.alpha?.hasCompletedAls,
                            alsNonCompletedReason: e.alpha?.alsNonCompletedReason,
                          },
                          pwd: {
                            is_pwd: e.alpha?.is_pwd,
                            disability_name: e.alpha?.disability_name,
                            spec_health_prob: e.alpha?.spec_health_prob,
                            visual_impairment: e.alpha?.visual_impairment,
                          },
                          household: {
                            isIndegenous: e.alpha?.isIndegenous,
                            ipCommunityName: e.alpha?.ipCommunityName,
                            is4PsMember: e.alpha?.is4PsMember,
                            household_Id_4Ps: e.alpha?.household_Id_4Ps,
                          },
                          clc: {
                            distance_clc_km: e.alpha?.distance_clc_km,
                            travel_hours_minutes: e.alpha?.travel_hours_minutes,
                            transport_mode: e.alpha?.transport_mode,
                            mon: e.alpha?.mon,
                            tue: e.alpha?.tue,
                            wed: e.alpha?.wed,
                            thur: e.alpha?.thur,
                            fri: e.alpha?.fri,
                            sat: e.alpha?.sat,
                            sun: e.alpha?.sun,
                          }
                        };
                        setSelectedEnrollee(payload);
                        setOpenInfo(true);
                      }}>
                        <VisibilityIcon />
                      </IconButton>
                      {e.status !== 'Enrolled' && (
                        <IconButton size="small" sx={{ color: '#fbbf24' }} aria-label="Update status" onClick={() => openStatusDialog(e)}>
                          <EditDocumentIcon />
                        </IconButton>
                      )}
                      {showCreateIcon && (
                        <IconButton
                          onClick={() => { setCreateUserPayload({ alpha: e.alpha }); setOpenCreateUser(true); }}
                          size="small"
                          sx={{ color: '#22c55e' }}
                          aria-label="Create user account"
                          title="Create user account"
                        >
                          <PersonAddAlt1Icon />
                        </IconButton>
                      )}
                      {showLockIcon && (
                        <IconButton className="lockPerson-icon" size="small" disabled sx={{ color: '#0b5fd6ff', opacity: 1 }} aria-label="Account created">
                          <LockPersonIcon />
                        </IconButton>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      {enrollments && enrollments.last_page > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24, gap: 8 }}>
          <button
            onClick={() => handlePageChange(enrollments.prev_page_url)}
            disabled={!enrollments.prev_page_url}
            style={{ padding: '6px 12px', borderRadius: 4, border: 'none', background: '#334155', color: '#fff', cursor: enrollments.prev_page_url ? 'pointer' : 'not-allowed', opacity: enrollments.prev_page_url ? 1 : 0.5 }}
          >
            Previous
          </button>
          {[...Array(enrollments.last_page)].map((_, idx) => (
            <button
              key={idx + 1}
              onClick={() => handlePageChange(enrollments.links[idx + 1]?.url)}
              disabled={enrollments.current_page === idx + 1}
              style={{
                padding: '6px 12px',
                borderRadius: 4,
                border: enrollments.current_page === idx + 1 ? '2px solid #3b82f6' : '1px solid #334155',
                background: enrollments.current_page === idx + 1 ? '#1e293b' : '#334155',
                color: '#fff',
                fontWeight: enrollments.current_page === idx + 1 ? 700 : 400,
                cursor: enrollments.current_page === idx + 1 ? 'default' : 'pointer',
                opacity: enrollments.current_page === idx + 1 ? 1 : 0.85,
              }}
            >
              {idx + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(enrollments.next_page_url)}
            disabled={!enrollments.next_page_url}
            style={{ padding: '6px 12px', borderRadius: 4, border: 'none', background: '#334155', color: '#fff', cursor: enrollments.next_page_url ? 'pointer' : 'not-allowed', opacity: enrollments.next_page_url ? 1 : 0.5 }}
          >
            Next
          </button>
        </div>
      )}
      <EnrolleeInformation open={openInfo} onClose={() => setOpenInfo(false)} enrollee={selectedEnrollee} />

      {/* Update Status Dialog */}
      <Dialog open={openStatus} onClose={() => setOpenStatus(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Update Enrollee Status</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Status"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            fullWidth
            size="small"
            sx={{ mt: 1 }}
          >
            <MenuItem value="Pre-enrolled">Pre-enrolled</MenuItem>
            <MenuItem value="Enrolled">Enrolled</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenStatus(false)}>Cancel</Button>
          <Button variant="contained" onClick={applyStatus}>Save</Button>
        </DialogActions>
      </Dialog>
      <EnrolledUser open={openCreateUser} onClose={() => setOpenCreateUser(false)} enrollee={createUserPayload} onSuccess={handleCreatedUserSuccess} />
    </div>
  );
}

