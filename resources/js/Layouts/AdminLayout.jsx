import { useState } from 'react';
import AdminSidebar from '@/Components/Admin/AdminSidebar';

export default function AdminLayout({ 
  user, 
  children, 
  title = 'Admin Dashboard',
  selectedSection = 'dashboard',
  onSelectSection = () => {}
}) {
  const [expandedSections, setExpandedSections] = useState(['clc', 'learning']);

  const handleToggleSection = (sectionId) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
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
