import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';

export default function EditCaiModal({ open, onClose, cai, clcs = [] }) {
	const { data, setData, put, processing, errors } = useForm({
		lastname: '', firstname: '', middlename: '', gender: 'Male', assigned_clc: ''
	});

	useEffect(() => {
		if (open && cai) {
			setData({
				lastname: cai.lastname ?? '', firstname: cai.firstname ?? '', middlename: cai.middlename ?? '',
				gender: cai.gender ?? 'Male', assigned_clc: cai.assigned_clc ?? ''
			});
		}
	}, [open, cai]);

	const handleSubmit = (e) => {
		e?.preventDefault?.();
		if (!cai) return;
		const hasZiggy = typeof route === 'function' && typeof route().has === 'function';
		const url = hasZiggy && route().has('cai.update') ? route('cai.update', cai.cai_id) : `/admin/cais/${cai.cai_id}`;
		put(url, { preserveScroll: true, onSuccess: () => onClose?.() });
	};

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
			<DialogTitle>Edit CAI</DialogTitle>
			<form onSubmit={handleSubmit}>
				<DialogContent dividers>
					<div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
						<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
							<TextField label="Last Name" value={data.lastname} onChange={(e) => setData('lastname', e.target.value)} required size="small" error={!!errors.lastname} helperText={errors.lastname} />
							<TextField label="First Name" value={data.firstname} onChange={(e) => setData('firstname', e.target.value)} required size="small" error={!!errors.firstname} helperText={errors.firstname} />
						</div>
						<TextField label="Middle Name" value={data.middlename} onChange={(e) => setData('middlename', e.target.value)} size="small" />
						<TextField select label="Gender" value={data.gender} onChange={(e) => setData('gender', e.target.value)} size="small">
							<MenuItem value="Male">Male</MenuItem>
							<MenuItem value="Female">Female</MenuItem>
							<MenuItem value="Others">Others</MenuItem>
						</TextField>
						<TextField select label="Assigned CLC" value={data.assigned_clc} onChange={(e) => setData('assigned_clc', e.target.value)} size="small">
							<MenuItem value="">Unassigned</MenuItem>
							{clcs.map(clc => (<MenuItem key={clc.clc_id} value={clc.clc_id}>{clc.clc_name}</MenuItem>))}
						</TextField>
						{/* <TextField select label="Status" value={data.status} onChange={(e) => setData('status', e.target.value)} size="small">
							<MenuItem value="Active">Active</MenuItem>
							<MenuItem value="Inactive">Inactive</MenuItem>
						</TextField> */}
					</div>
				</DialogContent>
				<DialogActions>
					<Button onClick={onClose} disabled={processing}>Cancel</Button>
					<Button type="submit" variant="contained" disabled={processing}>Save</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
}


