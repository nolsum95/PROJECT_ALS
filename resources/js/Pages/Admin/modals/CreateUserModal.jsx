import { useForm } from '@inertiajs/react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';

export default function CreateUserModal({ open, onClose, onSuccess }) {
	const { data, setData, post, processing, errors, reset } = useForm({
		name: '',
		email_address: '',
		password: '',
		password_confirmation: '',
		role_type: 'CAI',
	});

	const storeRoute = (() => {
		try { return route('users.store'); } catch { return null; }
	})();

	const handleClose = () => { onClose?.(); reset(); };

	const handleSubmit = (e) => {
		e?.preventDefault?.();
		if (!storeRoute) return;
		post(storeRoute, {
			onSuccess: () => {
				onSuccess?.();
				handleClose();
			},
		});
	};

	return (
		<Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
			<DialogTitle>Create New User</DialogTitle>
			<form onSubmit={handleSubmit}>
				<DialogContent dividers>
					<Stack spacing={2}>
						<TextField label="Name" value={data.name} onChange={(e) => setData('name', e.target.value)} required helperText={errors.name} error={!!errors.name} />
						<TextField label="Email" type="email" value={data.email_address} onChange={(e) => setData('email_address', e.target.value)} required helperText={errors.email_address || errors.email} error={!!errors.email_address || !!errors.email} />
						<TextField label="Password" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} required helperText={errors.password} error={!!errors.password} />
						<TextField label="Confirm Password" type="password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} required helperText={errors.password_confirmation} error={!!errors.password_confirmation} />
						<FormLabel component="legend">Role</FormLabel>
						<RadioGroup row value={data.role_type} onChange={(e) => setData('role_type', e.target.value)}>
							<FormControlLabel value="CAI" control={<Radio />} label="CAI" />
							<FormControlLabel value="Learner" control={<Radio />} label="Learner" />
						</RadioGroup>
					</Stack>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} disabled={processing}>Cancel</Button>
					<Button type="submit" variant="contained" disabled={processing}>Create</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
}








