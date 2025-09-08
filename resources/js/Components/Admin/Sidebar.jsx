import { Link } from '@inertiajs/react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
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
						onClick={() => onSelectSection('dashboard')}
					>
						<div className="nav-icon"><DashboardIcon fontSize="small" /></div>
						<span className="nav-text">Dashboard</span>
					</div>

					<div 
						className={`nav-item ${selectedSection === 'users' ? 'active' : ''}`}
						onClick={() => onSelectSection('users')}
					>
						<div className="nav-icon"><GroupIcon fontSize="small" /></div>
						<span className="nav-text">Users</span>
					</div>

					<div 
						className={`nav-item ${selectedSection === 'enrollments' ? 'active' : ''}`}
						onClick={() => onSelectSection('enrollments')}
					>
						<div className="nav-icon"><EditNoteIcon fontSize="small" /></div>
						<span className="nav-text">Enrollment</span>
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
							<div className={`sub-nav-item ${selectedSection === 'assign-clc' ? 'active' : ''}`} onClick={() => onSelectSection('assign-clc')}>
								<div className="nav-icon"><ApartmentIcon fontSize="small" /></div>
								Assign CLC
							</div>
							<div className={`sub-nav-item ${selectedSection === 'cai-list' ? 'active' : ''}`} onClick={() => onSelectSection('cai-list')}>
								<div className="nav-icon"><GroupIcon fontSize="small" /></div>
								CAI List
							</div>
							<div className={`sub-nav-item ${selectedSection === 'learner-list' ? 'active' : ''}`} onClick={() => onSelectSection('learner-list')}>
								<div className="nav-icon"><MenuBookIcon fontSize="small" /></div>
								Learner List
							</div>
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

					{expandedSections.includes('learning') && (
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
					)}
				</div>

				<div className="nav-section">
					<div className="nav-item">
						<div className="nav-icon"><AssessmentIcon fontSize="small" /></div>
						<span className="nav-text">Evaluation</span>
					</div>

					<div className="nav-item">
						<div className="nav-icon"><AssessmentIcon fontSize="small" /></div>
						<span className="nav-text">Reports</span>
					</div>
				</div>
			</nav>
		</div>
	);
}

