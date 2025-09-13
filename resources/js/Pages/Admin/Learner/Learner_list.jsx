import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout.jsx';
import { useMemo, useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import TableCell from '@mui/material/TableCell';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import '../../../../css/adminTables.css';

export default function LearnerList({ learners = [], cais = [], clcs = [], filters = {} }) {
	const [search, setSearch] = useState('');
	const [filterCai, setFilterCai] = useState(filters.cai || '');
	const [filterClc, setFilterClc] = useState(filters.clc || '');

	const list = useMemo(() => {
		const q = search.trim().toLowerCase();
		return (learners || []).filter(l => {
			const hay = `${l.fullname ?? ''} ${l.status ?? ''} ${l.cai ? `${l.cai.firstname ?? ''} ${l.cai.lastname ?? ''}` : ''} ${l.clc?.clc_name ?? ''}`.toLowerCase();
			return q ? hay.includes(q) : true;
		});
	}, [learners, search]);

	const applyFilters = () => {
		const hasZiggy = typeof route === 'function' && typeof route().has === 'function';
		const url = hasZiggy && route().has('learner.index') ? route('learner.index', { cai: filterCai || undefined, clc: filterClc || undefined }) : `/admin/learners?${new URLSearchParams({ cai: filterCai, clc: filterClc }).toString()}`;
		router.get(url, {}, { preserveState: true, preserveScroll: true });
	};

	const handleStatusChange = (learnerId, newStatus) => {
		router.post(route('learners.updateStatus', learnerId), {
			status: newStatus,
		}, {
			preserveState: true,
			preserveScroll: true,
		});
	};

	return (
		<div className="dashboard-content">
			<div className="learner-page-filters">
				<input type="text" placeholder="Search learners..." value={search} onChange={(e) => setSearch(e.target.value)} className="search-filter" />
				<div className="learner-filters">
					<TextField select className="filter" size="small" label="By CAI" value={filterCai} onChange={(e) => setFilterCai(e.target.value)}
						slotProps={{
							inputLabel: {
								style: { color: '#e5e7eb91' },
							},
						}}
					>

						<MenuItem value="">All CAIs</MenuItem>
						<MenuItem value="unassigned">Unassigned</MenuItem>
						{cais.map(c => (<MenuItem key={c.cai_id} value={c.cai_id}>{[c.firstname, c.middlename, c.lastname].filter(Boolean).join(' ')}</MenuItem>))}

					</TextField>
					<TextField select className="filter" size="small" label="By CLC" value={filterClc} onChange={(e) => setFilterClc(e.target.value)}
						slotProps={{
							inputLabel: {
								style: { color: '#e5e7eb91' },
							},
						}}
					>
						<MenuItem value="">All CLCs</MenuItem>
						{clcs.map(c => (<MenuItem key={c.clc_id} value={c.clc_id}>{c.clc_name}</MenuItem>))}
					</TextField>
				<button onClick={applyFilters} className="apply-btn">Apply</button>
				</div>
				
				
			</div>
			<div className="admin-table-container">
				<table className="admin-table" aria-label="learner table">
					<thead>
						<tr>
							<TableCell className="admin-table-header">Fullname</TableCell>
							<TableCell className="admin-table-header">Assigned CAI</TableCell>
							<TableCell className="admin-table-header">Assigned CLC</TableCell>
							<TableCell className="admin-table-header">Status</TableCell>
							<TableCell className="admin-table-header actions">Actions</TableCell>
						</tr>
					</thead>
					<tbody>
						{list.length === 0 && (<tr><td colSpan={5} style={{ opacity: 0.8 }}>No learners found.</td></tr>)}
						{list.map(l => (
							<tr key={l.learner_id}>
								<TableCell>{l.fullname ?? '\u2014'}</TableCell>
								<TableCell>{l.cai ? [l.cai.firstname, l.cai.middlename, l.cai.lastname].filter(Boolean).join(' ') : '\u2014'}</TableCell>
								<TableCell>{l.clc?.clc_name ?? '\u2014'}</TableCell>
								<TableCell>
									<FormControl size="small" sx={{ minWidth: 120 }}>
										<Select
											value={l.status || ''}
											onChange={(e) => handleStatusChange(l.learner_id, e.target.value)}
											displayEmpty
											sx={{
												color: '#e5e7eb',
												'& .MuiOutlinedInput-notchedOutline': {
													borderColor: 'rgba(255, 255, 255, 0)',
												},
												'&:hover .MuiOutlinedInput-notchedOutline': {
													borderColor: 'rgba(255, 255, 255, 0)',
												},
												'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
													borderColor: 'transparent',
												},
											}}
										>
											<MenuItem value="Active">Active</MenuItem>
											<MenuItem value="Inactive">Inactive</MenuItem>
										</Select>
									</FormControl>
								</TableCell>
								<TableCell className="actions" style={{ whiteSpace: 'nowrap' }}>
									<IconButton size="small" component={Link} href="#" sx={{ color: '#93c5fd' }} aria-label="View details"><VisibilityIcon fontSize="small" /></IconButton>
								</TableCell>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

LearnerList.layout = (page) => (
	<AdminLayout auth={page.props.auth} selectedSection="clc-learner-list">{page}</AdminLayout>
);
