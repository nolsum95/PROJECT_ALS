import { Head, Link, router, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Toolbar from '@mui/material/Toolbar';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import CreateUserModal from './modals/CreateUserModal.jsx';
import EditUserModal from './modals/EditUserModal.jsx';
import '../../../css/adminTables.css';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';


export default function UserContent({ users = {}, canCreate = true, title = 'User Management', routes = {} }) {
	const [search, setSearch] = useState('');
	const [roleFilter, setRoleFilter] = useState('All');
	const [openCreate, setOpenCreate] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);

	const list = Array.isArray(users) ? users : (users?.data || []);

	const filtered = useMemo(() => {
		const q = search.trim().toLowerCase();
		return list.filter((u) => {
			const hay = `${u.name ?? ''} ${u.email_address ?? ''} ${u.role_type ?? ''}`.toLowerCase();
			const matchesQuery = q ? hay.includes(q) : true;
			const matchesRole = roleFilter === 'All' ? true : ((u.role_type ?? '').toLowerCase() === roleFilter.toLowerCase());
			return matchesQuery && matchesRole;
		});
	}, [list, search, roleFilter]);

	const handleOpenCreate = () => setOpenCreate(true);
	const handleCloseCreate = () => setOpenCreate(false);

	const handlePageChange = (url) => {
		if (url) router.get(url, {}, { preserveState: true, preserveScroll: true });
	};

	return (
		<div className="dashboard-content">
			<Paper elevation={0} sx={{ background: 'transparent' }}>
				<Toolbar sx={{ px: 0, pb: 2, display: 'flex', gap: 2, justifyContent: 'space-between', flexWrap: 'wrap' }}>
					<Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
						<TextField
							variant="outlined"
							size="small"
							placeholder="Search users..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							InputProps={{ sx: { color: '#e5e7eb' } }}
							 sx={{ minWidth: 280, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.15)' } }}
						/>
						<TextField
							select
							
							variant="outlined"
							size="small"
							value={roleFilter}
							onChange={(e) => setRoleFilter(e.target.value)}
							SelectProps={{
								MenuProps: {
									PaperProps: {
										sx: { backgroundColor: '#161e31ff', color: '#e5e7eb', '& .MuiMenuItem-root': { color: '#e5e7eb' } }
									}
								}
							}}
							sx={{ minWidth: 160, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.15)' }, '& .MuiInputBase-input': { color: '#e5e7eb' } }}
						>
							<MenuItem value="All">All</MenuItem>
							<MenuItem value="CAI">CAI</MenuItem>
							<MenuItem value="Learner">Learner</MenuItem>
						</TextField>
					</Stack>
					<Button
						variant="contained"
						sx={{ backgroundColor: '#22c55e', '&:hover': { backgroundColor: '#16a34a' } }}
						onClick={handleOpenCreate}
					>
						+ New User
					</Button>
				</Toolbar>

				<div className="admin-table-container">
					<Table stickyHeader size="medium" aria-label="users table" className="admin-table">
						<TableHead>
							<TableRow>
								<TableCell className="admin-table-header">Name</TableCell>
								<TableCell className="admin-table-header">Email</TableCell>
								<TableCell className="admin-table-header">Role</TableCell>
								<TableCell align="right" className="admin-table-header actions">Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{filtered.length === 0 && (
								<TableRow>
									<TableCell colSpan={4} style={{ opacity: 0.8 }}>No users found.</TableCell>
								</TableRow>
							)}
							{filtered.map((u) => {
								const showHref = typeof routes.show === 'function' ? routes.show(u.user_id) : routes.show;
								return (
									<TableRow key={u.user_id} hover>
										<TableCell>{u.name ?? (u.email_address ? u.email_address.split('@')[0] : '—')}</TableCell>
										<TableCell>{u.email_address ?? '—'}</TableCell>
										<TableCell>{u.role_type ?? '—'}</TableCell>
										<TableCell align="right" className="actions">
											<Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
												{showHref ? (
													<IconButton component={Link} href={showHref} size="small" sx={{ color: '#93c5fd' }} aria-label="View user">
														<VisibilityIcon />
													</IconButton>
												) : (
													<IconButton size="small" disabled sx={{ opacity: 0.6 }} aria-label="View user">
														<VisibilityIcon />
													</IconButton>
												)}
												<IconButton size="small" sx={{ color: '#fbbf24' }} aria-label="Edit user" onClick={() => { setSelectedUser(u); setOpenEdit(true); }}>
													<EditIcon />
												</IconButton>
											</Stack>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</div>
			</Paper>

			{/* Pagination Controls when users is paginated */}
			{users && users.last_page > 1 && (
				<div style={{ display: 'flex', justifyContent: 'center', marginTop: 24, gap: 8 }}>
					<button onClick={() => handlePageChange(users.prev_page_url)} disabled={!users.prev_page_url} style={{ padding: '6px 12px', borderRadius: 4, border: 'none', background: '#334155', color: '#fff', cursor: users.prev_page_url ? 'pointer' : 'not-allowed', opacity: users.prev_page_url ? 1 : 0.5 }}>Previous</button>
					{[...Array(users.last_page)].map((_, idx) => (
						<button key={idx + 1} onClick={() => handlePageChange(users.links[idx + 1]?.url)} disabled={users.current_page === idx + 1} style={{ padding: '6px 12px', borderRadius: 4, border: users.current_page === idx + 1 ? '2px solid #3b82f6' : '1px solid #334155', background: users.current_page === idx + 1 ? '#1e293b' : '#334155', color: '#fff', fontWeight: users.current_page === idx + 1 ? 700 : 400, cursor: users.current_page === idx + 1 ? 'default' : 'pointer', opacity: users.current_page === idx + 1 ? 1 : 0.85 }}>{idx + 1}</button>
					))}
					<button onClick={() => handlePageChange(users.next_page_url)} disabled={!users.next_page_url} style={{ padding: '6px 12px', borderRadius: 4, border: 'none', background: '#334155', color: '#fff', cursor: users.next_page_url ? 'pointer' : 'not-allowed', opacity: users.next_page_url ? 1 : 0.5 }}>Next</button>
				</div>
			)}

			<CreateUserModal open={openCreate} onClose={handleCloseCreate} onSuccess={() => {}} />
			<EditUserModal open={openEdit} onClose={() => setOpenEdit(false)} user={selectedUser} onSuccess={() => {}} />
		</div>
	);
}

		