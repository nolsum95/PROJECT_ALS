import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { showConfirm, showSuccess, showError, showWarning, showInfo } from '@/Utils/sweetalert';
import UserContent from './UserContent.jsx';
import EnrollmentContent from './EnrollmentContent.jsx';
import ClcList from './Clc/List.jsx';
import ClcCaiList from './Clc/Cai_list.jsx';
import ClcDetails from './Clc/Details.jsx';
import ClcReports from './Clc/Reports.jsx';
import LearnerList from './Learner/Learner_list.jsx';
import AttendanceList from './Attendance/Attendance_list.jsx';
import AdminLayout from '@/Layouts/AdminLayout';
import '../../../css/dashboard.css';
import {
    Person as PersonIcon,
    School as SchoolIcon,
    Assignment as AssignmentIcon,
    Business as BusinessIcon
} from '@mui/icons-material';

export default function AdminDashboard({ auth, stats, flash, users = [], enrollments = {}, lists = {}, section = 'dashboard' }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [expandedSections, setExpandedSections] = useState([section]);
    const [selectedSection, setSelectedSection] = useState(section);

    // Sync sidebar state with section prop on navigation
    useEffect(() => {
        setSelectedSection(section);
        if (["clc-list", "clc-cai-list", "clc-details", "clc-reports"].includes(section)) {
            setExpandedSections(["clc"]);
        } else if (["learner-list", "attendance-list"].includes(section)) {
            setExpandedSections(["learning"]);
        } else if (["dashboard", "users", "enrollments", "modules", "evaluation", "reports"].includes(section)) {
            setExpandedSections([section]);
        }
    }, [section]);

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
            <Head title="Admin Dashboard" />
            <AdminLayout 
                user={auth?.user} 
                title="Admin Dashboard"
                selectedSection={selectedSection}
            >
                {/* Dashboard Content */}
                {(selectedSection === 'dashboard' || !['dashboard','users','enrollments','clc-list','clc-cai-list','clc-details','clc-reports','learner-list','attendance-list','modules','evaluation','reports'].includes(selectedSection)) && (
                    <div className="dashboard-content">
                        <div className="stats-grid">
                            <div className="stat-card" style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '24px' 
                            }}>
                                <div>
                                    <div className="stat-title" style={{ fontSize: '14px', fontWeight: '600', color: '#d1d5db', marginBottom: '8px' }}>
                                        TOTAL USERS
                                    </div>
                                    <div className="stat-number" style={{ fontSize: '32px', fontWeight: 'bold', color: '#ffffff' }}>
                                        {stats?.totalUsers || 18}
                                    </div>
                                    <div className="stat-subtitle" style={{ fontSize: '12px', color: '#9ca3af' }}>
                                        System users
                                    </div>
                                </div>
                                <PersonIcon sx={{ fontSize: 40, color: '#9ca3af' }} />
                            </div>
                            
                            <div className="stat-card">
                                <div className="stat-title">ENROLLMENTS</div>
                                <div className="stat-number">{stats?.enrollments || 22}</div>
                                <div className="stat-subtitle">Pending applications</div>
                            </div>
                            
                            <div className="stat-card">
                                <div className="stat-title">ACTIVE MODULES</div>
                                <div className="stat-number">{stats?.activeModules || 5}</div>
                                <div className="stat-subtitle">Learning content</div>
                            </div>
                            
                            <div className="stat-card">
                                <div className="stat-title">CLCS</div>
                                <div className="stat-number">{stats?.clcs || 0}</div>
                                <div className="stat-subtitle">Learning centers</div>
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
                    <EnrollmentContent enrollments={enrollments} lists={lists} />
                )}

                {/* CLC Management Pages */}
                {selectedSection === 'clc-list' && (
                    <ClcList clcs={lists?.clcs || []} />
                )}
                
                {selectedSection === 'clc-cai-list' && (
                    <ClcCaiList cais={lists?.cais || []} clcs={lists?.clcs || []} />
                )}
                
                {selectedSection === 'clc-details' && (
                    <ClcDetails clcs={lists?.clcs || []} />
                )}
                
                {selectedSection === 'clc-reports' && (
                    <ClcReports clcs={lists?.clcs || []} />
                )}

                {/* Learning Content Pages */}
                {selectedSection === 'learner-list' && (
                    <LearnerList learners={lists?.learners || []} cais={lists?.cais || []} clcs={lists?.clcs || []} />
                )}
                
                {selectedSection === 'attendance-list' && (
                    <AttendanceList learners={lists?.learners || []} />
                )}

                {/* Placeholder sections for future implementation */}
                {selectedSection === 'modules' && (
                    <div className="dashboard-content">
                        <h2>Modules Management</h2>
                        <p>Module management functionality will be implemented here.</p>
                    </div>
                )}
                
                {selectedSection === 'evaluation' && (
                    <div className="dashboard-content">
                        <h2>Evaluation Management</h2>
                        <p>Evaluation management functionality will be implemented here.</p>
                    </div>
                )}
                
                {selectedSection === 'reports' && (
                    <div className="dashboard-content">
                        <h2>Reports</h2>
                        <p>Reports functionality will be implemented here.</p>
                    </div>
                )}
            </AdminLayout>
        </>
    );
}

   