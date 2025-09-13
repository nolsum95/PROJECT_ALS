import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout.jsx';
import { useMemo, useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import '../../../../css/adminTables.css';

export default function AttendanceList({ attendances = [], learners = [], cais = [], clcs = [], filters = {} }) {
	const [search, setSearch] = useState('');
	const [filterLearner, setFilterLearner] = useState(filters.learner || '');
	const [filterCai, setFilterCai] = useState(filters.cai || '');
	const [filterClc, setFilterClc] = useState(filters.clc || '');
	const [filterDate, setFilterDate] = useState(filters.date || '');

	const list = useMemo(() => {
		const q = search.trim().toLowerCase();
		return (attendances?.data || []).filter(a => {
			const hay = `${a.learner?.fullname ?? ''} ${a.cai ? [a.cai.firstname, a.cai.middlename, a.cai.lastname].filter(Boolean).join(' ') : ''} ${a.clc?.clc_name ?? ''} ${a.status ?? ''}`.toLowerCase();
			return q ? hay.includes(q) : true;
		});
	}, [attendances, search]);

	const applyFilters = () => {
		const hasZiggy = typeof route === 'function' && typeof route().has === 'function';
		const url = hasZiggy && route().has('attendance.index') ? route('attendance.index', { 
			learner: filterLearner || undefined, 
			cai: filterCai || undefined, 
			clc: filterClc || undefined,
			date: filterDate || undefined
		}) : `/admin/attendance?${new URLSearchParams({ 
			learner: filterLearner, 
			cai: filterCai, 
			clc: filterClc,
			date: filterDate
		}).toString()}`;
		router.get(url, {}, { preserveState: true, preserveScroll: true });
	};

	const handleStatusChange = (attendanceId, newStatus) => {
		router.put(route('attendance.update', attendanceId), {
			status: newStatus,
		}, {
			preserveState: true,
			preserveScroll: true,
		});
	};

	const handleDelete = (attendanceId) => {
		if (confirm('Are you sure you want to delete this attendance record?')) {
			router.delete(route('attendance.destroy', attendanceId), {
				preserveState: true,
				preserveScroll: true,
			});
		}
	};

	return (
		<div className="dashboard-content">
			<div style={{ display: 'flex', gap: 12, justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
				<input type="text" placeholder="Search attendance..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ minWidth: 280, background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#e5e7eb', borderRadius: 8, padding: '8px 10px' }} />
				<div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
					<TextField 
						select 
						size="small" 
						label="Filter by Learner" 
						value={filterLearner} 
						onChange={(e) => setFilterLearner(e.target.value)}
						sx={{ minWidth: 150 }}
					>
						<MenuItem value="">All Learners</MenuItem>
						{learners.map(l => (<MenuItem key={l.learner_id} value={l.learner_id}>{l.fullname}</MenuItem>))}
					</TextField>
					<TextField 
						select 
						size="small" 
						label="Filter by CAI" 
						value={filterCai} 
						onChange={(e) => setFilterCai(e.target.value)}
						sx={{ minWidth: 150 }}
					>
						<MenuItem value="">All CAIs</MenuItem>
						{cais.map(c => (<MenuItem key={c.cai_id} value={c.cai_id}>{[c.firstname, c.middlename, c.lastname].filter(Boolean).join(' ')}</MenuItem>))}
					</TextField>
					<TextField 
						select 
						size="small" 
						label="Filter by CLC" 
						value={filterClc} 
						onChange={(e) => setFilterClc(e.target.value)}
						sx={{ minWidth: 150 }}
					>
						<MenuItem value="">All CLCs</MenuItem>
						{clcs.map(c => (<MenuItem key={c.clc_id} value={c.clc_id}>{c.clc_name}</MenuItem>))}
					</TextField>
					<TextField 
						type="date"
						size="small" 
						 
						value={filterDate} 
						onChange={(e) => setFilterDate(e.target.value)}
						sx={{ minWidth: 150 }}
					/>
					<button onClick={applyFilters} style={{ padding: '8px 12px', border: 'none', borderRadius: 8, background: '#3b82f6', color: '#fff' }}>Apply</button>
				</div>
			</div>
			<div className="admin-table-container">
				<table className="admin-table" aria-label="attendance table">
					<thead>
						<tr>
							<TableCell className="admin-table-header">Date</TableCell>
							<TableCell className="admin-table-header">Learner</TableCell>
							<TableCell className="admin-table-header">CAI</TableCell>
							<TableCell className="admin-table-header">CLC</TableCell>
							<TableCell className="admin-table-header">Status</TableCell>
							<TableCell className="admin-table-header">Remarks</TableCell>
							<TableCell className="admin-table-header actions">Actions</TableCell>
						</tr>
					</thead>
					<tbody>
						{list.length === 0 && (<tr><td colSpan={7} style={{ opacity: 0.8 }}>No attendance records found.</td></tr>)}
						{list.map(a => (
							<tr key={a.attendance_id}>
								<TableCell>{new Date(a.attendance_date).toLocaleDateString()}</TableCell>
								<TableCell>{a.learner?.fullname ?? '—'}</TableCell>
								<TableCell>{a.cai ? [a.cai.firstname, a.cai.middlename, a.cai.lastname].filter(Boolean).join(' ') : '—'}</TableCell>
								<TableCell>{a.clc?.clc_name ?? '—'}</TableCell>
								<TableCell>
									<FormControl size="small" sx={{ minWidth: 120 }}>
										<Select
											value={a.status || ''}
											onChange={(e) => handleStatusChange(a.attendance_id, e.target.value)}
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
											<MenuItem value="Present">Present</MenuItem>
											<MenuItem value="Absent">Absent</MenuItem>
											<MenuItem value="Excused">Excused</MenuItem>
										</Select>
									</FormControl>
								</TableCell>
								<TableCell>{a.remarks ?? '—'}</TableCell>
								<TableCell className="actions" style={{ whiteSpace: 'nowrap' }}>
									<IconButton size="small" sx={{ color: '#fbbf24' }} aria-label="Edit attendance">
										<EditIcon fontSize="small" />
									</IconButton>
									<IconButton size="small" sx={{ color: '#ef4444' }} aria-label="Delete attendance" onClick={() => handleDelete(a.attendance_id)}>
										<DeleteIcon fontSize="small" />
									</IconButton>
								</TableCell>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

AttendanceList.layout = (page) => (
	<AdminLayout auth={page.props.auth} selectedSection="attendance">{page}</AdminLayout>
);
