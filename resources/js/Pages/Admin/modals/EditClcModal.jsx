import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';

export default function EditClcModal({ open, onClose, clc, barangays = [] }) {
	const { data, setData, put, processing, reset, errors } = useForm({ clc_name: '', barangay: '' });

	useEffect(() => {
		if (open && clc) {
			setData({ clc_name: clc.clc_name ?? '', barangay: clc.barangay ?? '' });
		}
	}, [open, clc]);

	const handleSubmit = (e) => {
		e?.preventDefault?.();
		if (!clc) return;
		const hasZiggy = typeof route === 'function' && typeof route().has === 'function';
		const url = hasZiggy && route().has('clc.update') ? route('clc.update', clc.clc_id) : `/admin/clcs/${clc.clc_id}`;
		put(url, {
			preserveScroll: true,
			onSuccess: () => onClose?.(),
		});
	};

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
			<DialogTitle>Edit CLC</DialogTitle>
			<form onSubmit={handleSubmit}>
				<DialogContent dividers>
					<div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
						<TextField label="CLC Name" value={data.clc_name} onChange={(e) => setData('clc_name', e.target.value)} required size="small" error={!!errors.clc_name} helperText={errors.clc_name} />
						<TextField select label="Barangay" value={data.barangay} onChange={(e) => setData('barangay', e.target.value)} required size="small" error={!!errors.barangay} helperText={errors.barangay}>
							{(barangays.length ? barangays : ["Limonda","Tingalan","Bagocboc","Awang","Patag","Poblacion","Luyong Bonbon","Bonbon"]).map((b) => (
								<MenuItem key={b} value={b}>{b}</MenuItem>
							))}
						</TextField>
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


