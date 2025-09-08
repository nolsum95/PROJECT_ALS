import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { showConfirm } from '@/Utils/sweetalert';
import Sidebar from '@/Components/Admin/Sidebar.jsx';

export default function AdminLayout({ children, title = 'Admin Dashboard', auth, selectedSection = 'dashboard', onSelectSection }) {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [expandedSections, setExpandedSections] = useState(['learning']);

	const user = auth?.user;

	const toggleSection = (section) => {
		setExpandedSections((prev) =>
			prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
		);
	};

	const handleLogout = async () => {
		const result = await showConfirm('Are you sure you want to logout?', 'Logout Confirmation');
		if (result.isConfirmed) {
			router.post(route('logout'));
		}
	};

	return (
		<div className="admin-container">
			{/* Sidebar */}
			<Sidebar
				user={user}
				selectedSection={selectedSection}
				onSelectSection={onSelectSection ?? (() => {})}
				expandedSections={expandedSections}
				onToggleSection={toggleSection}
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
						>
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
							</svg>
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

import { showConfirm } from '@/Utils/sweetalert';
import Sidebar from '@/Components/Admin/Sidebar.jsx';

export default function AdminLayout({ children, title = 'Admin Dashboard', auth, selectedSection = 'dashboard', onSelectSection }) {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [expandedSections, setExpandedSections] = useState(['learning']);

	const user = auth?.user;

	const toggleSection = (section) => {
		setExpandedSections((prev) =>
			prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
		);
	};

	const handleLogout = async () => {
		const result = await showConfirm('Are you sure you want to logout?', 'Logout Confirmation');
		if (result.isConfirmed) {
			router.post(route('logout'));
		}
	};

	return (
		<div className="admin-container">
			{/* Sidebar */}
			<Sidebar
				user={user}
				selectedSection={selectedSection}
				onSelectSection={onSelectSection ?? (() => {})}
				expandedSections={expandedSections}
				onToggleSection={toggleSection}
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
						>
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
							</svg>
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
