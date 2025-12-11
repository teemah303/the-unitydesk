import React from 'react';
import DepartmentManagement from './SuperAdmin/DepartmentManagement';
import DepartmentActivities from './HOD/DepartmentActivities';
import UserProfile from './UserProfile';
import StaffTasks from './Staff/StaffTasks';
import LogoManagement from './SuperAdmin/LogoManagement';
import TaskAssignment from './TaskAssignment';
import MyProjects from './Staff/MyProjects';
import MyDocuments from './Staff/MyDocuments';
import MyStaff from './HOD/MyStaff';
import HODManagement from './SuperAdmin/HODManagement';

interface MainContentProps {
  userType: string;
  currentView: string;
  userEmail: string;
}

const MainContent: React.FC<MainContentProps> = ({ userType, currentView, userEmail }) => {
  // Dashboard Content
  const renderDashboard = () => (
    <div className="content-section">
      <div className="welcome-section">
        <h2>Welcome back! 👋</h2>
        <p>You're logged in as: <strong>{userType}</strong></p>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-info">
              <h3>12</h3>
              <p>Active Tasks</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🏢</div>
            <div className="stat-info">
              <h3>8</h3>
              <p>Departments</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>24</h3>
              <p>Team Members</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>45</h3>
              <p>Completed</p>
            </div>
          </div>
        </div>
      </div>

      <div className="recent-activities">
        <h3>Recent Activities</h3>
        <div className="activities-list">
          <div className="activity-item">
            <span className="activity-icon">🆕</span>
            <div className="activity-details">
              <p><strong>New project assigned</strong> - Community Development</p>
              <span className="activity-time">2 hours ago</span>
            </div>
          </div>
          
          <div className="activity-item">
            <span className="activity-icon">📝</span>
            <div className="activity-details">
              <p><strong>Document uploaded</strong> - Project Proposal.pdf</p>
              <span className="activity-time">5 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render content based on current view and user type
  const renderContent = () => {
    // Dashboard is common for all users
    if (currentView === 'dashboard') {
      return renderDashboard();
    }

    // Super Admin Views
    if (userType === 'super-admin') {
      switch (currentView) {
        case 'departments':
          return <DepartmentManagement />;
        case 'logo-settings':
          return <LogoManagement />;
        case 'all-projects':
          return (
            <div className="content-section">
              <h2>All Projects</h2>
              <p>Overview of all projects across departments.</p>
            </div>
          );
          case 'hod-management':
  return <HODManagement />;
        case 'staff-roll':
          return (
            <div className="content-section">
              <h2>Staff Nominal Roll</h2>
              <p>Complete staff database and management.</p>
            </div>
          );
        default:
          return (
            <div className="content-section">
              <h2>Coming Soon! 🚀</h2>
              <p>The <strong>{currentView}</strong> feature is under development.</p>
            </div>
          );
      }
    }

    // HOD Views
    if (userType === 'hod') {
      switch (currentView) {
        case 'department-activities':
          return <DepartmentActivities />;
        case 'task-assignment':
          return <TaskAssignment />;
        case 'my-staff':
          return (
            <div className="content-section">
              <h2>My Staff</h2>
              <p>Manage staff in your department.</p>
            </div>
          );
          // Update the HOD section:
case 'my-staff':
  return <MyStaff />;
        case 'documents':
          return (
            <div className="content-section">
              <h2>Department Documents</h2>
              <p>All documents for your department.</p>
            </div>
          );
        default:
          return (
            <div className="content-section">
              <h2>Coming Soon! 🚀</h2>
              <p>The <strong>{currentView}</strong> feature is under development.</p>
            </div>
          );
      }
    }

    // Staff Views (default)
    switch (currentView) {
      case 'my-tasks':
        return <StaffTasks />;
      case 'profile':
        return <UserProfile userType={userType} userEmail={userEmail} />;
      case 'projects':
        return (
          <div className="content-section">
            <h2>My Projects</h2>
            <p>Projects you are involved in.</p>
          </div>
        );
        // Update the staff section:
case 'projects':
  return <MyProjects />;
case 'documents':
  return <MyDocuments />;

      case 'documents':
        return (
          <div className="content-section">
            <h2>My Documents</h2>
            <p>Documents related to your tasks.</p>
          </div>
        );
      default:
        return (
          <div className="content-section">
            <h2>Coming Soon! 🚀</h2>
            <p>The <strong>{currentView}</strong> feature is under development.</p>
          </div>
        );
    }
  };

  return (
    <main className="main-content">
      {renderContent()}
    </main>
  );
};

export default MainContent;