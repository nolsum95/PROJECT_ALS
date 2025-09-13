import { Link } from '@inertiajs/react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import SummarizeIcon from '@mui/icons-material/Summarize';
import EditNoteIcon from '@mui/icons-material/EditNote';
import ApartmentIcon from '@mui/icons-material/Apartment';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ArticleIcon from '@mui/icons-material/Article';
import PeopleIcon from '@mui/icons-material/People';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';




export default function Sidebar({
	user,
	selectedSection,
	onSelectSection,
	expandedSections,
	onToggleSection,
	sidebarOpen,
}) {
	const displayName = user?.name || (user?.email_address ? user.email_address.split('@')[0] : 'Admin');
	

	// Only handle expansion/collapse on main section header click
	const handleToggleSection = (section) => {
		if (expandedSections.includes(section)) {
			onToggleSection(section);
		} else {
			// Collapse all others, expand only this
			onToggleSection(section, true);
		}
	};

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
						<Link href={route('admin.dashboard')} className="nav-link">
							<div className="nav-icon"><DashboardIcon fontSize="small" /></div>
							<span className="nav-text">Overview</span>
						</Link>

					</div>
					<div
						className={`nav-item ${selectedSection === 'users' ? 'active' : ''}`}
					>
						<Link href={route('admin.dashboard', { section: 'users' })} className="nav-link">
							<div className="nav-icon"><ManageAccountsIcon fontSize="small" /></div>
							<span className="nav-text">Users</span>
						</Link>
					</div>
					<div
						className={`nav-item ${selectedSection === 'enrollments' ? 'active' : ''}`}
					>
						<Link href={route('admin.dashboard', { section: 'enrollments' })} className="nav-link">
							<div className="nav-icon"><EditNoteIcon fontSize="small" /></div>
							<span className="nav-text">Enrollment</span>
						</Link>
					</div>


					{/* CLC Management */}
					<div
						className={`nav-item nav-link ${expandedSections.includes('clc') ? 'expanded' : ''}`}
						onClick={() => handleToggleSection('clc')}
					>
						<div className="nav-icon"><ApartmentIcon fontSize="small" /></div>
						<span className="nav-text">CLC Management</span>
						<div className="nav-arrow">›</div>
					</div>
					{expandedSections.includes('clc') && (
						<div className="sub-nav">
							<Link href={route('clc.index')} className={`sub-nav-item ${selectedSection === 'clc-list' ? 'active' : ''}`}>
								<div className="nav-icon"><ApartmentIcon fontSize="small" /></div>
								CLCs
							</Link>

							<Link href={route('cai.index')} className={`sub-nav-item ${selectedSection === 'clc-cai-list' ? 'active' : ''}`}>
								<div className="nav-icon"><GroupIcon fontSize="small" /></div>
								CAIs
							</Link>
						</div>
					)}

					<div className="nav-section">
						<div
							className={`nav-item nav-link ${expandedSections.includes('learning') ? 'expanded' : ''}`}
							onClick={() => handleToggleSection('learning')}
						>
							<div className="nav-icon"><MenuBookIcon fontSize="small" /></div>
							<span className="nav-text">Learning Content</span>
							<div className="nav-arrow">›</div>
						</div>
						{expandedSections.includes('learning') && (
							<div className="sub-nav">
								<Link href={route('learner.index')} className={`sub-nav-item ${selectedSection === 'learning' ? 'active' : ''}`}>
									<div className="nav-icon"><PeopleIcon	 fontSize="small" /></div>
									Learners
								</Link>
								<Link href={route('attendance.index')} className={`sub-nav-item ${selectedSection === 'attendance' ? 'active' : ''}`}>
									<div className="nav-icon"><EventAvailableIcon fontSize="small" /></div>
									Attendance
								</Link>

							</div>
						)}
					</div>
					<div className="nav-item nav-link">
						<div className="nav-icon"><ArticleIcon fontSize="small" /></div>
						<span className="nav-text">Modules</span>
					</div>
					<div className="nav-item nav-link">
						<div className="nav-icon"><AssessmentIcon fontSize="small" /></div>
						<span className="nav-text">Evaluation</span>
					</div>
					<div className="nav-item nav-link">
						<div className="nav-icon"><SummarizeIcon fontSize="small" /></div>
						<span className="nav-text">Reports</span>
					</div>
				</div>
			</nav>
		</div>
	);
}

