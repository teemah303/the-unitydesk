import React, { useState } from 'react';

interface HOD {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  departmentCode: string;
  joinDate: string;
  status: 'active' | 'inactive';
  staffCount: number;
  tasksAssigned: number;
  tasksCompleted: number;
  whatsapp: string;
  qualifications: string[];
}

interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
}

const HODManagement: React.FC = () => {
  const [hods, setHods] = useState<HOD[]>([
    {
      id: '1',
      name: 'Dr. Ahmed Musa',
      email: 'ahmed.musa@organization.com',
      phone: '+2348123456701',
      department: 'Community and Rural Development',
      departmentCode: 'CRD',
      joinDate: '2023-01-15',
      status: 'active',
      staffCount: 15,
      tasksAssigned: 45,
      tasksCompleted: 38,
      whatsapp: '+2348123456701',
      qualifications: ['PhD Community Development', 'M.Sc Project Management']
    },
    {
      id: '2',
      name: 'Prof. Grace Okon',
      email: 'grace.okon@organization.com',
      phone: '+2348123456702',
      department: 'Education Department',
      departmentCode: 'EDU',
      joinDate: '2023-03-20',
      status: 'active',
      staffCount: 12,
      tasksAssigned: 32,
      tasksCompleted: 28,
      whatsapp: '+2348123456702',
      qualifications: ['PhD Education', 'M.Ed Administration']
    }
  ]);

  const [departments] = useState<Department[]>([
    {
      id: '1',
      name: 'Community and Rural Development',
      code: 'CRD',
      description: 'Handles community development projects'
    },
    {
      id: '2',
      name: 'Education Department',
      code: 'EDU',
      description: 'Manages educational programs'
    },
    {
      id: '3',
      name: 'Health Services',
      code: 'HLT',
      description: 'Healthcare programs management'
    },
    {
      id: '4',
      name: 'Infrastructure',
      code: 'INF',
      description: 'Infrastructure development projects'
    },
    {
      id: '5',
      name: 'Agriculture',
      code: 'AGR',
      description: 'Agricultural development programs'
    }
  ]);

  const [showCreateHOD, setShowCreateHOD] = useState(false);
  const [newHOD, setNewHOD] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    whatsapp: '',
    qualifications: ''
  });

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'status-active' : 'status-inactive';
  };

  const handleCreateHOD = () => {
    if (newHOD.name && newHOD.email && newHOD.department && newHOD.phone) {
      const selectedDept = departments.find(d => d.id === newHOD.department);
      
      const hod: HOD = {
        id: Date.now().toString(),
        name: newHOD.name,
        email: newHOD.email,
        phone: newHOD.phone,
        department: selectedDept?.name || 'Department',
        departmentCode: selectedDept?.code || 'DEPT',
        joinDate: new Date().toISOString().split('T')[0],
        status: 'active',
        staffCount: 0,
        tasksAssigned: 0,
        tasksCompleted: 0,
        whatsapp: newHOD.whatsapp || newHOD.phone,
        qualifications: newHOD.qualifications.split(',').map(q => q.trim())
      };

      setHods([...hods, hod]);
      setNewHOD({
        name: '',
        email: '',
        phone: '',
        department: '',
        whatsapp: '',
        qualifications: ''
      });
      setShowCreateHOD(false);
      
      alert(`🎉 HOD created successfully!\n\n📱 Login credentials sent to ${hod.phone} via WhatsApp\n\nEmail: ${hod.email}\nDepartment: ${hod.department}`);
    }
  };

  const handleSendCredentials = (hod: HOD) => {
    const message = `🎯 Welcome to Organization Portal!\n\nYour login credentials:\n\n📧 Email: ${hod.email}\n🔑 Temporary Password: Welcome@2024\n🏢 Department: ${hod.department}\n\nPlease change your password after first login.\n\nBest regards,\nSuper Admin`;
    
    alert(`📱 WhatsApp message sent to ${hod.name}:\n\n${message}`);
  };

  const handleDeactivateHOD = (hodId: string) => {
    if (window.confirm('Are you sure you want to deactivate this HOD?')) {
      setHods(hods.map(hod => 
        hod.id === hodId 
          ? { ...hod, status: 'inactive' }
          : hod
      ));
      alert('HOD deactivated successfully!');
    }
  };

  return (
    <div className="content-section">
      <div className="section-header">
        <div>
          <h2>HOD Management</h2>
          <p>Create and manage Heads of Departments</p>
        </div>
        <button 
          onClick={() => setShowCreateHOD(true)}
          className="btn-primary"
        >
          👔 Create New HOD
        </button>
      </div>

      {/* Create HOD Modal */}
      {showCreateHOD && (
        <div className="modal-overlay">
          <div className="modal large-modal">
            <div className="modal-header">
              <h3>Create New Head of Department</h3>
              <button 
                onClick={() => setShowCreateHOD(false)}
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
                    value={newHOD.name}
                    onChange={(e) => setNewHOD({...newHOD, name: e.target.value})}
                    placeholder="Enter HOD full name"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    value={newHOD.email}
                    onChange={(e) => setNewHOD({...newHOD, email: e.target.value})}
                    placeholder="Enter official email address"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    value={newHOD.phone}
                    onChange={(e) => setNewHOD({...newHOD, phone: e.target.value})}
                    placeholder="+234 800 000 0000"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>WhatsApp Number</label>
                  <input
                    type="tel"
                    value={newHOD.whatsapp}
                    onChange={(e) => setNewHOD({...newHOD, whatsapp: e.target.value})}
                    placeholder="+234 800 000 0000"
                    className="form-input"
                  />
                  <small>For notifications (same as phone if left blank)</small>
                </div>

                <div className="form-group">
                  <label>Department *</label>
                  <select
                    value={newHOD.department}
                    onChange={(e) => setNewHOD({...newHOD, department: e.target.value})}
                    className="form-select"
                  >
                    <option value="">Select department</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name} ({dept.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Qualifications</label>
                <textarea
                  value={newHOD.qualifications}
                  onChange={(e) => setNewHOD({...newHOD, qualifications: e.target.value})}
                  placeholder="Enter qualifications (comma separated)"
                  rows={2}
                  className="form-textarea"
                />
              </div>

              <div className="info-box">
                <h5>📋 HOD Privileges:</h5>
                <ul>
                  <li>Create and manage staff in their department only</li>
                  <li>Assign tasks to department staff</li>
                  <li>Approve/reject staff submissions</li>
                  <li>Upload department documents</li>
                  <li>Send WhatsApp notifications</li>
                  <li>View department analytics</li>
                </ul>
              </div>

              <div className="form-actions">
                <button onClick={handleCreateHOD} className="btn-primary">
                  👔 Create HOD Account
                </button>
                <button onClick={() => setShowCreateHOD(false)} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HOD Statistics */}
      <div className="hod-stats">
        <div className="stat-card">
          <div className="stat-icon">👔</div>
          <div className="stat-info">
            <h3>{hods.length}</h3>
            <p>Total HODs</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏢</div>
          <div className="stat-info">
            <h3>{departments.length}</h3>
            <p>Departments</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{hods.reduce((acc, hod) => acc + hod.staffCount, 0)}</h3>
            <p>Total Staff</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{hods.filter(h => h.status === 'active').length}</h3>
            <p>Active HODs</p>
          </div>
        </div>
      </div>

      {/* HOD List */}
      <div className="hod-list">
        <h3>All Heads of Departments</h3>
        
        {hods.length > 0 ? (
          <div className="hod-grid">
            {hods.map(hod => (
              <div key={hod.id} className="hod-card">
                <div className="hod-card-header">
                  <div className="hod-avatar">
                    <span className="avatar-placeholder">
                      {hod.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="hod-info">
                    <h4>{hod.name}</h4>
                    <p className="hod-department">{hod.department} ({hod.departmentCode})</p>
                    <div className="hod-status">
                      <span className={`status-badge ${getStatusColor(hod.status)}`}>
                        {hod.status === 'active' ? '🟢 Active' : '🔴 Inactive'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="hod-details">
                  <div className="detail-item">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{hod.email}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Phone:</span>
                    <span className="detail-value">{hod.phone}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Join Date:</span>
                    <span className="detail-value">{hod.joinDate}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Staff:</span>
                    <span className="detail-value">{hod.staffCount} members</span>
                  </div>
                </div>

                {hod.qualifications.length > 0 && (
                  <div className="hod-qualifications">
                    <strong>Qualifications:</strong>
                    <div className="qualifications-tags">
                      {hod.qualifications.map((qual, index) => (
                        <span key={index} className="qual-tag">🎓 {qual}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="hod-stats-mini">
                  <div className="stat-mini">
                    <span className="stat-number">{hod.tasksAssigned}</span>
                    <span className="stat-label">Tasks Assigned</span>
                  </div>
                  <div className="stat-mini">
                    <span className="stat-number">{hod.tasksCompleted}</span>
                    <span className="stat-label">Tasks Completed</span>
                  </div>
                  <div className="stat-mini">
                    <span className="stat-number">
                      {hod.tasksAssigned > 0 
                        ? Math.round((hod.tasksCompleted / hod.tasksAssigned) * 100)
                        : 0
                      }%
                    </span>
                    <span className="stat-label">Completion Rate</span>
                  </div>
                </div>

                <div className="hod-actions">
                  <button 
                    onClick={() => handleSendCredentials(hod)}
                    className="btn-whatsapp"
                  >
                    📱 Send Credentials
                  </button>
                  <button 
                    onClick={() => handleDeactivateHOD(hod.id)}
                    className={hod.status === 'active' ? 'btn-danger' : 'btn-secondary'}
                  >
                    {hod.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                  <button className="btn-secondary">
                    View Department
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-icon">👔</span>
            <h3>No HODs Created Yet</h3>
            <p>Start by creating your first Head of Department</p>
            <button 
              onClick={() => setShowCreateHOD(true)}
              className="btn-primary"
            >
              Create First HOD
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HODManagement;