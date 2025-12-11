import React, { useState, useEffect } from 'react';
import { whatsappService, WhatsAppMessage, NotificationTemplate } from '../services/whatsappService';

interface NotificationManagerProps {
  userType: string;
  onSendNotification?: (message: WhatsAppMessage) => void;
}

const NotificationManager: React.FC<NotificationManagerProps> = ({ userType, onSendNotification }) => {
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
  const [customMessage, setCustomMessage] = useState('');
  const [recipients, setRecipients] = useState<string[]>([]);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [isSending, setIsSending] = useState(false);
  const [sendResults, setSendResults] = useState<any[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');

  // Mock recipients based on user type
  const mockRecipients = {
    'super-admin': [
      { name: 'HOD Community Development', phone: '+2348123456789', role: 'hod' },
      { name: 'HOD Education', phone: '+2348123456790', role: 'hod' },
      { name: 'HOD Health Services', phone: '+2348123456791', role: 'hod' }
    ],
    'hod': [
      { name: 'Staff Member 1', phone: '+2348123456792', role: 'staff' },
      { name: 'Staff Member 2', phone: '+2348123456793', role: 'staff' },
      { name: 'Staff Member 3', phone: '+2348123456794', role: 'staff' }
    ],
    'staff': [
      { name: 'HOD', phone: '+2348123456789', role: 'hod' }
    ]
  };

  useEffect(() => {
    loadTemplates();
    connectToWhatsApp();
  }, []);

  useEffect(() => {
    if (selectedTemplate) {
      const defaultVariables: Record<string, string> = {};
      selectedTemplate.variables.forEach(variable => {
        defaultVariables[variable] = getDefaultVariableValue(variable);
      });
      setVariables(defaultVariables);
      
      // Generate preview message
      const preview = whatsappService.formatMessage(selectedTemplate, defaultVariables);
      setCustomMessage(preview);
    }
  }, [selectedTemplate]);

  const loadTemplates = () => {
    const availableTemplates = whatsappService.getTemplates();
    setTemplates(availableTemplates);
    setSelectedTemplate(availableTemplates[0]);
  };

  const connectToWhatsApp = async () => {
    setConnectionStatus('connecting');
    const connected = await whatsappService.connect();
    setConnectionStatus(connected ? 'connected' : 'disconnected');
  };

  const getDefaultVariableValue = (variable: string): string => {
    const defaults: Record<string, string> = {
      taskName: 'Community Development Project',
      department: 'Community and Rural Development',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      priority: 'High',
      instructions: 'Please review the attached documents and submit your report by the due date.',
      organizationName: 'State Organization',
      status: 'In Progress',
      documentName: 'Project Proposal.pdf',
      activityName: 'Relief Materials Distribution',
      submittedBy: 'Staff Member',
      completedBy: 'John Doe',
      completionDate: new Date().toLocaleDateString()
    };
    
    return defaults[variable] || `Enter ${variable}`;
  };

  const handleVariableChange = (variable: string, value: string) => {
    setVariables(prev => ({
      ...prev,
      [variable]: value
    }));

    if (selectedTemplate) {
      const updatedVariables = { ...variables, [variable]: value };
      const preview = whatsappService.formatMessage(selectedTemplate, updatedVariables);
      setCustomMessage(preview);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedTemplate || recipients.length === 0) return;

    setIsSending(true);
    setSendResults([]);

    const messages: WhatsAppMessage[] = recipients.map(recipient => ({
      to: recipient,
      message: customMessage,
      type: selectedTemplate.type as any,
      priority: 'medium'
    }));

    const result = await whatsappService.sendBulkMessages(messages);
    setSendResults(result.results);
    setIsSending(false);

    // Notify parent component
    if (onSendNotification && messages.length > 0) {
      onSendNotification(messages[0]);
    }
  };

  const handleRecipientToggle = (phone: string) => {
    setRecipients(prev => 
      prev.includes(phone) 
        ? prev.filter(p => p !== phone)
        : [...prev, phone]
    );
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'status-connected';
      case 'connecting': return 'status-connecting';
      default: return 'status-disconnected';
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return '✅ Connected to WhatsApp';
      case 'connecting': return '🔄 Connecting...';
      default: return '❌ Disconnected';
    }
  };

  return (
    <div className="notification-manager">
      <div className="notification-header">
        <h2>📱 WhatsApp Notifications</h2>
        <div className={`connection-status ${getConnectionStatusColor()}`}>
          {getConnectionStatusText()}
        </div>
      </div>

      <div className="notification-layout">
        {/* Left Column - Templates & Recipients */}
        <div className="notification-left">
          {/* Template Selection */}
          <div className="template-section">
            <h3>Message Template</h3>
            <div className="template-list">
              {templates.map(template => (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={`template-card ${selectedTemplate?.id === template.id ? 'template-card-active' : ''}`}
                >
                  <div className="template-icon">
                    {template.type === 'assignment' && '🚀'}
                    {template.type === 'reminder' && '⏰'}
                    {template.type === 'approval' && '✅'}
                    {template.type === 'completion' && '🎉'}
                  </div>
                  <div className="template-info">
                    <h4>{template.name}</h4>
                    <p>{template.message.substring(0, 60)}...</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recipients Selection */}
          <div className="recipients-section">
            <h3>Recipients</h3>
            <div className="recipients-list">
              {mockRecipients[userType as keyof typeof mockRecipients]?.map(recipient => (
                <div key={recipient.phone} className="recipient-item">
                  <label className="recipient-checkbox">
                    <input
                      type="checkbox"
                      checked={recipients.includes(recipient.phone)}
                      onChange={() => handleRecipientToggle(recipient.phone)}
                    />
                    <span className="checkmark"></span>
                  </label>
                  <div className="recipient-info">
                    <strong>{recipient.name}</strong>
                    <span>{recipient.phone}</span>
                    <span className="recipient-role">{recipient.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Message Preview & Sending */}
        <div className="notification-right">
          {/* Variables Editor */}
          {selectedTemplate && selectedTemplate.variables.length > 0 && (
            <div className="variables-section">
              <h3>Customize Message</h3>
              <div className="variables-grid">
                {selectedTemplate.variables.map(variable => (
                  <div key={variable} className="variable-field">
                    <label>{variable.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
                    <input
                      type="text"
                      value={variables[variable] || ''}
                      onChange={(e) => handleVariableChange(variable, e.target.value)}
                      placeholder={`Enter ${variable}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Message Preview */}
          <div className="preview-section">
            <h3>Message Preview</h3>
            <div className="message-preview">
              <div className="whatsapp-header">
                <div className="wa-contact">WhatsApp Business</div>
                <div className="wa-time">{new Date().toLocaleTimeString()}</div>
              </div>
              <div className="wa-message">
                {customMessage.split('\n').map((line, index) => (
                  <div key={index} className="message-line">
                    {line}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Send Button */}
          <div className="send-section">
            <button
              onClick={handleSendMessage}
              disabled={isSending || recipients.length === 0 || connectionStatus !== 'connected'}
              className="btn-whatsapp"
            >
              {isSending ? (
                <>
                  <div className="send-spinner"></div>
                  Sending...
                </>
              ) : (
                <>
                  📱 Send to {recipients.length} {recipients.length === 1 ? 'recipient' : 'recipients'}
                </>
              )}
            </button>

            {recipients.length === 0 && (
              <p className="warning-text">Please select at least one recipient</p>
            )}
          </div>

          {/* Results */}
          {sendResults.length > 0 && (
            <div className="results-section">
              <h4>Send Results</h4>
              <div className="results-list">
                {sendResults.map((result, index) => (
                  <div key={index} className={`result-item ${result.success ? 'result-success' : 'result-error'}`}>
                    <span className="result-icon">
                      {result.success ? '✅' : '❌'}
                    </span>
                    <div className="result-info">
                      <strong>{result.to}</strong>
                      <span>{result.success ? 'Message sent successfully' : result.error}</span>
                      {result.messageId && (
                        <small>ID: {result.messageId}</small>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationManager;