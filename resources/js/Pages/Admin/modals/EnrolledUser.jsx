import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { useEffect, useMemo, useState } from 'react';
import { router } from '@inertiajs/react';

export default function EnrolledUser({ open, onClose, enrollee, onSuccess }) {
  const alpha = enrollee?.alpha ?? enrollee ?? {};
  const clcs = enrollee?.clcs ?? [];
  const cais = enrollee?.cais ?? [];

  const defaultName = useMemo(() => {
    return [alpha?.firstname, alpha?.middlename, alpha?.lastname].filter(Boolean).join(' ');
  }, [alpha]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [assignedClc, setAssignedClc] = useState('');
  const [assignedCai, setAssignedCai] = useState('');

  const filteredCais = useMemo(() => {
    if (!assignedClc) return cais;
    const clcId = Number(assignedClc);
    return (cais || []).filter((c) => Number(c.assigned_clc) === clcId);
  }, [cais, assignedClc]);

  useEffect(() => {
    if (assignedCai && !filteredCais.some((c) => String(c.cai_id) === String(assignedCai))) {
      setAssignedCai('');
    }
  }, [assignedClc]);

  useEffect(() => {
    if (open) {
      setName(defaultName || '');
      setEmail(alpha?.email_address || '');
      setPassword('');
    }
  }, [open, defaultName, alpha?.email_address]);

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
    let out = '';
    for (let i = 0; i < 10; i++) out += chars[Math.floor(Math.random() * chars.length)];
    setPassword(out);
  };

  const handleSubmit = () => {
    if (!alpha?.id && !alpha?.enrollment_id) return;
    setSubmitting(true);
    const enrollmentId = alpha?.id || alpha?.enrollment_id;
    const hasZiggy = typeof route === 'function' && typeof route().has === 'function';
    const url = hasZiggy && route().has('admin.enrollments.createUser')
      ? route('admin.enrollments.createUser', enrollmentId)
      : `/admin/enrollments/${enrollmentId}/create-user`;
    router.post(url, { name, email_address: email, password, assigned_clc: assignedClc || null, assigned_cai: assignedCai || null }, {
      preserveScroll: true,
      onFinish: () => setSubmitting(false),
      onSuccess: () => {
        if (typeof onSuccess === 'function') onSuccess();
        onClose();
      }
    });
  };

  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create User Account</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <TextField select label="Assign CLC (optional)" value={assignedClc} onChange={(e) => setAssignedClc(e.target.value)} size="small">
              <MenuItem value="">None</MenuItem>
              {clcs.map(c => (<MenuItem key={c.clc_id} value={c.clc_id}>{c.clc_name}</MenuItem>))}
            </TextField>
            <TextField select label="Assign CAI (optional)" value={assignedCai} onChange={(e) => setAssignedCai(e.target.value)} size="small" disabled={!!assignedClc && filteredCais.length === 0}>
              <MenuItem value="">None</MenuItem>
              {filteredCais.map(c => (<MenuItem key={c.cai_id} value={c.cai_id}>{[c.firstname, c.middlename, c.lastname].filter(Boolean).join(' ')}</MenuItem>))}
            </TextField>
          </div>
          <TextField label="Full Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth size="small" />
          <TextField label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth size="small" />
          <Stack direction="row" spacing={1} alignItems="center">
            <TextField label="Password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth size="small" />
            <Button onClick={generatePassword} variant="outlined">Generate</Button>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={submitting || !email || !name || !password}>Create & Send</Button>
      </DialogActions>
    </Dialog>
  );
}
