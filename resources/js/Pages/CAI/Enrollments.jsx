import { useMemo, useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Toolbar from '@mui/material/Toolbar';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { router } from '@inertiajs/react';
import CaiLayout from '../../Layouts/CaiLayout';
import EnrolleeInformation from '../Admin/modals/EnrolleeInformation';
import '../../../css/adminTables.css';

export default function Enrollments({ auth, cai, enrollments = {}, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'All');
    const [openInfo, setOpenInfo] = useState(false);
    const [selectedEnrollee, setSelectedEnrollee] = useState(null);
    const [statusUpdating, setStatusUpdating] = useState(new Set());
    const [conflictAlert, setConflictAlert] = useState(null);

    // Derive rows from props
    const rows = useMemo(() => {
        return (enrollments.data || []).map(e => ({
            id: e.id,
            learner: [e.firstname, e.middlename, e.lastname].filter(Boolean).join(' '),
            address: [e.cur_barangay, e.cur_municipality].filter(Boolean).join(', '),
            contact: e.email_address,
            status: e.enrollee_status,
            date: e.date_enrolled,
            alpha: e,
            created_user_id: e.created_user_id,
        }));
    }, [enrollments]);

    const filtered = useMemo(() => {
        let result = rows;
        
        if (search) {
            const searchLower = search.toLowerCase();
            result = result.filter(row => 
                row.learner.toLowerCase().includes(searchLower) ||
                row.address.toLowerCase().includes(searchLower) ||
                (row.contact && row.contact.toLowerCase().includes(searchLower))
            );
        }
        
        if (statusFilter !== 'All') {
            result = result.filter(row => row.status === statusFilter);
        }
        
        return result;
    }, [rows, search, statusFilter]);

    const handleSearch = () => {
        router.get(route('cai.enrollments'), {
            search: search || undefined,
            status: statusFilter !== 'All' ? statusFilter : undefined,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const checkStatusConflict = async (enrollmentId, newStatus) => {
        try {
            const response = await fetch(route('cai.enrollments.getStatus', enrollmentId));
            const data = await response.json();
            
            // Find current status in our local data
            const currentRow = rows.find(row => row.id === enrollmentId);
            if (currentRow && currentRow.status !== data.status) {
                setConflictAlert({
                    message: `Status was changed by another user. Current status: ${data.status}`,
                    enrollmentId: enrollmentId
                });
                return false;
            }
            return true;
        } catch (error) {
            console.error('Error checking status:', error);
            return true; // Allow update if check fails
        }
    };

    const handleStatusChange = async (enrollmentId, newStatus) => {
        setStatusUpdating(prev => new Set([...prev, enrollmentId]));
        
        // Check for conflicts before updating
        const canUpdate = await checkStatusConflict(enrollmentId, newStatus);
        if (!canUpdate) {
            setStatusUpdating(prev => {
                const newSet = new Set(prev);
                newSet.delete(enrollmentId);
                return newSet;
            });
            return;
        }

        router.post(route('cai.enrollments.updateStatus', enrollmentId), {
            status: newStatus
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setStatusUpdating(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(enrollmentId);
                    return newSet;
                });
                setConflictAlert(null);
            },
            onError: () => {
                setStatusUpdating(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(enrollmentId);
                    return newSet;
                });
            }
        });
    };

    const handleViewInfo = (enrollee) => {
        setSelectedEnrollee(enrollee);
        setOpenInfo(true);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Applied': return 'warning';
            case 'Pre-enrolled': return 'info';
            case 'Enrolled': return 'success';
            default: return 'default';
        }
    };

    // Auto-refresh to check for status changes every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ['enrollments'] });
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    return (
        <CaiLayout user={auth.user} cai={cai}>
            <Box sx={{ p: 3 }}>
                <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#1976d2' }}>
                    Enrollment Management
                </Typography>
                
                {conflictAlert && (
                    <Alert 
                        severity="warning" 
                        onClose={() => setConflictAlert(null)}
                        sx={{ mb: 2 }}
                    >
                        {conflictAlert.message}
                    </Alert>
                )}

                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 } }}>
                        <Typography variant="h6" component="div" sx={{ flex: '1 1 100%' }}>
                            Enrollment Applications ({enrollments.total || 0})
                            <Typography variant="caption" display="block" sx={{ color: 'text.secondary' }}>
                                CAI can review and update status only. User creation is Admin-only.
                            </Typography>
                        </Typography>
                        
                        <Stack direction="row" spacing={2} sx={{ minWidth: 400 }}>
                            <TextField
                                size="small"
                                placeholder="Search learners..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                sx={{ minWidth: 200 }}
                            />
                            
                            <TextField
                                select
                                size="small"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                sx={{ minWidth: 120 }}
                            >
                                <MenuItem value="All">All Status</MenuItem>
                                <MenuItem value="Applied">Applied</MenuItem>
                                <MenuItem value="Pre-enrolled">Pre-enrolled</MenuItem>
                                <MenuItem value="Enrolled">Enrolled</MenuItem>
                            </TextField>
                            
                            <IconButton onClick={handleSearch} color="primary">
                                <VisibilityIcon />
                            </IconButton>
                        </Stack>
                    </Toolbar>

                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>Learner Name</TableCell>
                                <TableCell>Address</TableCell>
                                <TableCell>Contact</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Date Applied</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filtered.map((row) => (
                                <TableRow key={row.id} hover>
                                    <TableCell>{row.learner}</TableCell>
                                    <TableCell>{row.address}</TableCell>
                                    <TableCell>{row.contact}</TableCell>
                                    <TableCell>
                                        <TextField
                                            select
                                            size="small"
                                            value={row.status}
                                            onChange={(e) => handleStatusChange(row.id, e.target.value)}
                                            disabled={statusUpdating.has(row.id)}
                                            sx={{ minWidth: 120 }}
                                        >
                                            <MenuItem value="Applied">Applied</MenuItem>
                                            <MenuItem value="Pre-enrolled">Pre-enrolled</MenuItem>
                                            <MenuItem value="Enrolled">Enrolled</MenuItem>
                                        </TextField>
                                    </TableCell>
                                    <TableCell>
                                        {row.date ? new Date(row.date).toLocaleDateString() : 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={1}>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleViewInfo(row.alpha)}
                                                title="View Details"
                                            >
                                                <VisibilityIcon />
                                            </IconButton>
                                            
                                            {row.created_user_id ? (
                                                <Chip
                                                    icon={<LockPersonIcon />}
                                                    label="User Created (Admin)"
                                                    size="small"
                                                    color="success"
                                                    variant="outlined"
                                                />
                                            ) : row.status === 'Enrolled' ? (
                                                <Chip
                                                    label="Awaiting Admin"
                                                    size="small"
                                                    color="warning"
                                                    variant="outlined"
                                                />
                                            ) : null}
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                            
                            {filtered.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                        <Typography variant="body1" color="text.secondary">
                                            No enrollment applications found
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Paper>

                {/* Pagination */}
                {enrollments.links && (
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                        <Stack direction="row" spacing={1}>
                            {enrollments.links.map((link, index) => (
                                <IconButton
                                    key={index}
                                    color={link.active ? 'primary' : 'default'}
                                    size="small"
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url)}
                                >
                                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                </IconButton>
                            ))}
                        </Stack>
                    </Box>
                )}

                {/* Enrollee Information Modal */}
                <EnrolleeInformation
                    open={openInfo}
                    onClose={() => setOpenInfo(false)}
                    enrollee={selectedEnrollee}
                />

            </Box>
        </CaiLayout>
    );
}
