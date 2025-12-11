import React, { useState } from 'react';
import DocumentUpload from '../DocumentUpload';

// Add this interface at the top
interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  uploadedBy: string;
  url?: string;
}

// Update the Activity interface
interface Activity {
  id: string;
  title: string;
  description: string;
  type: string;
  documents: Document[];
  createdAt: string;
  createdBy: string;
}

const DepartmentActivities: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: '1',
      title: 'Relief Materials Distribution',
      description: 'Distribution of relief items to flood victims in rural areas',
      type: 'relief',
      documents: [
        {
          id: 'doc1',
          name: 'List of Beneficiaries.xlsx',
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          size: '2.4 MB',
          uploadDate: '2024-01-15',
          uploadedBy: 'HOD CRD'
        }
      ],
      createdAt: '2024-01-10',
      createdBy: 'HOD CRD'
    }
  ]);

  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(activities[0]);
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [newActivity, setNewActivity] = useState({
    title: '',
    description: '',
    type: 'relief'
  });

  const handleAddActivity = () => {
    if (newActivity.title && newActivity.description) {
      const activity: Activity = {
        id: Date.now().toString(),
        title: newActivity.title,
        description: newActivity.description,
        type: newActivity.type,
        documents: [],
        createdAt: new Date().toISOString().split('T')[0],
        createdBy: 'HOD CRD'
      };

      setActivities([...activities, activity]);
      setNewActivity({ title: '', description: '', type: 'relief' });
      setIsAddingActivity(false);
    }
  };

  const handleDocumentsUpdate = (documents: Document[]) => {
    if (selectedActivity) {
      const updatedActivities = activities.map(activity =>
        activity.id === selectedActivity.id 
          ? { ...activity, documents }
          : activity
      );
      setActivities(updatedActivities);
      setSelectedActivity({ ...selectedActivity, documents });
    }
  };

  const getDocumentIcon = (type: string) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('spreadsheet') || type.includes('excel')) return '📊';
    if (type.includes('word') || type.includes('document')) return '📝';
    if (type.includes('image')) return '🖼️';
    return '📎';
  };

  return (
    <div className="content-section">
      <div className="section-header">
        <div>
          <h2>Department Activities</h2>
          <p>Manage activities for Community and Rural Development</p>
        </div>
        <button
          onClick={() => setIsAddingActivity(true)}
          className="btn-primary"
        >
          <span className="btn-icon">➕</span>
          Add Activity
        </button>
      </div>

      {/* Add Activity Modal */}
      {isAddingActivity && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New Activity</h3>
            
            <div className="form-group">
              <label>Activity Title</label>
              <input
                type="text"
                value={newActivity.title}
                onChange={(e) => setNewActivity({...newActivity, title: e.target.value})}
                placeholder="Enter activity title"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={newActivity.description}
                onChange={(e) => setNewActivity({...newActivity, description: e.target.value})}
                rows={3}
                placeholder="Describe the activity"
              />
            </div>

            <div className="form-group">
              <label>Activity Type</label>
              <select
                value={newActivity.type}
                onChange={(e) => setNewActivity({...newActivity, type: e.target.value})}
              >
                <option value="relief">Relief</option>
                <option value="community">Community</option>
                <option value="development">Development</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-actions">
              <button onClick={handleAddActivity} className="btn-primary">
                Add Activity
              </button>
              <button onClick={() => setIsAddingActivity(false)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="activities-layout">
        {/* Activities List */}
        <div className="activities-column">
          <h3>All Activities</h3>
          <div className="card-list">
            {activities.map((activity) => (
              <div
                key={activity.id}
                onClick={() => {
                  setSelectedActivity(activity);
                  setShowDocumentUpload(false);
                }}
                className={`card ${selectedActivity?.id === activity.id ? 'card-active' : ''}`}
              >
                <div className="card-header">
                  <div>
                    <h4>{activity.title}</h4>
                    <span className={`tag tag-${activity.type}`}>
                      {activity.type}
                    </span>
                  </div>
                  <span className="card-icon">
                    {activity.type === 'relief' ? '🆘' : '🏗️'}
                  </span>
                </div>
                <p className="card-description">{activity.description}</p>
                <div className="card-footer">
                  <span>Created: {activity.createdAt}</span>
                  <span>{activity.documents.length} documents</span>
                  <button className="btn-edit">✏️ Edit</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Documents or Document Upload */}
        <div className="activities-column">
          {showDocumentUpload ? (
            /* Document Upload Interface */
            <div className="document-upload-container">
              <div className="upload-header">
                <button 
                  onClick={() => setShowDocumentUpload(false)}
                  className="back-button"
                >
                  ← Back to Documents
                </button>
                <h3>Upload Documents to {selectedActivity?.title}</h3>
              </div>
              
              <DocumentUpload 
                onDocumentsUpdate={handleDocumentsUpdate}
                existingDocuments={selectedActivity?.documents || []}
                activityId={selectedActivity?.id}
              />
            </div>
          ) : (
            /* Documents List */
            <>
              <div className="documents-header">
                <h3>
                  {selectedActivity ? `${selectedActivity.title} - Documents` : 'Select an Activity'}
                </h3>
                {selectedActivity && (
                  <button 
                    onClick={() => setShowDocumentUpload(true)}
                    className="btn-primary"
                  >
                    📁 Upload Documents
                  </button>
                )}
              </div>
              
              {selectedActivity ? (
                <div className="card-list">
                  {selectedActivity.documents.length > 0 ? (
                    selectedActivity.documents.map((doc) => (
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
                    ))
                  ) : (
                    <div className="empty-state">
                      <span className="empty-icon">📁</span>
                      <p>No documents yet</p>
                      <button 
                        onClick={() => setShowDocumentUpload(true)}
                        className="btn-primary"
                      >
                        Upload First Document
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="empty-state">
                  <span className="empty-icon">📋</span>
                  <p>Select an activity to view documents</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepartmentActivities;