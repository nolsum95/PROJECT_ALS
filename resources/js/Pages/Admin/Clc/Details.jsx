import { Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout.jsx';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

export default function CaiDetails({ cai }) {
  const learners = cai.learners || [];
  return (
    <div className="dashboard-content">
      <h2 style={{ marginBottom: 16 }}>CAI Details</h2>
      <div className="cai-details" style={{ marginBottom: 24 }}>
        <strong>Name:</strong> {[cai.firstname, cai.middlename, cai.lastname].filter(Boolean).join(' ')}<br />
        <strong>Gender:</strong> {cai.gender}<br />
        <strong>Status:</strong> {cai.status}<br />
        <strong>Assigned CLC:</strong> {cai.clc?.clc_name || '—'}
      </div>
      <h3>Assigned Learners</h3>
      <div className="admin-table-container">
        <Table stickyHeader size="medium" aria-label="learners table" className="admin-table">
          <TableHead>
            <TableRow>
              <TableCell className="admin-table-header">Learner</TableCell>
              <TableCell className="admin-table-header">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {learners.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} style={{ opacity: 0.8 }}>No learners assigned.</TableCell>
              </TableRow>
            )}
            {learners.map(l => (
              <TableRow key={l.learner_id} hover>
                <TableCell>{l.fullname}</TableCell>
                <TableCell>{l.status || '—'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div style={{ marginTop: 24 }}>
        <Link href={route('cai.index')} style={{ color: '#3b82f6' }}>← Back to CAI List</Link>
      </div>
    </div>
  );
}

CaiDetails.layout = (page) => (
  <AdminLayout auth={page.props.auth} selectedSection="clc-cai-list">{page}</AdminLayout>
);


