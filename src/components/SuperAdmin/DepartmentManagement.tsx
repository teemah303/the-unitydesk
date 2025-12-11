import React, { useState } from 'react';
import NotificationManager from '../NotificationManager';

interface Department {
  id: string;
  name: string;
  description: string;
  code: string;
  staffCount: number;
}

interface Activity {
  id: string;
  title: string;
  description: string;
  department: string;
  type: string;
  documents: Document[];
}

interface Document {
  id: string;
  name: string;
  type: string;
  uploadedBy: string;
  uploadDate: string;
  size: string;
}

const DepartmentManagement: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: '1',
      name: 'Community and Rural Development',
      description: 'Handles community development projects and rural initiatives',
      code: 'CRD',
      staffCount: 15
    },
    {
      id: '2', 
      name: 'Education Department',
      description: 'Manages educational programs and school initiatives',
      code: 'EDU',
      staffCount: 12
    },
    {
      id: '3',
      name: 'Health Services',
      description: 'Healthcare programs and medical services',
      code: 'HLT',
      staffCount: 20
    }
  ]);

  const [activities] = useState<Activity[]>([
    {
      id: '1',
      title: 'Relief Materials Distribution',
      description: 'Distribution of relief items to flood victims',
      department: '1',
      type: 'relief',
      documents: [
        {
          id: 'doc1',
          name: 'List of Beneficiaries.xlsx',
          type: 'excel',
          uploadedBy: 'HOD CRD',
          uploadDate: '2024-01-15',
          size: '2.4 MB'
        },
        {
          id: 'doc2',
          name: 'Relief Items Inventory.pdf',
          type: 'pdf',
          uploadedBy: 'HOD CRD',
          uploadDate: '2024-01-15',
          size: '1.8 MB'
        }
      ]
    }
  ]);

  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAddDepartment, setShowAddDepartment] = useState(false);
  const [newDepartment, setNewDepartment] = useState({
    name: '',
    description: '',
    code: ''
  });

  // ADD DEPARTMENT FUNCTIONALITY
  const handleAddDepartment = () => {
    if (newDepartment.name && newDepartment.description && newDepartment.code) {
      const department: Department = {
        id: Date.now().toString(),
        name: newDepartment.name,
        description: newDepartment.description,
        code: newDepartment.code.toUpperCase(),
        staffCount: 0
      };

      setDepartments([...departments, department]);
      setNewDepartment({ name: '', description: '', code: '' });
      setShowAddDepartment(false);
      alert('Department added successfully! 🎉');
    }
  };

  const getDepartmentActivities = (departmentId: string) => {
    return activities.filter(activity => activity.department === departmentId);
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'excel': return '📊';
      case 'word': return '📝';
      case 'image': return '🖼️';
      default: return '📎';
    }
  };

  return (
    <div className="content-section">
      <div className="section-header">
        <h2>Department Management</h2>
        <div className="header-actions">
          <button 
            onClick={() => setShowAddDepartment(true)}
            className="btn-primary"
          >
            ➕ Add New Department
          </button>
          <button
            onClick={() => setShowNotifications(true)}
            className="btn-whatsapp"
          >
            📱 Send Notification
          </button>
        </div>
      </div>

      {/* Add Department Modal */}
      {showAddDepartment && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add New Department</h3>
              <button 
                onClick={() => setShowAddDepartment(false)}
                className="close-button"
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Department Name</label>
                <input
                  type="text"
                  value={newDepartment.name}
                  onChange={(e) => setNewDepartment({...newDepartment, name: e.target.value})}
                  placeholder="e.g., Community Development"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Department Code</label>
                <input
                  type="text"
                  value={newDepartment.code}
                  onChange={(e) => setNewDepartment({...newDepartment, code: e.target.value})}
                  placeholder="e.g., CRD"
                  className="form-input"
                  maxLength={5}
                />
                <small>Short code (3-5 characters)</small>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newDepartment.description}
                  onChange={(e) => setNewDepartment({...newDepartment, description: e.target.value})}
                  placeholder="Describe the department's purpose and responsibilities..."
                  rows={4}
                  className="form-textarea"
                />
              </div>

              <div className="form-actions">
                <button onClick={handleAddDepartment} className="btn-primary">
                  ➕ Create Department
                </button>
                <button onClick={() => setShowAddDepartment(false)} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Notification Modal */}
      {showNotifications && (
        <div className="modal-overlay">
          <div className="modal large-modal">
            <div className="modal-header">
              <h3>Send WhatsApp Notifications</h3>
              <button 
                onClick={() => setShowNotifications(false)}
                className="close-button"
              >
                ×
              </button>
            </div>
            <NotificationManager 
              userType="super-admin"
              onSendNotification={(message) => {
                console.log('Notification sent:', message);
                setShowNotifications(false);
              }}
            />
          </div>
        </div>
      )}

      <div className="department-layout">
        {/* Departments List */}
        <div className="department-column">
          <h3>Departments ({departments.length})</h3>
          <div className="card-list">
            {departments.map((dept) => (
              <div
                key={dept.id}
                onClick={() => {
                  setSelectedDepartment(dept);
                  setSelectedActivity(null);
                }}
                className={`card ${selectedDepartment?.id === dept.id ? 'card-active' : ''}`}
              >
                <div className="card-header">
                  <h4>{dept.name}</h4>
                  <span className="card-icon">🏢</span>
                </div>
                <p className="card-description">{dept.description}</p>
                <div className="card-tags">
                  <span className="tag">Code: {dept.code}</span>
                  <span className="tag">Staff: {dept.staffCount}</span>
                </div>
                <div className="card-actions">
                  <button className="btn-edit">✏️ Edit</button>
                  <button className="btn-delete">🗑️ Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activities List */}
        <div className="department-column">
          <h3>
            {selectedDepartment ? `${selectedDepartment.name} Activities` : 'Select a Department'}
          </h3>
          
          {selectedDepartment ? (
            <div className="card-list">
              {getDepartmentActivities(selectedDepartment.id).map((activity) => (
                <div
                  key={activity.id}
                  onClick={() => setSelectedActivity(activity)}
                  className={`card ${selectedActivity?.id === activity.id ? 'card-active' : ''}`}
                >
                  <div className="card-header">
                    <h4>{activity.title}</h4>
                    <span className="card-icon">
                      {activity.type === 'relief' ? '🆘' : '🏗️'}
                    </span>
                  </div>
                  <p className="card-description">{activity.description}</p>
                  <div className="card-tags">
                    <span className="tag tag-relief">{activity.type}</span>
                    <span className="tag">
                      {activity.documents.length} documents
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-icon">📂</span>
              <p>Select a department to view activities</p>
            </div>
          )}
        </div>

        {/* Documents List */}
        <div className="department-column">
          <h3>
            {selectedActivity ? `${selectedActivity.title} Documents` : 'Select an Activity'}
          </h3>
          
          {selectedActivity ? (
            <div className="card-list">
              {selectedActivity.documents.map((doc) => (
                <div key={doc.id} className="card document-card">
                  <div className="document-header">
                    <span className="document-icon">{getDocumentIcon(doc.type)}</span>
                    <div className="document-info">
                      <h4>{doc.name}</h4>
                      <div className="document-meta">
                        <span>By: {doc.uploadedBy}</span>
                        <span>{doc.uploadDate}</span>
                        <span>{doc.size}</span>
                      </div>
                    </div>
                  </div>
                  <div className="document-actions">
                    <button className="btn-icon">👁️ View</button>
                    <button className="btn-icon">📥 Download</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-icon">📄</span>
              <p>{selectedDepartment ? 'Select an activity to view documents' : 'Select a department first'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepartmentManagement;