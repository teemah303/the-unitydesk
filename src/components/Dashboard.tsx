import React, { useState } from 'react';
import Sidebar from './Sidebar';
import MainContent from './MainContent';

const Dashboard: React.FC = () => {
  const userType = localStorage.getItem('userType') || 'staff';
  const userEmail = localStorage.getItem('userEmail') || 'user@company.com';
  const [currentView, setCurrentView] = useState('dashboard');

  // Simple user data for header
  const userData = {
    profilePhoto: '' // We'll get this from localStorage later
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <Sidebar 
        userType={userType} 
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      
      {/* Main Content Area */}
      <div className="main-content-area">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-content">
            <div className="header-left">
              <div className="logo-small">LOGO</div>
              <h1 className="dashboard-title">
                {currentView === 'dashboard' ? 'Dashboard' : 
                 currentView === 'departments' ? 'Department Management' :
                 currentView === 'department-activities' ? 'My Department' :
                 currentView.charAt(0).toUpperCase() + currentView.slice(1)}
              </h1>
            </div>
            <div className="header-right">
              <span className="user-badge">{userType}</span>
              <span className="user-email">{userEmail}</span>
              <div className="user-avatar">
                {userData.profilePhoto ? (
                  <img src={userData.profilePhoto} alt="Profile" className="avatar-image" />
                ) : (
                  '👤'
                )}
              </div>
              <button 
                className="logout-button"
                onClick={() => {
                  localStorage.clear();
                  window.location.href = '/';
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <MainContent userType={userType} currentView={currentView} userEmail={userEmail} />
      </div>
    </div>
  );
};

export default Dashboard;