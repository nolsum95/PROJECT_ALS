import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import AdminLayout from '@/Layouts/AdminLayout.jsx';

export default function ClcReports({ byClcLearners = {}, byClcCais = {}, byBarangay = {} }) {
  const entries = (obj) => Object.entries(obj || {});

  return (
    <div className="dashboard-content">
      <h2 style={{ marginBottom: 16 }}>CLC Reports</h2>

      <Stack spacing={2}>
        <Paper elevation={0} sx={{ background: 'transparent', p: 2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 2 }}>
          <h3 style={{ marginTop: 0 }}>Learners per CLC</h3>
          {entries(byClcLearners).length === 0 && <div style={{ opacity: 0.8 }}>No data.</div>}
          {entries(byClcLearners).map(([clcId, total]) => (
            <div key={clcId} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
              <span>CLC #{clcId}</span>
              <strong>{total}</strong>
            </div>
          ))}
        </Paper>

        <Paper elevation={0} sx={{ background: 'transparent', p: 2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 2 }}>
          <h3 style={{ marginTop: 0 }}>CAIs per CLC</h3>
          {entries(byClcCais).length === 0 && <div style={{ opacity: 0.8 }}>No data.</div>}
          {entries(byClcCais).map(([clcId, total]) => (
            <div key={clcId} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
              <span>CLC #{clcId}</span>
              <strong>{total}</strong>
            </div>
          ))}
        </Paper>

        <Paper elevation={0} sx={{ background: 'transparent', p: 2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 2 }}>
          <h3 style={{ marginTop: 0 }}>CLCs by Barangay</h3>
          {entries(byBarangay).length === 0 && <div style={{ opacity: 0.8 }}>No data.</div>}
          {entries(byBarangay).map(([barangay, total]) => (
            <div key={barangay} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
              <span>{barangay}</span>
              <strong>{total}</strong>
            </div>
          ))}
        </Paper>
      </Stack>
    </div>
  );
}

ClcReports.layout = (page) => (
  <AdminLayout auth={page.props.auth} selectedSection="clc-reports">{page}</AdminLayout>
);


