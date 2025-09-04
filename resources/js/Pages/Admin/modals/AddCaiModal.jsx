import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useForm } from '@inertiajs/react';

export default function AddCaiModal({ open, onClose, clcs = [] }) {
	const { data, setData, post, processing, errors } = useForm({
		// CAI user account (optional)
		email_address: '',
		password: '',
		// CAI profile
		lastname: '', firstname: '', middlename: '', gender: 'Male', assigned_clc: '', status: 'Active'
	});

	const handleSubmit = (e) => {
		e?.preventDefault?.();
		const hasZiggy = typeof route === 'function' && typeof route().has === 'function';
		const url = hasZiggy && route().has('cai.store') ? route('cai.store') : '/admin/cais';
		post(url, { preserveScroll: true, onSuccess: () => onClose?.() });
	};

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
			<DialogTitle>Add CAI</DialogTitle>
			<form onSubmit={handleSubmit}>
				<DialogContent dividers>
					<div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
						<div style={{ fontWeight: 600 }}>Create User Account (role: CAI) — optional</div>
						<TextField label="Email" type="email" value={data.email_address} onChange={(e) => setData('email_address', e.target.value)} size="small" error={!!errors.email_address || !!errors.email} helperText={errors.email_address || errors.email} />
						<TextField label="Password" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} size="small" error={!!errors.password} helperText={errors.password} />

						<div style={{ fontWeight: 600, marginTop: 8 }}>CAI Profile</div>
						<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
							<TextField label="Last Name" value={data.lastname} onChange={(e) => setData('lastname', e.target.value)} required size="small" />
							<TextField label="First Name" value={data.firstname} onChange={(e) => setData('firstname', e.target.value)} required size="small" />
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
						<TextField select label="Status" value={data.status} onChange={(e) => setData('status', e.target.value)} size="small">
							<MenuItem value="Active">Active</MenuItem>
							<MenuItem value="Inactive">Inactive</MenuItem>
						</TextField>
					</div>
				</DialogContent>
				<DialogActions>
					<Button onClick={onClose} disabled={processing}>Cancel</Button>
					<Button type="submit" variant="contained" disabled={processing}>Create</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
}


