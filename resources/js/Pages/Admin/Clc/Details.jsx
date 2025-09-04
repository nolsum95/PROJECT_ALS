import { Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout.jsx';
import { useMemo, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Toolbar from '@mui/material/Toolbar';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';

export default function ClcDetails({ clc, learners = [], filter = {} }) {
  const [selectedCai, setSelectedCai] = useState(filter.cai || '');

  const { data: assignCaiData, setData: setAssignCaiData, post: postAssignCais, processing: processingCai } = useForm({ cai_ids: [] });
  const { data: assignLearnerData, setData: setAssignLearnerData, post: postAssignLearners, processing: processingLearner } = useForm({ items: [] });

  const caiOptions = clc?.cais || [];

  const filteredLearners = useMemo(() => {
    if (!selectedCai) return learners;
    return learners.filter(l => String(l.assigned_cai || '') === String(selectedCai));
  }, [learners, selectedCai]);

  const submitAssignCais = (e) => {
    e.preventDefault();
    postAssignCais(route('clc.assignCais', clc.clc_id), { preserveScroll: true });
  };

  const submitAssignLearners = (e) => {
    e.preventDefault();
    postAssignLearners(route('clc.assignLearners', clc.clc_id), { preserveScroll: true });
  };

  return (
    <div className="dashboard-content">
      <h2 style={{ marginBottom: 16 }}>{clc?.clc_name} — {clc?.barangay}</h2>

      <Paper elevation={0} sx={{ background: 'transparent', mb: 3, p: 2 }}>
        <h3 style={{ margin: 0, marginBottom: 12 }}>Assign CAIs</h3>
        <form onSubmit={submitAssignCais} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <TextField
            select
            label="Select CAIs"
            size="small"
            SelectProps={{ multiple: true }}
            value={assignCaiData.cai_ids}
            onChange={(e) => setAssignCaiData('cai_ids', Array.from(e.target.value))}
            sx={{ minWidth: 280 }}
          >
            {(caiOptions || []).map(c => (
              <MenuItem key={c.cai_id} value={c.cai_id}>{[c.firstname, c.middlename, c.lastname].filter(Boolean).join(' ')}</MenuItem>
            ))}
          </TextField>
          <Button type="submit" variant="contained" disabled={processingCai}>Assign</Button>
        </form>
      </Paper>

      <Paper elevation={0} sx={{ background: 'transparent', mb: 3, p: 2 }}>
        <h3 style={{ margin: 0, marginBottom: 12 }}>Assign Learners</h3>
        <form onSubmit={submitAssignLearners} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <TextField
            label="Learner IDs (comma-separated)"
            size="small"
            value={(assignLearnerData.items || []).map(i => i.learner_id).join(',')}
            onChange={(e) => {
              const ids = e.target.value.split(',').map(x => x.trim()).filter(Boolean).map(v => ({ learner_id: Number(v) }));
              setAssignLearnerData('items', ids);
            }}
            sx={{ minWidth: 280 }}
          />
          <TextField
            select
            label="Assign CAI (optional)"
            size="small"
            value={assignLearnerData.cai || ''}
            onChange={(e) => {
              const cai = e.target.value;
              const items = (assignLearnerData.items || []).map(i => ({ ...i, assigned_cai: cai || null }));
              setAssignLearnerData(prev => ({ ...prev, items }));
            }}
            sx={{ minWidth: 240 }}
          >
            <MenuItem value="">— none —</MenuItem>
            {(caiOptions || []).map(c => (
              <MenuItem key={c.cai_id} value={c.cai_id}>{[c.firstname, c.middlename, c.lastname].filter(Boolean).join(' ')}</MenuItem>
            ))}
          </TextField>
          <Button type="submit" variant="contained" disabled={processingLearner}>Assign</Button>
        </form>
      </Paper>

      <Toolbar sx={{ px: 0, pb: 2, display: 'flex', gap: 12, alignItems: 'center' }}>
        <strong>Filter Learners by CAI:</strong>
        <TextField select size="small" value={selectedCai} onChange={(e) => setSelectedCai(e.target.value)} sx={{ minWidth: 240 }}>
          <MenuItem value="">All CAIs</MenuItem>
          {(caiOptions || []).map(c => (
            <MenuItem key={c.cai_id} value={String(c.cai_id)}>{[c.firstname, c.middlename, c.lastname].filter(Boolean).join(' ')}</MenuItem>
          ))}
        </TextField>
      </Toolbar>

      <div className="admin-table-container">
        <Table stickyHeader size="medium" aria-label="learners table" className="admin-table">
          <TableHead>
            <TableRow>
              <TableCell className="admin-table-header">Learner</TableCell>
              <TableCell className="admin-table-header">CAI</TableCell>
              <TableCell className="admin-table-header">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLearners.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} style={{ opacity: 0.8 }}>No learners found.</TableCell>
              </TableRow>
            )}
            {filteredLearners.map(l => (
              <TableRow key={l.learner_id} hover>
                <TableCell>{l.fullname}</TableCell>
                <TableCell>{l.assigned_cai ?? '—'}</TableCell>
                <TableCell>{l.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

ClcDetails.layout = (page) => (
  <AdminLayout auth={page.props.auth} selectedSection="assign-clc">{page}</AdminLayout>
);


