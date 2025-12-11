import React, { useState } from 'react';
import ProfilePhotoUpload from './ProfilePhotoUpload';

interface UserProfileProps {
  userType: string;
  userEmail: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ userType, userEmail }) => {
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: userEmail,
    phone: '+234 812 345 6789',
    department: userType === 'super-admin' ? 'Administration' : 
                userType === 'hod' ? 'Community and Rural Development' : 'Staff Member',
    position: userType === 'super-admin' ? 'State Coordinator' :
              userType === 'hod' ? 'Head of Department' : 'Field Officer',
    joinDate: '2024-01-15',
    profilePhoto: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(userData);

  const handlePhotoUpdate = (photoUrl: string) => {
    setUserData(prev => ({ ...prev, profilePhoto: photoUrl }));
    setEditedData(prev => ({ ...prev, profilePhoto: photoUrl }));
  };

  const handleSave = () => {
    setUserData(editedData);
    setIsEditing(false);
    // In real app, you'd save to backend here
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    setEditedData(userData);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
  };

  const getUserRoleBadge = () => {
    const roles = {
      'super-admin': { text: 'Super Admin', color: 'role-badge-purple' },
      'hod': { text: 'Head of Department', color: 'role-badge-blue' },
      'staff': { text: 'Staff Member', color: 'role-badge-green' }
    };
    return roles[userType as keyof typeof roles] || roles.staff;
  };

  const roleBadge = getUserRoleBadge();

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h2>My Profile</h2>
        <p>Manage your personal information and profile photo</p>
      </div>

      <div className="profile-layout">
        {/* Left Column - Profile Photo */}
        <div className="profile-left">
          <ProfilePhotoUpload 
            currentPhoto={userData.profilePhoto}
            onPhotoUpdate={handlePhotoUpdate}
          />
        </div>

        {/* Right Column - Profile Information */}
        <div className="profile-right">
          <div className="profile-card">
            <div className="card-header">
              <h3>Personal Information</h3>
              <button 
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className={isEditing ? 'btn-primary btn-sm' : 'btn-secondary btn-sm'}
              >
                {isEditing ? '💾 Save Changes' : '✏️ Edit Profile'}
              </button>
            </div>

            <div className="profile-info">
              <div className="info-grid">
                <div className="info-field">
                  <label>Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="edit-input"
                    />
                  ) : (
                    <p className="info-value">{userData.name}</p>
                  )}
                </div>

                <div className="info-field">
                  <label>Email Address</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="edit-input"
                    />
                  ) : (
                    <p className="info-value">{userData.email}</p>
                  )}
                </div>

                <div className="info-field">
                  <label>Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="edit-input"
                    />
                  ) : (
                    <p className="info-value">{userData.phone}</p>
                  )}
                </div>

                <div className="info-field">
                  <label>Department</label>
                  <p className="info-value">{userData.department}</p>
                </div>

                <div className="info-field">
                  <label>Position</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.position}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                      className="edit-input"
                    />
                  ) : (
                    <p className="info-value">{userData.position}</p>
                  )}
                </div>

                <div className="info-field">
                  <label>Join Date</label>
                  <p className="info-value">{userData.joinDate}</p>
                </div>
              </div>

              <div className="role-section">
                <label>Role</label>
                <span className={`role-badge ${roleBadge.color}`}>
                  {roleBadge.text}
                </span>
              </div>

              {isEditing && (
                <div className="edit-actions">
                  <button onClick={handleSave} className="btn-primary">
                    💾 Save Changes
                  </button>
                  <button onClick={handleCancel} className="btn-secondary">
                    ❌ Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="profile-stats">
            <h4>Profile Completion</h4>
            <div className="completion-meter">
              <div className="meter-bar">
                <div 
                  className="meter-fill"
                  style={{ width: userData.profilePhoto ? '100%' : '70%' }}
                ></div>
              </div>
              <span className="completion-text">
                {userData.profilePhoto ? '100% Complete' : '70% Complete'}
              </span>
            </div>
            
            <div className="stats-grid-small">
              <div className="stat-item">
                <span className="stat-number">12</span>
                <span className="stat-label">Tasks</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">5</span>
                <span className="stat-label">Projects</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">89%</span>
                <span className="stat-label">Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;