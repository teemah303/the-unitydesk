import React, { useState, useRef } from 'react';

const LogoManagement: React.FC = () => {
  const [logo, setLogo] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [organizationName, setOrganizationName] = useState('State Organization');
  const [primaryColor, setPrimaryColor] = useState('#2563eb');
  const [secondaryColor, setSecondaryColor] = useState('#6b7280');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setIsUploading(true);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setTimeout(() => {
          setLogo(e.target?.result as string);
          setIsUploading(false);
          alert('Logo uploaded successfully! 🎉');
        }, 1500);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogo(null);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSaveBranding = () => {
    // Save to localStorage for demo
    localStorage.setItem('organizationLogo', logo || '');
    localStorage.setItem('organizationName', organizationName);
    localStorage.setItem('primaryColor', primaryColor);
    localStorage.setItem('secondaryColor', secondaryColor);
    
    alert('Branding settings saved successfully! 🎨\nRefresh the page to see changes.');
  };

  const handleResetBranding = () => {
    setLogo(null);
    setOrganizationName('State Organization');
    setPrimaryColor('#2563eb');
    setSecondaryColor('#6b7280');
    
    localStorage.removeItem('organizationLogo');
    localStorage.removeItem('organizationName');
    localStorage.removeItem('primaryColor');
    localStorage.removeItem('secondaryColor');
    
    alert('Branding reset to default settings!');
  };

  return (
    <div className="content-section">
      <div className="section-header">
        <h2>Organization Branding</h2>
        <p>Customize your organization's logo and colors</p>
      </div>

      <div className="branding-layout">
        {/* Left Column - Logo Upload */}
        <div className="branding-left">
          <div className="logo-upload-section">
            <h3>Organization Logo</h3>
            
            <div className="logo-preview-area">
              {logo ? (
                <div className="logo-preview">
                  <img src={logo} alt="Organization Logo" className="logo-image" />
                  <button 
                    onClick={handleRemoveLogo}
                    className="remove-logo-btn"
                    title="Remove logo"
                  >
                    🗑️
                  </button>
                </div>
              ) : (
                <div className="logo-placeholder">
                  <span className="placeholder-text">🏢</span>
                  <p>No logo uploaded</p>
                </div>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleLogoUpload}
              accept="image/*"
              className="file-input"
            />

            <div className="upload-zone" onClick={triggerFileInput}>
              <div className="upload-content">
                <span className="upload-icon">🖼️</span>
                <div className="upload-text">
                  <h4>{isUploading ? 'Uploading...' : 'Upload Logo'}</h4>
                  <p>Click to browse or drag and drop</p>
                  <div className="file-requirements">
                    <span>PNG, JPG, SVG • Max 2MB</span>
                    <span>Recommended: 200x200px</span>
                  </div>
                </div>
                
                {isUploading && (
                  <div className="upload-progress">
                    <div className="progress-spinner"></div>
                  </div>
                )}
              </div>
            </div>

            <div className="logo-guidelines">
              <h4>📋 Logo Guidelines</h4>
              <ul>
                <li>Use high-quality images for best results</li>
                <li>Square logos work best for the header</li>
                <li>Transparent background recommended</li>
                <li>File size should be less than 2MB</li>
                <li>Supported formats: PNG, JPG, SVG, WEBP</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column - Branding Settings */}
        <div className="branding-right">
          <div className="branding-settings">
            <h3>Branding Settings</h3>

            {/* Organization Name */}
            <div className="setting-group">
              <label>Organization Name</label>
              <input
                type="text"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                placeholder="Enter your organization name"
                className="setting-input"
              />
            </div>

            {/* Color Settings */}
            <div className="setting-group">
              <label>Primary Color</label>
              <div className="color-picker-group">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="color-picker"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="color-input"
                  placeholder="#2563eb"
                />
                <div 
                  className="color-preview"
                  style={{ backgroundColor: primaryColor }}
                ></div>
              </div>
            </div>

            <div className="setting-group">
              <label>Secondary Color</label>
              <div className="color-picker-group">
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="color-picker"
                />
                <input
                  type="text"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="color-input"
                  placeholder="#6b7280"
                />
                <div 
                  className="color-preview"
                  style={{ backgroundColor: secondaryColor }}
                ></div>
              </div>
            </div>

            {/* Preview Section */}
            <div className="preview-section">
              <h4>Brand Preview</h4>
              <div className="brand-preview">
                <div className="preview-header" style={{ backgroundColor: primaryColor }}>
                  <div className="preview-logo">
                    {logo ? (
                      <img src={logo} alt="Logo" className="preview-logo-image" />
                    ) : (
                      <span>🏢</span>
                    )}
                  </div>
                  <div className="preview-org-name" style={{ color: 'white' }}>
                    {organizationName}
                  </div>
                </div>
                <div className="preview-content">
                  <div 
                    className="preview-sidebar"
                    style={{ backgroundColor: secondaryColor, color: 'white' }}
                  >
                    <div className="preview-menu-item">Dashboard</div>
                    <div className="preview-menu-item">Departments</div>
                    <div className="preview-menu-item">Staff</div>
                  </div>
                  <div className="preview-main">
                    <h5 style={{ color: primaryColor }}>Welcome to your organization</h5>
                    <p style={{ color: secondaryColor }}>This is how your brand colors will appear throughout the app.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="branding-actions">
              <button onClick={handleSaveBranding} className="btn-primary">
                💾 Save Branding
              </button>
              <button onClick={handleResetBranding} className="btn-secondary">
                🔄 Reset to Default
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoManagement;