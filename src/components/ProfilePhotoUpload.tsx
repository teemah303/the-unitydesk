import React, { useState, useRef } from 'react';

interface ProfilePhotoUploadProps {
  currentPhoto?: string;
  onPhotoUpdate: (photoUrl: string) => void;
}

const ProfilePhotoUpload: React.FC<ProfilePhotoUploadProps> = ({ 
  currentPhoto, 
  onPhotoUpdate 
}) => {
  const [photo, setPhoto] = useState<string | null>(currentPhoto || null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processImageFile(file);
    }
  };

  const processImageFile = (file: File) => {
    setIsUploading(true);
    
    // Simulate upload process (in real app, you'd upload to server)
    const reader = new FileReader();
    reader.onload = (e) => {
      setTimeout(() => {
        const result = e.target?.result as string;
        setPhoto(result);
        onPhotoUpdate(result);
        setIsUploading(false);
      }, 1500); // Simulate upload delay
    };
    reader.readAsDataURL(file);
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
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      processImageFile(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    onPhotoUpdate('');
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="profile-photo-section">
      <h3>Profile Photo</h3>
      <p className="section-subtitle">Upload a photo to personalize your account</p>

      <div className="photo-upload-area">
        <div className="photo-preview">
          {photo ? (
            <div className="photo-container">
              <img src={photo} alt="Profile" className="profile-photo" />
              <button 
                onClick={handleRemovePhoto}
                className="remove-photo-btn"
                title="Remove photo"
              >
                ×
              </button>
            </div>
          ) : (
            <div className="photo-placeholder">
              <span className="placeholder-icon">👤</span>
            </div>
          )}
        </div>

        <div className="upload-controls">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="file-input"
          />
          
          <div 
            className={`upload-zone ${isDragging ? 'upload-zone-dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerFileInput}
          >
            <div className="upload-content">
              <span className="upload-icon">📸</span>
              <div className="upload-text">
                <p className="upload-title">
                  {isUploading ? 'Uploading...' : 'Click to upload or drag and drop'}
                </p>
                <p className="upload-subtitle">PNG, JPG, WEBP up to 5MB</p>
              </div>
              
              {isUploading && (
                <div className="upload-progress">
                  <div className="progress-bar">
                    <div className="progress-fill"></div>
                  </div>
                  <span className="progress-text">Processing image...</span>
                </div>
              )}
            </div>
          </div>

          <div className="upload-actions">
            <button 
              onClick={triggerFileInput}
              disabled={isUploading}
              className="btn-primary btn-sm"
            >
              Choose File
            </button>
            {photo && (
              <button 
                onClick={handleRemovePhoto}
                disabled={isUploading}
                className="btn-secondary btn-sm"
              >
                Remove Photo
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="photo-tips">
        <h4>💡 Tips for best results:</h4>
        <ul>
          <li>Use a square image for best appearance</li>
          <li>Make sure your face is clearly visible</li>
          <li>File size should be less than 5MB</li>
          <li>Supported formats: JPG, PNG, WEBP</li>
        </ul>
      </div>
    </div>
  );
};

export default ProfilePhotoUpload;