import React, { useState, useRef } from 'react';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  uploadedBy: string;
  url: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface Task {
  id: string;
  title: string;
  description: string;
  department: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  dueDate: string;
  assignedDate: string;
  assignedBy: string;
  instructions: string;
  documents: Document[];
  submittedDocuments: Document[];
  progress: number;
  projectCategory: string;
}

const StaffTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Community Survey Analysis',
      description: 'Analyze survey data from rural communities and prepare comprehensive report',
      department: 'Community and Rural Development',
      priority: 'high' as 'high',
      status: 'in-progress' as 'in-progress',
      dueDate: '2024-02-15',
      assignedDate: '2024-01-20',
      assignedBy: 'HOD Community Development',
      instructions: '1. Download the survey data template\n2. Analyze demographic information\n3. Prepare summary report\n4. Include recommendations',
      documents: [
        {
          id: 'doc1',
          name: 'survey_data_template.xlsx',
          type: 'excel',
          size: '2.1 MB',
          uploadDate: '2024-01-20',
          uploadedBy: 'HOD Community Development',
          url: '#',
          status: 'approved'
        },
        {
          id: 'doc2',
          name: 'analysis_guidelines.pdf',
          type: 'pdf',
          size: '1.5 MB',
          uploadDate: '2024-01-20',
          uploadedBy: 'HOD Community Development',
          url: '#',
          status: 'approved'
        }
      ],
      submittedDocuments: [],
      progress: 65,
      projectCategory: 'Community Development'
    }
  ]);

  const [selectedTask, setSelectedTask] = useState<Task | null>(tasks[0]);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return '📄';
      case 'xlsx': case 'xls': case 'csv': return '📊';
      case 'doc': case 'docx': return '📝';
      case 'jpg': case 'jpeg': case 'png': case 'gif': return '🖼️';
      case 'mp4': case 'avi': case 'mov': return '🎥';
      case 'zip': case 'rar': return '📦';
      default: return '📎';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleRemoveUploadedFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitDocuments = async (taskId: string) => {
    if (uploadedFiles.length === 0) {
      alert('Please upload at least one document before submitting.');
      return;
    }

    setIsUploading(true);

    // Simulate upload process
    setTimeout(() => {
      const newDocuments: Document[] = uploadedFiles.map(file => ({
        id: Date.now().toString() + Math.random(),
        name: file.name,
        type: file.type,
        size: formatFileSize(file.size),
        uploadDate: new Date().toLocaleDateString(),
        uploadedBy: 'Staff Member',
        url: URL.createObjectURL(file),
        status: 'pending'
      }));

      const updatedTasks = tasks.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              submittedDocuments: [...task.submittedDocuments, ...newDocuments],
              status: 'completed' as 'completed',
              progress: 100
            }
          : task
      );

      setTasks(updatedTasks);
      setUploadedFiles([]);
      setIsUploading(false);

      if (selectedTask?.id === taskId) {
        const updatedTask = updatedTasks.find(t => t.id === taskId);
        if (updatedTask) {
          setSelectedTask(updatedTask);
        }
      }

      alert('🎉 Documents submitted successfully!\nYour HOD has been notified and will review your work.');
      
      // Simulate WhatsApp notification to HOD
      console.log('📱 WhatsApp notification sent to HOD: Task documents submitted for review');
      
    }, 2000);
  };

  const updateTaskStatus = (taskId: string, newStatus: Task['status']) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: newStatus }
        : task
    );
    
    setTasks(updatedTasks);
    
    if (selectedTask?.id === taskId) {
      setSelectedTask({ ...selectedTask, status: newStatus });
    }

    if (newStatus === 'in-progress') {
      alert('Task started! 🏃\nYou can now work on this task and upload documents.');
    }
  };

  const updateProgress = (taskId: string, progress: number) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId 
        ? { ...task, progress: Math.min(100, Math.max(0, progress)) }
        : task
    );
    
    setTasks(updatedTasks);
    
    if (selectedTask?.id === taskId) {
      setSelectedTask({ ...selectedTask, progress });
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

  const getDocumentStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'document-status-approved';
      case 'rejected': return 'document-status-rejected';
      default: return 'document-status-pending';
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
        <h2>My Tasks</h2>
        <div className="task-stats">
          <div className="stat">
            <span className="stat-number">{tasks.length}</span>
            <span className="stat-label">Total Tasks</span>
          </div>
          <div className="stat">
            <span className="stat-number">
              {tasks.filter(t => t.status === 'completed').length}
            </span>
            <span className="stat-label">Completed</span>
          </div>
          <div className="stat">
            <span className="stat-number">
              {tasks.filter(t => t.status === 'in-progress').length}
            </span>
            <span className="stat-label">In Progress</span>
          </div>
        </div>
      </div>

      <div className="staff-tasks-layout">
        {/* Tasks List */}
        <div className="tasks-list-column">
          <h3>Assigned Tasks ({tasks.length})</h3>
          <div className="tasks-list">
            {tasks.map(task => {
              const daysUntilDue = getDaysUntilDue(task.dueDate);
              const isOverdue = daysUntilDue < 0;
              
              return (
                <div
                  key={task.id}
                  onClick={() => {
                    setSelectedTask(task);
                    setShowTaskDetails(true);
                  }}
                  className={`task-item ${selectedTask?.id === task.id ? 'task-item-active' : ''} ${isOverdue ? 'task-overdue' : ''}`}
                >
                  <div className="task-item-header">
                    <h4>{task.title}</h4>
                    <div className="task-item-badges">
                      <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className={`status-badge ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="task-category">
                    <span className="category-badge">{task.projectCategory}</span>
                  </div>

                  <p className="task-item-description">
                    {task.description.substring(0, 80)}...
                  </p>

                  <div className="task-item-meta">
                    <div className="due-date">
                      <span className="meta-label">Due:</span>
                      <span className={`meta-value ${isOverdue ? 'overdue' : ''}`}>
                        {task.dueDate} {isOverdue && '(Overdue)'}
                        {!isOverdue && daysUntilDue === 0 && '(Today)'}
                        {!isOverdue && daysUntilDue > 0 && `(${daysUntilDue} days)`}
                      </span>
                    </div>
                    <div className="assigned-by">
                      <span className="meta-label">By:</span>
                      <span className="meta-value">{task.assignedBy}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="progress-section">
                    <div className="progress-header">
                      <span>Progress</span>
                      <span>{task.progress}%</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="task-item-actions">
                    <button 
                      className="btn-primary btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTask(task);
                        setShowTaskDetails(true);
                      }}
                    >
                      View Details
                    </button>
                    {task.status === 'pending' && (
                      <button 
                        className="btn-secondary btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateTaskStatus(task.id, 'in-progress');
                        }}
                      >
                        Start Task
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Task Details & Document Management */}
        <div className="task-details-column">
          {selectedTask && showTaskDetails ? (
            <div className="task-details-panel">
              <div className="panel-header">
                <h3>Task Details & Submission</h3>
                <button 
                  onClick={() => setShowTaskDetails(false)}
                  className="close-button"
                >
                  ×
                </button>
              </div>

              <div className="task-details-content">
                {/* Task Information */}
                <div className="detail-section">
                  <h4>{selectedTask.title}</h4>
                  <div className="task-meta-badges">
                    <span className="category-badge-large">{selectedTask.projectCategory}</span>
                    <span className={`priority-badge ${getPriorityColor(selectedTask.priority)}`}>
                      {selectedTask.priority} Priority
                    </span>
                    <span className={`status-badge ${getStatusColor(selectedTask.status)}`}>
                      {selectedTask.status}
                    </span>
                  </div>
                  <p className="task-full-description">{selectedTask.description}</p>
                </div>

                {/* Instructions */}
                <div className="detail-section">
                  <h5>📋 Task Instructions</h5>
                  <div className="instructions-box">
                    {selectedTask.instructions.split('\n').map((instruction, index) => (
                      <div key={index} className="instruction-step">
                        <span className="step-number">{index + 1}.</span>
                        <span>{instruction}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Provided Documents */}
                {selectedTask.documents.length > 0 && (
                  <div className="detail-section">
                    <h5>📁 Provided Documents</h5>
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
                            <button className="btn-view" title="View Document">👁️</button>
                            <button className="btn-download" title="Download">📥</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Document Upload Section */}
                <div className="detail-section">
                  <h5>📤 Upload Your Work</h5>
                  <div className="upload-section">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      multiple
                      accept=".pdf,.doc,.docx,.xlsx,.xls,.jpg,.jpeg,.png,.mp4,.avi,.mov"
                      className="file-input"
                    />
                    
                    <div className="upload-zone" onClick={triggerFileInput}>
                      <div className="upload-content">
                        <span className="upload-icon">📁</span>
                        <div className="upload-text">
                          <h6>Click to upload or drag and drop</h6>
                          <p>PDF, Word, Excel, Images, Videos</p>
                          <small>You can upload multiple files</small>
                        </div>
                      </div>
                    </div>

                    {/* Uploaded Files Preview */}
                    {uploadedFiles.length > 0 && (
                      <div className="uploaded-files">
                        <h6>Files to upload ({uploadedFiles.length})</h6>
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="uploaded-file-item">
                            <span className="file-icon">{getFileIcon(file.name)}</span>
                            <div className="file-info">
                              <span className="file-name">{file.name}</span>
                              <span className="file-size">{formatFileSize(file.size)}</span>
                            </div>
                            <button 
                              onClick={() => handleRemoveUploadedFile(index)}
                              className="btn-remove-file"
                            >
                              🗑️
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Previously Submitted Documents */}
                {selectedTask.submittedDocuments.length > 0 && (
                  <div className="detail-section">
                    <h5>✅ Submitted Documents</h5>
                    <div className="submitted-documents">
                      {selectedTask.submittedDocuments.map((doc) => (
                        <div key={doc.id} className="submitted-document-item">
                          <span className="doc-icon">{getFileIcon(doc.name)}</span>
                          <div className="document-info">
                            <h6>{doc.name}</h6>
                            <div className="document-meta">
                              <span>{doc.type}</span>
                              <span>{doc.size}</span>
                              <span>{doc.uploadDate}</span>
                            </div>
                            <span className={`document-status ${getDocumentStatusColor(doc.status)}`}>
                              {doc.status}
                            </span>
                          </div>
                          <div className="document-actions">
                            <button className="btn-view" title="View">👁️</button>
                            <button className="btn-download" title="Download">📥</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="action-buttons">
                  {selectedTask.status === 'pending' && (
                    <button 
                      onClick={() => updateTaskStatus(selectedTask.id, 'in-progress')}
                      className="btn-primary"
                    >
                      🏃 Start Working
                    </button>
                  )}
                  
                  {selectedTask.status === 'in-progress' && (
                    <button 
                      onClick={() => handleSubmitDocuments(selectedTask.id)}
                      disabled={isUploading || uploadedFiles.length === 0}
                      className="btn-success"
                    >
                      {isUploading ? (
                        <>
                          <div className="upload-spinner"></div>
                          Uploading...
                        </>
                      ) : (
                        `✅ Submit ${uploadedFiles.length} Document${uploadedFiles.length !== 1 ? 's' : ''}`
                      )}
                    </button>
                  )}
                  
                  {selectedTask.status === 'completed' && (
                    <div className="completion-message">
                      <span className="success-icon">🎉</span>
                      <div>
                        <strong>Task Submitted!</strong>
                        <p>Your documents are under review by {selectedTask.assignedBy}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="task-details-placeholder">
              <div className="placeholder-content">
                <span className="placeholder-icon">📋</span>
                <h3>Select a Task</h3>
                <p>Click on a task from the list to view details and submit your work</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffTasks;