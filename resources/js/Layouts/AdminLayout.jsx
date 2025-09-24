import { useState } from 'react';
import AdminSidebar from '@/Components/Admin/AdminSidebar';

export default function AdminLayout({ 
  user, 
  children, 
  title = 'Admin Dashboard',
  selectedSection = 'dashboard',
  onSelectSection = () => {}
}) {
  const [expandedSections, setExpandedSections] = useState({
    assessments: false // Start with assessments collapsed
  });

  const handleToggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  return (
    <AdminSidebar
      user={user}
      selectedSection={selectedSection}
      onSelectSection={onSelectSection}
      expandedSections={expandedSections}
      onToggleSection={handleToggleSection}
    >
      {children}
    </AdminSidebar>
  );
}
