import { Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { showConfirm } from '@/Utils/sweetalert';
import Sidebar from '@/Components/Admin/Sidebar.jsx';
import MenuIcon from '@mui/icons-material/Menu';

export default function AdminLayout({ children, title = 'Admin Dashboard', auth, selectedSection = 'dashboard' }) {
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [expandedSections, setExpandedSections] = useState([selectedSection]);
	const [currentSelectedSection, setCurrentSelectedSection] = useState(selectedSection);

	const user = auth?.user;

	// Sync sidebar state with section prop on navigation
	useEffect(() => {
		setCurrentSelectedSection(selectedSection);
		if (["clc-list", "clc-cai-list", "clc-reports"].includes(selectedSection)) {
			setExpandedSections(["clc"]);
		} else if (["learning", "attendance"].includes(selectedSection)) {
			setExpandedSections(["learning"]);
		} else if (["dashboard", "users", "enrollments"].includes(selectedSection)) {
			setExpandedSections([selectedSection]);
		}
	}, [selectedSection]);

	useEffect(() => {
		if (typeof window !== 'undefined') {
			// Open by default on desktop, closed by default on tablet/mobile
			setSidebarOpen(window.innerWidth > 1024);
		}
	}, []);

	const handleLogout = async () => {
		const result = await showConfirm('Are you sure you want to logout?', 'Logout Confirmation');
		if (result.isConfirmed) {
			router.post(route('logout'));
		}
	};

	const containerClass = `admin-container ${sidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`;

	return (
		<div className={containerClass}>
			{/* Sidebar */}
			<Sidebar
				user={user}
				selectedSection={currentSelectedSection}
				onSelectSection={(s) => {
					setCurrentSelectedSection(s);
					// Expand the correct parent section for sub-menus
					if (["clc-list", "clc-cai-list", "clc-reports"].includes(s)) {
						setExpandedSections(["clc"]);
					} else if (["learning", "attendance"].includes(s)) {
						setExpandedSections(["learning"]);
					} else if (["dashboard", "users", "enrollments"].includes(s)) {
						setExpandedSections([s]);
					}
				}}
				expandedSections={expandedSections}
				onToggleSection={(section) => {
					if (expandedSections.includes(section)) {
						setExpandedSections(expandedSections.filter(s => s !== section));
					} else {
						setExpandedSections([section]);
					}
				}}
				sidebarOpen={sidebarOpen}
			/>

			{/* Main Content */}
			<div className="admin-main">
				{/* Header */}
				<header className="admin-header">
					<div className="header-left">
						<button
							className="menu-toggle"
							onClick={() => setSidebarOpen(!sidebarOpen)}
							aria-label="Toggle sidebar"
						>
							<MenuIcon />
						</button>
					</div>

					<div className="header-title">{title}</div>

					<div className="header-right">
						<button className="logout-button" onClick={handleLogout}>
							Logout
						</button>
					</div>
				</header>

				{/* Page Content */}
				<div className="dashboard-content">{children}</div>
			</div>
		</div>
	);
}
