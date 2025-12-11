import React, { useState, useRef } from 'react';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  uploadedBy: string;
  url?: string;
}

interface DocumentUploadProps {
  onDocumentsUpdate: (documents: Document[]) => void;
  existingDocuments?: Document[];
  activityId?: string;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ 
  onDocumentsUpdate, 
  existingDocuments = [],
  activityId 
}) => {
  const [documents, setDocuments] = useState<Document[]>(existingDocuments);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return '📄';
      case 'xlsx': case 'xls': case 'csv': return '📊';
      case 'doc': case 'docx': return '📝';
      case 'jpg': case 'jpeg': case 'png': case 'gif': return '🖼️';
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

  const handleFiles = (files: FileList) => {
    const newDocuments: Document[] = [];
    
    Array.from(files).forEach(file => {
      // Simulate file processing and upload
      const document: Document = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        type: file.type,
        size: formatFileSize(file.size),
        uploadDate: new Date().toLocaleDateString(),
        uploadedBy: 'Current User', // In real app, get from user context
        url: URL.createObjectURL(file) // For preview
      };
      newDocuments.push(document);
    });

    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      const updatedDocuments = [...documents, ...newDocuments];
      setDocuments(updatedDocuments);
      onDocumentsUpdate(updatedDocuments);
      setIsUploading(false);
    }, 2000);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      handleFiles(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleRemoveDocument = (documentId: string) => {
    const updatedDocuments = documents.filter(doc => doc.id !== documentId);
    setDocuments(updatedDocuments);
    onDocumentsUpdate(updatedDocuments);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const getFileTypeCategory = (type: string) => {
    if (type.includes('image')) return 'Image';
    if (type.includes('pdf')) return 'PDF';
    if (type.includes('spreadsheet') || type.includes('excel')) return 'Spreadsheet';
    if (type.includes('word') || type.includes('document')) return 'Document';
    return 'Other';
  };

  return (
    <div className="document-upload-section">
      <div className="upload-header">
        <h3>📁 Document Management</h3>
        <p>Upload files related to this activity</p>
      </div>

      {/* Upload Zone */}
      <div className="upload-area">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          accept=".pdf,.doc,.docx,.xlsx,.xls,.jpg,.jpeg,.png,.zip"
          className="file-input"
        />
        
        <div 
          className={`upload-zone ${isDragging ? 'upload-zone-dragging' : ''} ${isUploading ? 'upload-zone-uploading' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileInput}
        >
          <div className="upload-content">
            <div className="upload-icon">📤</div>
            <div className="upload-text">
              <h4>
                {isUploading ? 'Uploading Files...' : 
                 isDragging ? 'Drop Files Here' : 'Upload Documents'}
              </h4>
              <p>Click to browse or drag and drop files here</p>
              <div className="file-types">
                <span>PDF, Word, Excel, Images, ZIP</span>
                <span>Max 10MB per file</span>
              </div>
            </div>
            
            {isUploading && (
              <div className="upload-progress">
                <div className="progress-spinner"></div>
                <span>Processing files...</span>
              </div>
            )}
          </div>
        </div>

        <div className="upload-actions">
          <button 
            onClick={triggerFileInput}
            disabled={isUploading}
            className="btn-primary"
          >
            📁 Browse Files
          </button>
          <span className="file-count">{documents.length} files attached</span>
        </div>
      </div>

      {/* Documents List */}
      {documents.length > 0 && (
        <div className="documents-list">
          <h4>Attached Documents</h4>
          <div className="documents-grid">
            {documents.map((doc) => (
              <div key={doc.id} className="document-card">
                <div className="document-preview">
                  <span className="document-icon">{getFileIcon(doc.name)}</span>
                  {doc.type.includes('image') && doc.url && (
                    <img src={doc.url} alt="Preview" className="image-preview" />
                  )}
                </div>
                
                <div className="document-info">
                  <h5 className="document-name">{doc.name}</h5>
                  <div className="document-meta">
                    <span className="document-type">{getFileTypeCategory(doc.type)}</span>
                    <span className="document-size">{doc.size}</span>
                    <span className="document-date">{doc.uploadDate}</span>
                  </div>
                  <div className="document-uploader">
                    Uploaded by: {doc.uploadedBy}
                  </div>
                </div>

                <div className="document-actions">
                  <button 
                    className="btn-view"
                    title="View Document"
                  >
                    👁️
                  </button>
                  <button 
                    className="btn-download"
                    title="Download"
                  >
                    📥
                  </button>
                  <button 
                    onClick={() => handleRemoveDocument(doc.id)}
                    className="btn-remove"
                    title="Remove"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="upload-stats">
        <div className="stat">
          <span className="stat-number">{documents.length}</span>
          <span className="stat-label">Total Files</span>
        </div>
        <div className="stat">
          <span className="stat-number">
            {documents.filter(doc => doc.type.includes('image')).length}
          </span>
          <span className="stat-label">Images</span>
        </div>
        <div className="stat">
          <span className="stat-number">
            {documents.filter(doc => doc.type.includes('pdf')).length}
          </span>
          <span className="stat-label">PDFs</span>
        </div>
        <div className="stat">
          <span className="stat-number">
            {documents.filter(doc => 
              doc.type.includes('spreadsheet') || doc.type.includes('excel')
            ).length}
          </span>
          <span className="stat-label">Spreadsheets</span>
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;