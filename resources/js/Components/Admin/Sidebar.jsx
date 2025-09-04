import { Link } from '@inertiajs/react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import SummarizeIcon from '@mui/icons-material/Summarize';
import EditNoteIcon from '@mui/icons-material/EditNote';
import ApartmentIcon from '@mui/icons-material/Apartment';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AssessmentIcon from '@mui/icons-material/Assessment';

export default function Sidebar({
	user,
	selectedSection,
	onSelectSection,
	expandedSections,
	onToggleSection,
	sidebarOpen,
}) {
	const displayName = user?.name || (user?.email_address ? user.email_address.split('@')[0] : 'Admin');
	// const displayEmail = user?.email_address || '';

	return (
		<div className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
			<div className="sidebar-header">
				<div className="avatar">{(displayName || 'A').substring(0, 2).toUpperCase()}</div>
				<span className="welcome-text">{displayName}</span>
				{/* <div className=''> <span className="displayed-email">@{displayEmail}</span></div> */}
			</div>

			<nav className="sidebar-nav">
				<div className="nav-section">
					<div
						className={`nav-item ${selectedSection === 'dashboard' ? 'active' : ''}`}
					>
						<Link href={route('admin.dashboard')} className="nav-link" onClick={() => onSelectSection('dashboard')} style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
							<div className="nav-icon"><DashboardIcon fontSize="small" /></div>
							<span className="nav-text">Overview</span>
						</Link>

					</div>
					<Link href={route('admin.dashboard', { section: 'users' })} className="nav-link" style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
						<div className="nav-icon"><GroupIcon fontSize="small" /></div>
						<span className="nav-text">Users</span>
					</Link>



					<div
						className={`nav-item ${selectedSection === 'enrollments' ? 'active' : ''}`}
					>
						<Link href={route('admin.dashboard', { section: 'enrollments' })} className="nav-link" style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
							<div className="nav-icon"><EditNoteIcon fontSize="small" /></div>
							<span className="nav-text">Enrollment</span>
						</Link>
					</div>


					{/* CLC Management */}
					<div
						className={`nav-item ${expandedSections.includes('clc') ? 'expanded' : ''}`}
						onClick={() => onToggleSection('clc')}
					>
						<div className="nav-icon"><ApartmentIcon fontSize="small" /></div>
						<span className="nav-text">CLC Management</span>
						<div className="nav-arrow">›</div>
					</div>
					{expandedSections.includes('clc') && (
						<div className="sub-nav">
							<Link href={route('clc.index')} className={`sub-nav-item`} onClick={() => onSelectSection('clc-list')}>
								<div className="nav-icon"><ApartmentIcon fontSize="small" /></div>
								CLCs
							</Link>
							{/* <Link href={route('clc.index')} className={`sub-nav-item`} onClick={() => onSelectSection('clc-assign')}>
								<div className="nav-icon"><ApartmentIcon fontSize="small" /></div>
								Assign CLC
							</Link> */}
							<Link href={route('cai.index')} className={`sub-nav-item`} onClick={() => onSelectSection('clc-cai-list')}>
								<div className="nav-icon"><GroupIcon fontSize="small" /></div>
								CAIs
							</Link>
							<Link href={route('learner.index')} className={`sub-nav-item`} onClick={() => onSelectSection('clc-learner-list')}>
								<div className="nav-icon"><MenuBookIcon fontSize="small" /></div>
								Learners
							</Link>
							<Link href={route('clc.reports')} className={`sub-nav-item`} onClick={() => onSelectSection('clc-reports')}>
								<div className="nav-icon"><AssessmentIcon fontSize="small" /></div>
								Reports
							</Link>
						</div>
					)}
				</div>

				<div className="nav-section">
					<div
						className={`nav-item ${expandedSections.includes('learning') ? 'expanded' : ''}`}
						onClick={() => onToggleSection('learning')}
					>
						<div className="nav-icon"><MenuBookIcon fontSize="small" /></div>
						<span className="nav-text">Learning Content</span>
						<div className="nav-arrow">›</div>
					</div>
					<div
						className={`nav-item ${selectedSection === 'users' ? 'active' : ''}`}
					>

					</div>
					{/* {expandedSections.includes('learning') && (
						<div className="sub-nav">
							<Link href="#" className="sub-nav-item">
								<div className="nav-icon"><MenuBookIcon fontSize="small" /></div>
								Manage Subjects
							</Link>
							<Link href="#" className="sub-nav-item">
								<div className="nav-icon"><GroupIcon fontSize="small" /></div>
								Assign Subjects (CAIs)
							</Link>
							
						</div>
					)} */}
				</div>

				<div className="nav-section">
					<div className="nav-item">
						<div className="nav-icon"><AssessmentIcon fontSize="small" /></div>
						<span className="nav-text">Evaluation</span>
					</div>

					<div className="nav-item">
						<div className="nav-icon"><SummarizeIcon fontSize="small" /></div>
						<span className="nav-text">Reports</span>
					</div>
				</div>
			</nav>
		</div>
	);
}

