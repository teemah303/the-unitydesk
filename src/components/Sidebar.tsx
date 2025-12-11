import React from 'react';

interface SidebarProps {
  userType: string;
  currentView: string;
  onViewChange: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ userType, currentView, onViewChange }) => {
  const superAdminMenu = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'departments', name: 'Departments', icon: '🏢' },
    { id: 'all-projects', name: 'All Projects', icon: '📋' },
    { id: 'staff-roll', name: 'Staff Roll', icon: '👥' },
    { id: 'hod-management', name: 'HOD Management', icon: '👔' }, 
    { id: 'logo-settings', name: 'Logo Settings', icon: '🎨' }
  ];

  const hodMenu = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'department-activities', name: 'My Department', icon: '🏢' },
    { id: 'my-staff', name: 'My Staff', icon: '👥' },
    { id: 'projects', name: 'Projects', icon: '📋' },
    { id: 'task-assignment', name: 'Task Assignment', icon: '🎯' },
    { id: 'documents', name: 'Documents', icon: '📁' }
  ];

  const staffMenu = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'my-tasks', name: 'My Tasks', icon: '✅' },
    { id: 'projects', name: 'Projects', icon: '📋' },
    { id: 'documents', name: 'Documents', icon: '📁' },
    { id: 'profile', name: 'Profile', icon: '👤' }
  ];
  

  const getMenu = (type: string) => {
    switch (type) {
      case 'super-admin': return superAdminMenu;
      case 'hod': return hodMenu;
      default: return staffMenu;
    }
  };

  const menuItems = getMenu(userType);

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Navigation</h2>
      </div>
      
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item) => (
            <li key={item.id} className="nav-item">
              <button 
                onClick={() => onViewChange(item.id)}
                className={`nav-button ${currentView === item.id ? 'nav-button-active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Quick Stats */}
      <div className="sidebar-stats">
        <div className="stats-card">
          <h3>Quick Stats</h3>
          <div className="stats-list">
            <div className="stat">
              <span>Tasks</span>
              <strong>12</strong>
            </div>
            <div className="stat">
              <span>Projects</span>
              <strong>5</strong>
            </div>
            <div className="stat">
              <span>Completed</span>
              <strong>8</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;