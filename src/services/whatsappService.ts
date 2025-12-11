// Mock WhatsApp service - in real app, this would connect to Twilio API
export interface WhatsAppMessage {
  to: string;
  message: string;
  type: 'assignment' | 'reminder' | 'approval' | 'completion';
  priority: 'low' | 'medium' | 'high';
}

export interface NotificationTemplate {
  id: string;
  name: string;
  type: string;
  message: string;
  variables: string[];
}

class WhatsAppService {
  private isConnected: boolean = false;
  private messageTemplates: NotificationTemplate[] = [
    {
      id: 'task_assignment',
      name: 'Task Assignment',
      type: 'assignment',
      message: `🚀 *New Task Assigned!*

*Task:* {taskName}
*Department:* {department}
*Due Date:* {dueDate}
*Priority:* {priority}

*Instructions:*
{instructions}

Please check the portal for more details and attached documents.

Best regards,
{organizationName}`,
      variables: ['taskName', 'department', 'dueDate', 'priority', 'instructions', 'organizationName']
    },
    {
      id: 'task_reminder',
      name: 'Task Reminder',
      type: 'reminder',
      message: `⏰ *Task Reminder*

*Task:* {taskName}
*Due Date:* {dueDate}
*Status:* {status}

This task is due soon. Please complete it before the deadline.

Thank you,
{organizationName}`,
      variables: ['taskName', 'dueDate', 'status', 'organizationName']
    },
    {
      id: 'document_approval',
      name: 'Document Approval',
      type: 'approval',
      message: `✅ *Document Ready for Approval*

*Document:* {documentName}
*Activity:* {activityName}
*Submitted By:* {submittedBy}

Please review and approve this document at your earliest convenience.

Best regards,
{organizationName}`,
      variables: ['documentName', 'activityName', 'submittedBy', 'organizationName']
    },
    {
      id: 'task_completion',
      name: 'Task Completion',
      type: 'completion',
      message: `🎉 *Task Completed!*

*Task:* {taskName}
*Completed By:* {completedBy}
*Completion Date:* {completionDate}

The task has been marked as completed. Great work! 🎊

Best regards,
{organizationName}`,
      variables: ['taskName', 'completedBy', 'completionDate', 'organizationName']
    }
  ];

  // Simulate connecting to WhatsApp
  async connect(): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.isConnected = true;
        console.log('✅ WhatsApp service connected');
        resolve(true);
      }, 1000);
    });
  }

  // Send a message
  async sendMessage(message: WhatsAppMessage): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.isConnected) {
      await this.connect();
    }

    // Simulate API call delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.1; // 90% success rate for simulation
        
        if (success) {
          const messageId = 'WA_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
          console.log('📱 WhatsApp message sent:', {
            to: message.to,
            type: message.type,
            message: message.message.substring(0, 50) + '...'
          });
          
          resolve({ success: true, messageId });
        } else {
          resolve({ success: false, error: 'Failed to send message. Please try again.' });
        }
      }, 2000);
    });
  }

  // Send bulk messages
  async sendBulkMessages(messages: WhatsAppMessage[]): Promise<{ success: boolean; results: any[] }> {
    const results = [];
    
    for (const message of messages) {
      const result = await this.sendMessage(message);
      results.push({
        to: message.to,
        success: result.success,
        messageId: result.messageId,
        error: result.error
      });
    }

    const allSuccess = results.every(result => result.success);
    return { success: allSuccess, results };
  }

  // Get message templates
  getTemplates(): NotificationTemplate[] {
    return this.messageTemplates;
  }

  // Create custom template
  createTemplate(template: Omit<NotificationTemplate, 'id'>): NotificationTemplate {
    const newTemplate = {
      ...template,
      id: 'template_' + Date.now()
    };
    
    this.messageTemplates.push(newTemplate);
    return newTemplate;
  }

  // Format message with variables
  formatMessage(template: NotificationTemplate, variables: Record<string, string>): string {
    let message = template.message;
    
    template.variables.forEach(variable => {
      const value = variables[variable] || `{${variable}}`;
      message = message.replace(new RegExp(`{${variable}}`, 'g'), value);
    });

    return message;
  }

  // Simulate message delivery status
  async getMessageStatus(messageId: string): Promise<'sent' | 'delivered' | 'read' | 'failed'> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const statuses: ('sent' | 'delivered' | 'read' | 'failed')[] = ['sent', 'delivered', 'read', 'failed'];
        const randomStatus = statuses[Math.floor(Math.random() * 3)]; // Exclude 'failed' for most cases
        resolve(randomStatus);
      }, 1000);
    });
  }
}

export const whatsappService = new WhatsAppService();