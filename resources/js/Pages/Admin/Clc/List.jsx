import { Link, router, useForm } from '@inertiajs/react';
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
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import EditClcModal from '@/Pages/Admin/modals/EditClcModal.jsx';
import '../../../../css/adminTables.css';
import '../../../../css/clcList.css';

export default function ClcList({ clcs = [] }) {
  const [search, setSearch] = useState('');
  const { data, setData, post, processing } = useForm({ clc_name: '', barangay: '' });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedClc, setSelectedClc] = useState(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (clcs || []).filter(c => `${c.clc_name ?? ''} ${c.barangay ?? ''}`.toLowerCase().includes(q));
  }, [clcs, search]);

  const submit = (e) => {
    e.preventDefault();
    post(route('clc.store'), { preserveScroll: true });
  };

  return (
    <>
    <div className="dashboard-content">
      <Toolbar sx={{ px: 0, pb: 2, display: 'flex', gap: 2, justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search CLCs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{ sx: { color: '#e5e7eb' } }}
            sx={{ minWidth: 280, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.15)' } }}
          />
        </Stack>
      </Toolbar>

      <Paper elevation={0} sx={{ background: 'transparent', mb: 3 }}>
        <form onSubmit={submit} className="clc-add-form" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 8 , color:'white',}}>
          <TextField
            label="CLC Name"
            size="small"
            value={data.clc_name}
            onChange={(e) => setData('clc_name', e.target.value)}
            required
            slotProps={{
              inputLabel: {
                style: { color: '#e5e7eb7d' }, 
              },
            }}
            sx={{ minWidth: 280, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.15)' } }}
          />
          <TextField label="Barangay" 
          size="small" 
          value={data.barangay} 
          onChange={(e) => setData('barangay', e.target.value)} 
           slotProps={{
              inputLabel: {
                style: { color: '#e5e7eb91' }, 
              },
            }}
            sx={{ minWidth: 280, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.15)' } }}
          required />
          <Button type="submit" variant="contained" disabled={processing}>+ Add CLC</Button>
        </form>
      </Paper>

      <div className="admin-table-container">
        <Table stickyHeader size="medium" aria-label="clc table" className="admin-table">
          <TableHead>
            <TableRow>
              <TableCell className="admin-table-header">CLC Name</TableCell>
              <TableCell className="admin-table-header">Barangay</TableCell>
              <TableCell className="admin-table-header">CAIs</TableCell>
              <TableCell className="admin-table-header">Learners</TableCell>
              <TableCell align="right" className="admin-table-header actions">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} style={{ opacity: 0.8 }}>No CLCs found.</TableCell>
              </TableRow>
            )}
            {filtered.map((c) => (
              <TableRow key={c.clc_id} hover>
                <TableCell>{c.clc_name}</TableCell>
                <TableCell>{c.barangay}</TableCell>
                <TableCell>{c.cais_count ?? 0}</TableCell>
                <TableCell>{c.learners_count ?? 0}</TableCell>
                <TableCell align="right" className="actions">
                  <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
                    <IconButton size="small" sx={{ color: '#fbbf24' }} aria-label="Edit CLC" onClick={() => { setSelectedClc(c); setEditModalOpen(true); }}>
                      <EditIcon />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
    <EditClcModal open={editModalOpen} onClose={() => setEditModalOpen(false)} clc={selectedClc} />
    </>
  );
}

ClcList.layout = (page) => (
  <AdminLayout auth={page.props.auth} selectedSection="assign-clc">{page}</AdminLayout>
);



