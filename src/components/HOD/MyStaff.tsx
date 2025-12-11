import React, { useState } from 'react';

interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  joinDate: string;
  status: 'active' | 'on-leave' | 'inactive';
  tasksAssigned: number;
  tasksCompleted: number;
  performance: number;
  profilePhoto?: string;
  qualifications: string[];
  skills: string[];
  lastActive: string;
}

const MyStaff: React.FC = () => {
  const [staffMembers, setStaffMembers] = useState<Staff[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@organization.com',
      phone: '+2348123456789',
      position: 'Field Officer',
      department: 'Community and Rural Development',
      joinDate: '2023-05-15',
      status: 'active',
      tasksAssigned: 24,
      tasksCompleted: 19,
      performance: 89,
      qualifications: ['B.Sc. Sociology', 'Project Management'],
      skills: ['Data Analysis', 'Community Engagement', 'Report Writing'],
      lastActive: '2024-02-10'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@organization.com',
      phone: '+2348123456790',
      position: 'Data Analyst',
      department: 'Community and Rural Development',
      joinDate: '2023-07-20',
      status: 'active',
      tasksAssigned: 18,
      tasksCompleted: 16,
      performance: 92,
      qualifications: ['M.Sc. Statistics', 'Data Science'],
      skills: ['Excel', 'SPSS', 'Data Visualization'],
      lastActive: '2024-02-09'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike.johnson@organization.com',
      phone: '+2348123456791',
      position: 'Project Coordinator',
      department: 'Community and Rural Development',
      joinDate: '2023-03-10',
      status: 'on-leave',
      tasksAssigned: 32,
      tasksCompleted: 28,
      performance: 85,
      qualifications: ['MBA', 'Project Management Professional'],
      skills: ['Team Leadership', 'Budget Management', 'Stakeholder Engagement'],
      lastActive: '2024-01-25'
    },
    {
      id: '4',
      name: 'Sarah Williams',
      email: 'sarah.williams@organization.com',
      phone: '+2348123456792',
      position: 'Community Liaison Officer',
      department: 'Community and Rural Development',
      joinDate: '2023-09-05',
      status: 'active',
      tasksAssigned: 15,
      tasksCompleted: 12,
      performance: 78,
      qualifications: ['B.A. Communication', 'Community Development'],
      skills: ['Public Speaking', 'Conflict Resolution', 'Community Mobilization'],
      lastActive: '2024-02-10'
    }
  ]);

  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(staffMembers[0]);
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    qualifications: ''
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'status-active';
      case 'on-leave': return 'status-on-leave';
      default: return 'status-inactive';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return '🟢';
      case 'on-leave': return '🟡';
      default: return '🔴';
    }
  };

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return 'performance-excellent';
    if (performance >= 80) return 'performance-good';
    if (performance >= 70) return 'performance-fair';
    return 'performance-poor';
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleAddStaff = () => {
    if (newStaff.name && newStaff.email && newStaff.position) {
      const staff: Staff = {
        id: Date.now().toString(),
        name: newStaff.name,
        email: newStaff.email,
        phone: newStaff.phone,
        position: newStaff.position,
        department: 'Community and Rural Development',
        joinDate: new Date().toISOString().split('T')[0],
        status: 'active',
        tasksAssigned: 0,
        tasksCompleted: 0,
        performance: 0,
        qualifications: newStaff.qualifications.split(',').map(q => q.trim()),
        skills: [],
        lastActive: new Date().toISOString().split('T')[0]
      };

      setStaffMembers([...staffMembers, staff]);
      setNewStaff({
        name: '',
        email: '',
        phone: '',
        position: '',
        qualifications: ''
      });
      setShowAddStaff(false);
      
      alert(`Staff member ${staff.name} added successfully!\n\n📱 WhatsApp invitation sent to ${staff.phone}`);
    }
  };

  const handleAssignTask = (staffId: string) => {
    const staff = staffMembers.find(s => s.id === staffId);
    if (staff) {
      alert(`Redirecting to task assignment for ${staff.name}...`);
    }
  };

  const handleSendMessage = (staffId: string) => {
    const staff = staffMembers.find(s => s.id === staffId);
    if (staff) {
      alert(`📱 Opening WhatsApp chat with ${staff.name}...`);
    }
  };

  const calculateCompletionRate = (assigned: number, completed: number) => {
    if (assigned === 0) return 0;
    return Math.round((completed / assigned) * 100);
  };

  return (
    <div className="content-section">
      <div className="section-header">
        <div>
          <h2>My Staff</h2>
          <p>Manage your department staff and their performance</p>
        </div>
        <button 
          onClick={() => setShowAddStaff(true)}
          className="btn-primary"
        >
          👥 Add New Staff
        </button>
      </div>

      {/* Add Staff Modal */}
      {showAddStaff && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add New Staff Member</h3>
              <button 
                onClick={() => setShowAddStaff(false)}
                className="close-button"
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    value={newStaff.name}
                    onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                    placeholder="Enter staff full name"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    value={newStaff.email}
                    onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                    placeholder="Enter email address"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={newStaff.phone}
                    onChange={(e) => setNewStaff({...newStaff, phone: e.target.value})}
                    placeholder="+234 800 000 0000"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Position *</label>
                  <select
                    value={newStaff.position}
                    onChange={(e) => setNewStaff({...newStaff, position: e.target.value})}
                    className="form-select"
                  >
                    <option value="">Select position</option>
                    <option value="Field Officer">Field Officer</option>
                    <option value="Data Analyst">Data Analyst</option>
                    <option value="Project Coordinator">Project Coordinator</option>
                    <option value="Community Liaison Officer">Community Liaison Officer</option>
                    <option value="Monitoring & Evaluation Officer">Monitoring & Evaluation Officer</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Qualifications</label>
                <textarea
                  value={newStaff.qualifications}
                  onChange={(e) => setNewStaff({...newStaff, qualifications: e.target.value})}
                  placeholder="Enter qualifications (comma separated)"
                  rows={2}
                  className="form-textarea"
                />
              </div>

              <div className="form-actions">
                <button onClick={handleAddStaff} className="btn-primary">
                  👥 Add Staff Member
                </button>
                <button onClick={() => setShowAddStaff(false)} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Staff Statistics */}
      <div className="staff-stats">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{staffMembers.length}</h3>
            <p>Total Staff</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{staffMembers.filter(s => s.status === 'active').length}</h3>
            <p>Active Staff</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <h3>{staffMembers.reduce((acc, staff) => acc + staff.tasksAssigned, 0)}</h3>
            <p>Total Tasks</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-info">
            <h3>
              {staffMembers.length > 0 
                ? Math.round(staffMembers.reduce((acc, staff) => acc + staff.performance, 0) / staffMembers.length)
                : 0
              }%
            </h3>
            <p>Avg. Performance</p>
          </div>
        </div>
      </div>

      <div className="staff-layout">
        {/* Staff List */}
        <div className="staff-list-column">
          <div className="list-header">
            <h3>Staff Members ({staffMembers.length})</h3>
            <div className="status-filter">
              <button className="filter-btn">All</button>
              <button className="filter-btn">Active</button>
              <button className="filter-btn">On Leave</button>
            </div>
          </div>

          <div className="staff-list">
            {staffMembers.map(staff => (
              <div
                key={staff.id}
                onClick={() => setSelectedStaff(staff)}
                className={`staff-item ${selectedStaff?.id === staff.id ? 'staff-item-active' : ''}`}
              >
                <div className="staff-item-header">
                  <div className="staff-avatar">
                    {staff.profilePhoto ? (
                      <img src={staff.profilePhoto} alt={staff.name} />
                    ) : (
                      <span className="avatar-placeholder">
                        {staff.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="staff-info">
                    <h4>{staff.name}</h4>
                    <p className="staff-position">{staff.position}</p>
                    <div className="staff-status">
                      <span className={`status-indicator ${getStatusColor(staff.status)}`}>
                        {getStatusIcon(staff.status)} {staff.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="staff-stats-mini">
                  <div className="stat-mini">
                    <span className="stat-number">{staff.tasksAssigned}</span>
                    <span className="stat-label">Tasks</span>
                  </div>
                  <div className="stat-mini">
                    <span className="stat-number">{staff.tasksCompleted}</span>
                    <span className="stat-label">Completed</span>
                  </div>
                  <div className="stat-mini">
                    <span className={`stat-number ${getPerformanceColor(staff.performance)}`}>
                      {staff.performance}%
                    </span>
                    <span className="stat-label">Performance</span>
                  </div>
                </div>

                <div className="staff-item-actions">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAssignTask(staff.id);
                    }}
                    className="btn-primary btn-sm"
                  >
                    Assign Task
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSendMessage(staff.id);
                    }}
                    className="btn-whatsapp btn-sm"
                  >
                    📱 Message
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Staff Details */}
        <div className="staff-details-column">
          {selectedStaff ? (
            <div className="staff-details-card">
              <div className="card-header">
                <div className="staff-details-header">
                  <div className="staff-avatar-large">
                    {selectedStaff.profilePhoto ? (
                      <img src={selectedStaff.profilePhoto} alt={selectedStaff.name} />
                    ) : (
                      <span className="avatar-placeholder-large">
                        {selectedStaff.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="staff-header-info">
                    <h3>{selectedStaff.name}</h3>
                    <p className="staff-position-large">{selectedStaff.position}</p>
                    <div className="staff-header-status">
                      <span className={`status-badge-large ${getStatusColor(selectedStaff.status)}`}>
                        {getStatusIcon(selectedStaff.status)} {selectedStaff.status}
                      </span>
                      <span className="staff-email">{selectedStaff.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="staff-details-content">
                {/* Contact Information */}
                <div className="detail-section">
                  <h5>Contact Information</h5>
                  <div className="contact-grid">
                    <div className="contact-item">
                      <span className="contact-label">Email</span>
                      <span className="contact-value">{selectedStaff.email}</span>
                    </div>
                    <div className="contact-item">
                      <span className="contact-label">Phone</span>
                      <span className="contact-value">{selectedStaff.phone}</span>
                    </div>
                    <div className="contact-item">
                      <span className="contact-label">Department</span>
                      <span className="contact-value">{selectedStaff.department}</span>
                    </div>
                    <div className="contact-item">
                      <span className="contact-label">Join Date</span>
                      <span className="contact-value">{formatDate(selectedStaff.joinDate)}</span>
                    </div>
                    <div className="contact-item">
                      <span className="contact-label">Last Active</span>
                      <span className="contact-value">{formatDate(selectedStaff.lastActive)}</span>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="detail-section">
                  <h5>Performance Metrics</h5>
                  <div className="performance-metrics">
                    <div className="metric-item">
                      <span className="metric-label">Tasks Assigned</span>
                      <span className="metric-value">{selectedStaff.tasksAssigned}</span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-label">Tasks Completed</span>
                      <span className="metric-value">{selectedStaff.tasksCompleted}</span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-label">Completion Rate</span>
                      <span className="metric-value">
                        {calculateCompletionRate(selectedStaff.tasksAssigned, selectedStaff.tasksCompleted)}%
                      </span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-label">Performance Score</span>
                      <span className={`metric-value ${getPerformanceColor(selectedStaff.performance)}`}>
                        {selectedStaff.performance}%
                      </span>
                    </div>
                  </div>

                  {/* Progress Bars */}
                  <div className="progress-metrics">
                    <div className="progress-item">
                      <span>Task Completion</span>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ 
                            width: `${calculateCompletionRate(selectedStaff.tasksAssigned, selectedStaff.tasksCompleted)}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="progress-item">
                      <span>Performance</span>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${selectedStaff.performance}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Qualifications & Skills */}
                <div className="detail-section">
                  <h5>Qualifications & Skills</h5>
                  <div className="qualifications-section">
                    <div className="qualifications-list">
                      <h6>Qualifications</h6>
                      <ul>
                        {selectedStaff.qualifications.map((qualification, index) => (
                          <li key={index}>🎓 {qualification}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="skills-list">
                      <h6>Skills</h6>
                      <div className="skills-tags">
                        {selectedStaff.skills.map((skill, index) => (
                          <span key={index} className="skill-tag">{skill}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="staff-actions">
                  <button 
                    onClick={() => handleAssignTask(selectedStaff.id)}
                    className="btn-primary"
                  >
                    🎯 Assign New Task
                  </button>
                  <button 
                    onClick={() => handleSendMessage(selectedStaff.id)}
                    className="btn-whatsapp"
                  >
                    📱 Send Message
                  </button>
                  <button className="btn-secondary">
                    📊 View Performance
                  </button>
                  <button className="btn-secondary">
                    ✏️ Edit Profile
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="staff-details-placeholder">
              <div className="placeholder-content">
                <span className="placeholder-icon">👥</span>
                <h3>Select a Staff Member</h3>
                <p>Click on a staff member from the list to view detailed information</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyStaff;