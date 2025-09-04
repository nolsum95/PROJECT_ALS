import { Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout.jsx';
import { useMemo, useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import AddCaiModal from '@/Pages/Admin/modals/AddCaiModal.jsx';
import EditCaiModal from '@/Pages/Admin/modals/EditCaiModal.jsx';
import '../../../../css/adminTables.css';

export default function CaiList({ cais = [], clcs = [], caiUsers = [] }) {
	const [search, setSearch] = useState('');
	const [addOpen, setAddOpen] = useState(false);
	const [editOpen, setEditOpen] = useState(false);
	const [editing, setEditing] = useState(null);


	const list = useMemo(() => {
		const q = search.trim().toLowerCase();
		return (cais || []).filter(c => `${c.lastname ?? ''} ${c.firstname ?? ''} ${c.middlename ?? ''} ${c.gender ?? ''} ${c.status ?? ''}`.toLowerCase().includes(q));
	}, [cais, search]);

	const openAdd = () => { setAddOpen(true); };

	const openEdit = (row) => { setEditing(row); setEditOpen(true); };

	return (
		<>
			<div className="dashboard-content">
				<div style={{ display: 'flex', gap: 12, justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
					<input type="text" placeholder="Search CAIs..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ minWidth: 280, background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#e5e7eb', borderRadius: 8, padding: '8px 10px' }} />
					<Button variant="contained" onClick={openAdd}>+ Add CAI</Button>
				</div>
				<div className="admin-table-container">
					<table className="admin-table" aria-label="cai table">
						<thead>
							<tr>
								<TableCell className="admin-table-header">Name</TableCell>
								<TableCell className="admin-table-header">Gender</TableCell>
								<TableCell className="admin-table-header">Assigned CLC</TableCell>
								<TableCell className="admin-table-header">Learners</TableCell>
								<TableCell className="admin-table-header">Status</TableCell>
								<TableCell className="admin-table-header actions">Actions</TableCell>
							</tr>
						</thead>
						<tbody>
							{list.length === 0 && (
								<tr><td colSpan={6} style={{ opacity: 0.8 }}>No CAIs found.</td></tr>
							)}
							{list.map(c => (
								<tr key={c.cai_id}>
									<TableCell>{[c.firstname, c.middlename, c.lastname].filter(Boolean).join(' ')}</TableCell>
									<TableCell>{c.gender ?? '—'}</TableCell>
									<TableCell>{c.clc?.clc_name ?? '—'}</TableCell>
									<TableCell>{c.learners_count ?? 0}</TableCell>
									<TableCell>{c.status ?? '—'}</TableCell>
									<TableCell className="actions" style={{ whiteSpace: 'nowrap' }}>
										<IconButton size="small" component={Link} href={route('cai.show', c.cai_id)} sx={{ color: '#93c5fd' }} aria-label="View details"><VisibilityIcon fontSize="small" /></IconButton>
										<IconButton size="small" sx={{ color: '#fbbf24' }} aria-label="Edit CAI" onClick={() => openEdit(c)}><EditIcon fontSize="small" /></IconButton>
									</TableCell>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			<AddCaiModal open={addOpen} onClose={() => setAddOpen(false)} clcs={clcs} />

			<EditCaiModal open={editOpen} onClose={() => setEditOpen(false)} cai={editing} clcs={clcs} />
		</>
	);
}

CaiList.layout = (page) => (
	<AdminLayout auth={page.props.auth} selectedSection="clc-cai-list">{page}</AdminLayout>
);


