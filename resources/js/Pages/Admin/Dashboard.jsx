import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { showConfirm, showSuccess, showError, showWarning, showInfo } from '@/Utils/sweetalert';
import UserContent from './UserContent.jsx';
import EnrollmentContent from './EnrollmentContent.jsx';
import Sidebar from '@/Components/Admin/Sidebar.jsx';
import MenuIcon from '@mui/icons-material/Menu';

export default function AdminDashboard({ auth, stats, flash, users = [], enrollments = {} }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const initialSection = typeof window !== 'undefined' && window.location.hash ? window.location.hash.replace('#','') : 'dashboard';
    const [expandedSections, setExpandedSections] = useState(['dashboard']);
    const [selectedSection, setSelectedSection] = useState(initialSection);

    const user = auth?.user;

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Open by default on desktop, closed by default on tablet/mobile
            setSidebarOpen(window.innerWidth > 1024);
        }
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const hash = selectedSection ? `#${selectedSection}` : '#dashboard';
            if (window.location.hash !== hash) {
                history.replaceState(null, '', hash);
            }
        }
    }, [selectedSection]);

    // Handle flash messages
    useEffect(() => {
        if (flash?.success) {
            showSuccess(flash.success);
        }
        if (flash?.error) {
            showError(flash.error);
        }
        if (flash?.warning) {
            showWarning(flash.warning);
        }
        if (flash?.info) {
            showInfo(flash.info);
        }
    }, [flash]);

    const toggleSection = (section) => {
        if (section === 'dashboard') {
            setExpandedSections(['dashboard']);
            setSelectedSection('dashboard');
        } else {
            setExpandedSections(prev => 
                prev.includes(section) 
                    ? prev.filter(s => s !== section)
                    : [...prev, section]
            );
        }
    };

    const handleLogout = async () => {
        const result = await showConfirm('Are you sure you want to logout?', 'Logout Confirmation');
        if (result.isConfirmed) {
            router.post(route('logout'));
        }
    };

    const getRoute = (name, param) => {
        try {
            if (typeof route === 'function' && typeof route().has === 'function' && route().has(name)) {
                return param !== undefined ? route(name, param) : route(name);
            }
        } catch (e) {}
        return null;
    };

    const containerClass = `admin-container ${sidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`;

    return (
        <>
          
            <div className={containerClass}>
                {/* Sidebar */}
                <Sidebar
                    user={user}
                    selectedSection={selectedSection}
                    onSelectSection={(s) => setSelectedSection(s)}
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
                                aria-label="Toggle sidebar"
                            >
                                <MenuIcon />
                            </button>
                        </div>
                        
                        
                        
                        <div className="header-right">
                            <button className="logout-button" onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    </header>
                    
                    {/* Dashboard Content */}
                    {selectedSection === 'dashboard' && (
                        <div className="dashboard-content">
                            <div className="welcome-card">
                                <h1 className="welcome-title">Welcome to Admin Dashboard</h1>
                                <p className="welcome-subtitle">Manage your ALS Center operations from here.</p>
                            </div>
                            
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <div className="stat-title">Total Users</div>
                                    <div className="stat-number">{stats?.totalUsers || 0}</div>
                                </div>
                                
                                <div className="stat-card">
                                    <div className="stat-title">Enrollments</div>
                                    <div className="stat-number">{stats?.enrollments || 0}</div>
                                </div>
                                
                                <div className="stat-card">
                                    <div className="stat-title">Active Modules</div>
                                    <div className="stat-number">{stats?.activeModules || 0}</div>
                                </div>
                                
                                <div className="stat-card">
                                    <div className="stat-title">CLC Management</div>
                                    <div className="stat-number">{stats?.clcs || 0}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Users Content */}
                    {selectedSection === 'users' && (
                        <UserContent 
                            users={users}
                            canCreate={!!getRoute('users.create')}
                            routes={{
                                create: getRoute('users.create') || undefined,
                                show: (id) => getRoute('users.show', id),
                                edit: (id) => getRoute('users.edit', id),
                            }}
                        />
                    )}

                    {/* Enrollments Content */}
                    {selectedSection === 'enrollments' && (
                        <EnrollmentContent enrollments={enrollments} />
                    )}
                </div>
            </div>
        </>
    );
}

   