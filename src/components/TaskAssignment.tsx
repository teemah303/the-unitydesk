import React, { useState, useRef } from 'react';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  uploadedBy: string;
  url: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  department: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  dueDate: string;
  assignedDate: string;
  documents: Document[];
  instructions: string;
  projectCategory: string;
}

interface Staff {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  phone: string;
}

const TaskAssignment: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Community Survey Analysis',
      description: 'Analyze survey data from rural communities and prepare comprehensive report',
      assignedTo: 'staff1',
      department: 'Community and Rural Development',
      priority: 'high',
      status: 'in-progress',
      dueDate: '2024-02-15',
      assignedDate: '2024-01-20',
      documents: [
        {
          id: 'doc1',
          name: 'survey_data_template.xlsx',
          type: 'excel',
          size: '2.1 MB',
          uploadDate: '2024-01-20',
          uploadedBy: 'HOD Community Development',
          url: '#'
        }
      ],
      instructions: 'Please analyze the demographic data and prepare a summary report with recommendations.',
      projectCategory: 'Community Development'
    }
  ]);

  const [staffMembers] = useState<Staff[]>([
    {
      id: 'staff1',
      name: 'John Doe',
      email: 'john.doe@organization.com',
      department: 'Community and Rural Development',
      position: 'Field Officer',
      phone: '+2348123456789'
    },
    {
      id: 'staff2', 
      name: 'Jane Smith',
      email: 'jane.smith@organization.com',
      department: 'Community and Rural Development',
      position: 'Data Analyst',
      phone: '+2348123456790'
    }
  ]);

  const [showAssignTask, setShowAssignTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: '',
    instructions: '',
    projectCategory: ''
  });
  const [assignedDocuments, setAssignedDocuments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const projectCategories = [
    'Community Development',
    'Relief Distribution',
    'Infrastructure',
    'Education',
    'Healthcare',
    'Agriculture',
    'Environmental',
    'Research'
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setAssignedDocuments(prev => [...prev, ...newFiles]);
    }
  };

  const handleRemoveAssignedFile = (index: number) => {
    setAssignedDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const handleAssignTask = () => {
    if (newTask.title && newTask.assignedTo && newTask.dueDate && newTask.projectCategory) {
      // Convert uploaded files to documents
      const documents: Document[] = assignedDocuments.map(file => ({
        id: Date.now().toString() + Math.random(),
        name: file.name,
        type: file.type,
        size: formatFileSize(file.size),
        uploadDate: new Date().toLocaleDateString(),
        uploadedBy: 'HOD',
        url: URL.createObjectURL(file)
      }));

      const task: Task = {
        id: Date.now().toString(),
        title: newTask.title,
        description: newTask.description,
        assignedTo: newTask.assignedTo,
        department: 'Community and Rural Development',
        priority: newTask.priority,
        status: 'pending',
        dueDate: newTask.dueDate,
        assignedDate: new Date().toISOString().split('T')[0],
        documents: documents,
        instructions: newTask.instructions,
        projectCategory: newTask.projectCategory
      };

      setTasks([...tasks, task]);
      
      // Reset form
      setNewTask({
        title: '',
        description: '',
        assignedTo: '',
        priority: 'medium',
        dueDate: '',
        instructions: '',
        projectCategory: ''
      });
      setAssignedDocuments([]);
      setShowAssignTask(false);
      
      // Send WhatsApp notification
      const assignedStaff = staffMembers.find(s => s.id === newTask.assignedTo);
      if (assignedStaff) {
        alert(`🎯 Task assigned successfully!\n\n📱 WhatsApp notification sent to ${assignedStaff.name}\nThey can now start working on the task.`);
      }
    } else {
      alert('Please fill in all required fields: Project Category, Task Title, Assign To, and Due Date.');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return '📄';
      case 'xlsx': case 'xls': case 'csv': return '📊';
      case 'doc': case 'docx': return '📝';
      case 'jpg': case 'jpeg': case 'png': case 'gif': return '🖼️';
      case 'mp4': case 'avi': case 'mov': return '🎥';
      default: return '📎';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'in-progress': return 'status-in-progress';
      case 'overdue': return 'status-overdue';
      default: return 'status-pending';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      default: return 'priority-low';
    }
  };

  const getAssignedStaffName = (staffId: string) => {
    const staff = staffMembers.find(s => s.id === staffId);
    return staff ? staff.name : 'Unknown Staff';
  };

  const handleSendReminder = (task: Task) => {
    const staff = staffMembers.find(s => s.id === task.assignedTo);
    if (staff) {
      const daysUntilDue = getDaysUntilDue(task.dueDate);
      let message = `⏰ Friendly Reminder\n\nTask: ${task.title}\nDue Date: ${task.dueDate}\n\n`;
      
      if (daysUntilDue === 0) {
        message += 'This task is due today! Please complete and submit your work.';
      } else if (daysUntilDue < 0) {
        message += 'This task is overdue! Please submit your work as soon as possible.';
      } else {
        message += `This task is due in ${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''}.`;
      }
      
      alert(`📱 WhatsApp reminder sent to ${staff.name}!\n\n${message}`);
    }
  };

  const handleApproveTask = (task: Task) => {
    if (window.confirm(`Approve this task submission from ${getAssignedStaffName(task.assignedTo)}?`)) {
      alert(`✅ Task approved!\n\n📱 WhatsApp notification sent to ${getAssignedStaffName(task.assignedTo)}:\n"Great work! Your task submission has been approved. Thank you for your excellent work!"`);
    }
  };

  const handleRejectTask = (task: Task) => {
    const reason = prompt('Please provide feedback for rejection:');
    if (reason) {
      alert(`❌ Task rejected!\n\n📱 WhatsApp notification sent to ${getAssignedStaffName(task.assignedTo)}:\n"Your task submission needs revision. Feedback: ${reason}"`);
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="content-section">
      <div className="section-header">
        <h2>Task Assignment</h2>
        <button 
          onClick={() => setShowAssignTask(true)}
          className="btn-primary"
        >
          🎯 Assign New Task
        </button>
      </div>

      {/* Assign Task Modal */}
      {showAssignTask && (
        <div className="modal-overlay">
          <div className="modal large-modal">
            <div className="modal-header">
              <h3>Assign New Task</h3>
              <button 
                onClick={() => setShowAssignTask(false)}
                className="close-button"
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Project Category *</label>
                  <select
                    value={newTask.projectCategory}
                    onChange={(e) => setNewTask({...newTask, projectCategory: e.target.value})}
                    className="form-select"
                  >
                    <option value="">Select category</option>
                    {projectCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Task Title *</label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    placeholder="Enter task title"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Assign To *</label>
                  <select
                    value={newTask.assignedTo}
                    onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                    className="form-select"
                  >
                    <option value="">Select staff member</option>
                    {staffMembers.map(staff => (
                      <option key={staff.id} value={staff.id}>
                        {staff.name} - {staff.position}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Priority *</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value as any})}
                    className="form-select"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Due Date *</label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                    className="form-input"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  placeholder="Describe the task in detail..."
                  rows={3}
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <label>Instructions</label>
                <textarea
                  value={newTask.instructions}
                  onChange={(e) => setNewTask({...newTask, instructions: e.target.value})}
                  placeholder="Provide specific instructions for this task..."
                  rows={3}
                  className="form-textarea"
                />
              </div>

              {/* Document Upload */}
              <div className="form-group">
                <label>Attach Documents (Optional)</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  multiple
                  accept=".pdf,.doc,.docx,.xlsx,.xls,.jpg,.jpeg,.png,.mp4"
                  className="file-input"
                />
                
                <div className="upload-zone" onClick={triggerFileInput}>
                  <div className="upload-content">
                    <span className="upload-icon">📎</span>
                    <div className="upload-text">
                      <h6>Click to attach documents</h6>
                      <p>PDF, Word, Excel, Images, Videos</p>
                      <small>You can attach multiple files</small>
                    </div>
                  </div>
                </div>

                {/* Attached Files Preview */}
                {assignedDocuments.length > 0 && (
                  <div className="attached-files">
                    <h6>Attached Files ({assignedDocuments.length})</h6>
                    {assignedDocuments.map((file, index) => (
                      <div key={index} className="attached-file-item">
                        <span className="file-icon">{getFileIcon(file.name)}</span>
                        <div className="file-info">
                          <span className="file-name">{file.name}</span>
                          <span className="file-size">{formatFileSize(file.size)}</span>
                        </div>
                        <button 
                          onClick={() => handleRemoveAssignedFile(index)}
                          className="btn-remove-file"
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button onClick={handleAssignTask} className="btn-primary">
                  🎯 Assign Task
                </button>
                <button onClick={() => setShowAssignTask(false)} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tasks Overview */}
      <div className="tasks-overview">
        <div className="overview-stats">
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-info">
              <h3>{tasks.length}</h3>
              <p>Total Tasks</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>{staffMembers.length}</h3>
              <p>Team Members</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>{tasks.filter(t => t.status === 'completed').length}</h3>
              <p>Completed</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏰</div>
            <div className="stat-info">
              <h3>{tasks.filter(t => t.status === 'pending').length}</h3>
              <p>Pending</p>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="tasks-container">
          <h3>Assigned Tasks</h3>
          
          {tasks.length > 0 ? (
            <div className="tasks-grid">
              {tasks.map(task => {
                const daysUntilDue = getDaysUntilDue(task.dueDate);
                const isOverdue = daysUntilDue < 0;
                const assignedStaff = staffMembers.find(s => s.id === task.assignedTo);
                
                return (
                  <div key={task.id} className="task-card">
                    <div className="task-card-header">
                      <h4>{task.title}</h4>
                      <div className="task-badges">
                        <span className="category-badge">{task.projectCategory}</span>
                        <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className={`status-badge ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                      </div>
                    </div>

                    <p className="task-card-description">
                      {task.description.substring(0, 100)}...
                    </p>

                    <div className="task-card-details">
                      <div className="assigned-to">
                        <strong>Assigned to:</strong>
                        <div className="staff-info">
                          <span className="staff-name">{assignedStaff?.name}</span>
                          <span className="staff-position">{assignedStaff?.position}</span>
                        </div>
                      </div>
                      
                      <div className="due-info">
                        <strong>Due:</strong>
                        <span className={isOverdue ? 'overdue' : ''}>
                          {task.dueDate} 
                          {isOverdue && ' (Overdue)'}
                          {!isOverdue && daysUntilDue === 0 && ' (Today)'}
                          {!isOverdue && daysUntilDue > 0 && ` (in ${daysUntilDue} days)`}
                        </span>
                      </div>

                      {task.documents.length > 0 && (
                        <div className="attached-docs">
                          <strong>Attached:</strong>
                          <span>{task.documents.length} document{task.documents.length !== 1 ? 's' : ''}</span>
                        </div>
                      )}
                    </div>

                    <div className="task-card-actions">
                      <button 
                        onClick={() => setSelectedTask(task)}
                        className="btn-primary btn-sm"
                      >
                        View Details
                      </button>
                      <button 
                        onClick={() => handleSendReminder(task)}
                        className="btn-whatsapp btn-sm"
                      >
                        📱 Remind
                      </button>
                      {task.status === 'completed' && (
                        <>
                          <button 
                            onClick={() => handleApproveTask(task)}
                            className="btn-success btn-sm"
                          >
                            ✅ Approve
                          </button>
                          <button 
                            onClick={() => handleRejectTask(task)}
                            className="btn-danger btn-sm"
                          >
                            ❌ Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-icon">🎯</span>
              <h3>No Tasks Assigned Yet</h3>
              <p>Start by assigning your first task to a team member</p>
              <button 
                onClick={() => setShowAssignTask(true)}
                className="btn-primary"
              >
                Assign First Task
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Task Details Modal */}
      {selectedTask && (
        <div className="modal-overlay">
          <div className="modal large-modal">
            <div className="modal-header">
              <h3>Task Details - {selectedTask.title}</h3>
              <button 
                onClick={() => setSelectedTask(null)}
                className="close-button"
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="task-detail-view">
                <div className="task-meta">
                  <span className="category-badge-large">{selectedTask.projectCategory}</span>
                  <span className={`priority-badge ${getPriorityColor(selectedTask.priority)}`}>
                    {selectedTask.priority} Priority
                  </span>
                  <span className={`status-badge ${getStatusColor(selectedTask.status)}`}>
                    {selectedTask.status}
                  </span>
                </div>

                <div className="detail-section">
                  <h5>Description</h5>
                  <p>{selectedTask.description}</p>
                </div>

                <div className="detail-section">
                  <h5>Instructions</h5>
                  <div className="instructions-box">
                    {selectedTask.instructions}
                  </div>
                </div>

                {selectedTask.documents.length > 0 && (
                  <div className="detail-section">
                    <h5>Attached Documents</h5>
                    <div className="documents-list">
                      {selectedTask.documents.map((doc) => (
                        <div key={doc.id} className="document-item">
                          <span className="doc-icon">{getFileIcon(doc.name)}</span>
                          <div className="document-info">
                            <h6>{doc.name}</h6>
                            <div className="document-meta">
                              <span>{doc.type}</span>
                              <span>{doc.size}</span>
                              <span>{doc.uploadDate}</span>
                            </div>
                          </div>
                          <div className="document-actions">
                            <button className="btn-view">👁️ View</button>
                            <button className="btn-download">📥 Download</button>
                            <button className="btn-save">💾 Save</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="task-actions-modal">
                  <button 
                    onClick={() => handleSendReminder(selectedTask)}
                    className="btn-whatsapp"
                  >
                    📱 Send Reminder
                  </button>
                  {selectedTask.status === 'completed' && (
                    <>
                      <button 
                        onClick={() => handleApproveTask(selectedTask)}
                        className="btn-success"
                      >
                        ✅ Approve Submission
                      </button>
                      <button 
                        onClick={() => handleRejectTask(selectedTask)}
                        className="btn-danger"
                      >
                        ❌ Request Revision
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskAssignment;