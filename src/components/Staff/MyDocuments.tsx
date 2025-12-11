import React, { useState, useRef } from 'react';

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'excel' | 'word' | 'image' | 'video' | 'other';
  size: string;
  uploadDate: string;
  uploadedBy: string;
  project: string;
  task: string;
  status: 'active' | 'archived' | 'pending';
  category: string;
  tags: string[];
  downloadCount: number;
  lastAccessed: string;
}

const MyDocuments: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'Community Survey Report 2024.pdf',
      type: 'pdf',
      size: '4.2 MB',
      uploadDate: '2024-01-25',
      uploadedBy: 'John Doe',
      project: 'Community Development Initiative 2024',
      task: 'Community Survey Analysis',
      status: 'active',
      category: 'Reports',
      tags: ['survey', 'analysis', 'community'],
      downloadCount: 12,
      lastAccessed: '2024-02-10'
    },
    {
      id: '2',
      name: 'Beneficiary Data.xlsx',
      type: 'excel',
      size: '3.8 MB',
      uploadDate: '2024-02-01',
      uploadedBy: 'Jane Smith',
      project: 'Flood Relief Program',
      task: 'Beneficiary Data Entry',
      status: 'active',
      category: 'Data',
      tags: ['beneficiary', 'data', 'relief'],
      downloadCount: 8,
      lastAccessed: '2024-02-08'
    },
    {
      id: '3',
      name: 'Project Proposal.docx',
      type: 'word',
      size: '2.1 MB',
      uploadDate: '2024-01-15',
      uploadedBy: 'HOD Community Development',
      project: 'Rural School Infrastructure Project',
      task: 'Project Planning',
      status: 'active',
      category: 'Proposals',
      tags: ['proposal', 'planning', 'infrastructure'],
      downloadCount: 15,
      lastAccessed: '2024-02-05'
    },
    {
      id: '4',
      name: 'Site Photos Collection.zip',
      type: 'other',
      size: '24.5 MB',
      uploadDate: '2024-01-30',
      uploadedBy: 'John Doe',
      project: 'Community Development Initiative 2024',
      task: 'Field Visit Report',
      status: 'active',
      category: 'Media',
      tags: ['photos', 'site', 'field-visit'],
      downloadCount: 6,
      lastAccessed: '2024-02-03'
    }
  ]);

  const [selectedDocument, setSelectedDocument] = useState<Document | null>(documents[0]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const categories = ['all', 'Reports', 'Data', 'Proposals', 'Media', 'Forms', 'Plans', 'Presentations'];
  const documentTypes = ['all', 'pdf', 'excel', 'word', 'image', 'video', 'other'];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         doc.project.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesFilter = filter === 'all' || doc.status === filter;

    return matchesSearch && matchesCategory && matchesFilter;
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'excel': return '📊';
      case 'word': return '📝';
      case 'image': return '🖼️';
      case 'video': return '🎥';
      default: return '📎';
    }
  };

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case 'pdf': return 'file-type-pdf';
      case 'excel': return 'file-type-excel';
      case 'word': return 'file-type-word';
      case 'image': return 'file-type-image';
      case 'video': return 'file-type-video';
      default: return 'file-type-other';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'status-active';
      case 'archived': return 'status-archived';
      default: return 'status-pending';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
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

  const handleUploadDocuments = () => {
    if (uploadedFiles.length === 0) {
      alert('Please select files to upload');
      return;
    }

    // Simulate upload
    setTimeout(() => {
      const newDocs: Document[] = uploadedFiles.map(file => {
        const extension = file.name.split('.').pop()?.toLowerCase();
        let type: Document['type'] = 'other';
        
        if (extension === 'pdf') type = 'pdf';
        else if (['xlsx', 'xls', 'csv'].includes(extension || '')) type = 'excel';
        else if (['docx', 'doc'].includes(extension || '')) type = 'word';
        else if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) type = 'image';
        else if (['mp4', 'avi', 'mov'].includes(extension || '')) type = 'video';

        return {
          id: Date.now().toString() + Math.random(),
          name: file.name,
          type: type,
          size: formatFileSize(file.size),
          uploadDate: new Date().toISOString().split('T')[0],
          uploadedBy: 'You',
          project: 'Current Project',
          task: 'Recent Task',
          status: 'active',
          category: getCategoryFromType(type),
          tags: ['new', 'uploaded'],
          downloadCount: 0,
          lastAccessed: new Date().toISOString().split('T')[0]
        };
      });

      setDocuments([...newDocs, ...documents]);
      setUploadedFiles([]);
      setShowUploadModal(false);
      alert(`Successfully uploaded ${newDocs.length} document(s)!`);
    }, 1500);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCategoryFromType = (type: Document['type']) => {
    switch (type) {
      case 'pdf': return 'Reports';
      case 'excel': return 'Data';
      case 'word': return 'Proposals';
      case 'image': return 'Media';
      case 'video': return 'Media';
      default: return 'Other';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleDownloadDocument = (doc: Document) => {
    alert(`Downloading: ${doc.name}\n\n📥 This document has been downloaded ${doc.downloadCount + 1} times`);
  };

  return (
    <div className="content-section">
      <div className="section-header">
        <div>
          <h2>My Documents</h2>
          <p>Manage all documents related to your tasks and projects</p>
        </div>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="btn-primary"
        >
          📤 Upload Documents
        </button>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Upload Documents</h3>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="close-button"
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="upload-section">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  multiple
                  className="file-input"
                />
                
                <div className="upload-zone" onClick={triggerFileInput}>
                  <div className="upload-content">
                    <span className="upload-icon">📁</span>
                    <div className="upload-text">
                      <h6>Click to upload or drag and drop</h6>
                      <p>All file types supported</p>
                      <small>You can upload multiple files</small>
                    </div>
                  </div>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="uploaded-files">
                    <h6>Files to upload ({uploadedFiles.length})</h6>
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="uploaded-file-item">
                        <span className="file-icon">{getFileIcon(file.name.split('.').pop() || 'other')}</span>
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

                <div className="form-actions">
                  <button onClick={handleUploadDocuments} className="btn-primary">
                    📤 Upload Documents
                  </button>
                  <button onClick={() => setShowUploadModal(false)} className="btn-secondary">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="documents-controls">
        <div className="search-bar">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents by name, tag, or project..."
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <label>Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Status:</label>
            <div className="filter-buttons">
              <button 
                onClick={() => setFilter('all')}
                className={`filter-btn ${filter === 'all' ? 'filter-btn-active' : ''}`}
              >
                All
              </button>
              <button 
                onClick={() => setFilter('active')}
                className={`filter-btn ${filter === 'active' ? 'filter-btn-active' : ''}`}
              >
                Active
              </button>
              <button 
                onClick={() => setFilter('archived')}
                className={`filter-btn ${filter === 'archived' ? 'filter-btn-active' : ''}`}
              >
                Archived
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Documents Statistics */}
      <div className="documents-stats">
        <div className="stat-card">
          <div className="stat-icon">📄</div>
          <div className="stat-info">
            <h3>{documents.length}</h3>
            <p>Total Documents</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>{documents.filter(d => d.type === 'pdf').length}</h3>
            <p>PDF Files</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-info">
            <h3>{documents.filter(d => d.type === 'word').length}</h3>
            <p>Word Documents</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📥</div>
          <div className="stat-info">
            <h3>{documents.reduce((acc, doc) => acc + doc.downloadCount, 0)}</h3>
            <p>Total Downloads</p>
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="documents-grid">
        {filteredDocuments.map(doc => (
          <div 
            key={doc.id} 
            className="document-card"
            onClick={() => setSelectedDocument(doc)}
          >
            <div className="document-header">
              <div className="document-icon-container">
                <span className={`document-icon ${getFileTypeColor(doc.type)}`}>
                  {getFileIcon(doc.type)}
                </span>
              </div>
              <div className="document-title">
                <h4>{doc.name}</h4>
                <span className={`document-status ${getStatusColor(doc.status)}`}>
                  {doc.status}
                </span>
              </div>
            </div>

            <div className="document-details">
              <div className="detail-row">
                <span className="detail-label">Size:</span>
                <span className="detail-value">{doc.size}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Uploaded:</span>
                <span className="detail-value">{formatDate(doc.uploadDate)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Project:</span>
                <span className="detail-value">{doc.project}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Category:</span>
                <span className="detail-value">{doc.category}</span>
              </div>
            </div>

            <div className="document-tags">
              {doc.tags.map(tag => (
                <span key={tag} className="document-tag">#{tag}</span>
              ))}
            </div>

            <div className="document-footer">
              <div className="document-stats">
                <span className="stat">📥 {doc.downloadCount} downloads</span>
                <span className="stat">👁️ Last: {formatDate(doc.lastAccessed)}</span>
              </div>
              <div className="document-actions">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadDocument(doc);
                  }}
                  className="btn-download"
                  title="Download"
                >
                  📥
                </button>
                <button className="btn-view" title="View">
                  👁️
                </button>
                <button className="btn-share" title="Share">
                  📤
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Document Details Sidebar */}
      {selectedDocument && (
        <div className="document-details-sidebar">
          <div className="sidebar-header">
            <h3>Document Details</h3>
            <button 
              onClick={() => setSelectedDocument(null)}
              className="close-button"
            >
              ×
            </button>
          </div>

          <div className="sidebar-content">
            <div className="document-preview">
              <span className="preview-icon">{getFileIcon(selectedDocument.type)}</span>
              <h4>{selectedDocument.name}</h4>
              <span className={`file-type-badge ${getFileTypeColor(selectedDocument.type)}`}>
                {selectedDocument.type.toUpperCase()}
              </span>
            </div>

            <div className="document-info-grid">
              <div className="info-item">
                <span className="info-label">Size</span>
                <span className="info-value">{selectedDocument.size}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Upload Date</span>
                <span className="info-value">{formatDate(selectedDocument.uploadDate)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Uploaded By</span>
                <span className="info-value">{selectedDocument.uploadedBy}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Project</span>
                <span className="info-value">{selectedDocument.project}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Task</span>
                <span className="info-value">{selectedDocument.task}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Category</span>
                <span className="info-value">{selectedDocument.category}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Status</span>
                <span className={`info-value ${getStatusColor(selectedDocument.status)}`}>
                  {selectedDocument.status}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Downloads</span>
                <span className="info-value">{selectedDocument.downloadCount}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Last Accessed</span>
                <span className="info-value">{formatDate(selectedDocument.lastAccessed)}</span>
              </div>
            </div>

            <div className="document-tags-section">
              <h5>Tags</h5>
              <div className="tags-container">
                {selectedDocument.tags.map(tag => (
                  <span key={tag} className="tag">#{tag}</span>
                ))}
              </div>
            </div>

            <div className="document-actions-sidebar">
              <button 
                onClick={() => handleDownloadDocument(selectedDocument)}
                className="btn-primary"
              >
                📥 Download Document
              </button>
              <button className="btn-secondary">
                👁️ Preview
              </button>
              <button className="btn-secondary">
                📤 Share
              </button>
            </div>
          </div>
        </div>
      )}

      {filteredDocuments.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">📁</span>
          <h3>No Documents Found</h3>
          <p>Try changing your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default MyDocuments;