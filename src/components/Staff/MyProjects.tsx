import React, { useState } from 'react';

interface Project {
  id: string;
  title: string;
  description: string;
  department: string;
  category: string;
  status: 'planning' | 'active' | 'completed' | 'on-hold';
  startDate: string;
  endDate: string;
  progress: number;
  tasks: number;
  completedTasks: number;
  documents: number;
  assignedBy: string;
}

const MyProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      title: 'Community Development Initiative 2024',
      description: 'Comprehensive development program for rural communities including infrastructure, education, and healthcare components.',
      department: 'Community and Rural Development',
      category: 'Community Development',
      status: 'active',
      startDate: '2024-01-15',
      endDate: '2024-12-31',
      progress: 75,
      tasks: 12,
      completedTasks: 9,
      documents: 24,
      assignedBy: 'HOD Community Development'
    },
    {
      id: '2',
      title: 'Flood Relief Program - Northern Region',
      description: 'Emergency relief distribution and rehabilitation for flood-affected communities in the northern region.',
      department: 'Community and Rural Development',
      category: 'Relief Distribution',
      status: 'active',
      startDate: '2024-02-01',
      endDate: '2024-06-30',
      progress: 45,
      tasks: 8,
      completedTasks: 3,
      documents: 16,
      assignedBy: 'HOD Community Development'
    },
    {
      id: '3',
      title: 'Rural School Infrastructure Project',
      description: 'Construction and renovation of school buildings in rural communities to improve educational access.',
      department: 'Community and Rural Development',
      category: 'Infrastructure',
      status: 'planning',
      startDate: '2024-03-01',
      endDate: '2024-10-31',
      progress: 15,
      tasks: 6,
      completedTasks: 1,
      documents: 8,
      assignedBy: 'HOD Community Development'
    },
    {
      id: '4',
      title: 'Agricultural Support Program',
      description: 'Distribution of farming inputs and training for rural farmers to improve agricultural productivity.',
      department: 'Community and Rural Development',
      category: 'Agriculture',
      status: 'completed',
      startDate: '2023-09-01',
      endDate: '2024-01-31',
      progress: 100,
      tasks: 10,
      completedTasks: 10,
      documents: 32,
      assignedBy: 'HOD Community Development'
    }
  ]);

  const [selectedProject, setSelectedProject] = useState<Project | null>(projects[0]);
  const [filter, setFilter] = useState('all');

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(project => project.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'status-active';
      case 'completed': return 'status-completed';
      case 'planning': return 'status-planning';
      default: return 'status-on-hold';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return '🚀';
      case 'completed': return '✅';
      case 'planning': return '📋';
      default: return '⏸️';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Community Development': 'category-community',
      'Relief Distribution': 'category-relief',
      'Infrastructure': 'category-infrastructure',
      'Education': 'category-education',
      'Healthcare': 'category-healthcare',
      'Agriculture': 'category-agriculture'
    };
    return colors[category] || 'category-other';
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateTimeline = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    
    const totalDuration = end.getTime() - start.getTime();
    const elapsedDuration = today.getTime() - start.getTime();
    
    if (elapsedDuration <= 0) return 'Not started';
    if (elapsedDuration >= totalDuration) return 'Completed';
    
    const percentage = (elapsedDuration / totalDuration) * 100;
    return `${Math.round(percentage)}% completed`;
  };

  return (
    <div className="content-section">
      <div className="section-header">
        <div>
          <h2>My Projects</h2>
          <p>Overview of all projects you're involved in</p>
        </div>
        <div className="project-stats">
          <div className="stat">
            <span className="stat-number">{projects.length}</span>
            <span className="stat-label">Total Projects</span>
          </div>
          <div className="stat">
            <span className="stat-number">
              {projects.filter(p => p.status === 'active').length}
            </span>
            <span className="stat-label">Active</span>
          </div>
          <div className="stat">
            <span className="stat-number">
              {projects.reduce((acc, project) => acc + project.tasks, 0)}
            </span>
            <span className="stat-label">Total Tasks</span>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="filter-section">
        <div className="filter-buttons">
          <button 
            onClick={() => setFilter('all')}
            className={`filter-btn ${filter === 'all' ? 'filter-btn-active' : ''}`}
          >
            All Projects ({projects.length})
          </button>
          <button 
            onClick={() => setFilter('active')}
            className={`filter-btn ${filter === 'active' ? 'filter-btn-active' : ''}`}
          >
            Active ({projects.filter(p => p.status === 'active').length})
          </button>
          <button 
            onClick={() => setFilter('completed')}
            className={`filter-btn ${filter === 'completed' ? 'filter-btn-active' : ''}`}
          >
            Completed ({projects.filter(p => p.status === 'completed').length})
          </button>
          <button 
            onClick={() => setFilter('planning')}
            className={`filter-btn ${filter === 'planning' ? 'filter-btn-active' : ''}`}
          >
            Planning ({projects.filter(p => p.status === 'planning').length})
          </button>
        </div>
      </div>

      <div className="projects-layout">
        {/* Projects List */}
        <div className="projects-list-column">
          <h3>All Projects ({filteredProjects.length})</h3>
          <div className="projects-list">
            {filteredProjects.map(project => (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className={`project-item ${selectedProject?.id === project.id ? 'project-item-active' : ''}`}
              >
                <div className="project-item-header">
                  <h4>{project.title}</h4>
                  <div className="project-badges">
                    <span className={`status-badge ${getStatusColor(project.status)}`}>
                      {getStatusIcon(project.status)} {project.status}
                    </span>
                  </div>
                </div>

                <div className="project-category">
                  <span className={`category-badge ${getCategoryColor(project.category)}`}>
                    {project.category}
                  </span>
                </div>

                <p className="project-item-description">
                  {project.description.substring(0, 100)}...
                </p>

                <div className="project-meta">
                  <div className="meta-item">
                    <span className="meta-label">Timeline:</span>
                    <span className="meta-value">
                      {formatDate(project.startDate)} - {formatDate(project.endDate)}
                    </span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Progress:</span>
                    <span className="meta-value">{calculateTimeline(project.startDate, project.endDate)}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="project-progress">
                  <div className="progress-header">
                    <span>Overall Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="project-stats-mini">
                  <div className="stat-mini">
                    <span className="stat-number">{project.tasks}</span>
                    <span className="stat-label">Tasks</span>
                  </div>
                  <div className="stat-mini">
                    <span className="stat-number">{project.documents}</span>
                    <span className="stat-label">Docs</span>
                  </div>
                  <div className="stat-mini">
                    <span className="stat-number">{project.completedTasks}/{project.tasks}</span>
                    <span className="stat-label">Completed</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Details */}
        <div className="project-details-column">
          {selectedProject ? (
            <div className="project-details-card">
              <div className="card-header">
                <h3>{selectedProject.title}</h3>
                <div className="project-status">
                  <span className={`status-badge-large ${getStatusColor(selectedProject.status)}`}>
                    {getStatusIcon(selectedProject.status)} {selectedProject.status}
                  </span>
                </div>
              </div>

              <div className="project-category-large">
                <span className={`category-badge-large ${getCategoryColor(selectedProject.category)}`}>
                  {selectedProject.category}
                </span>
              </div>

              <div className="project-description">
                <h5>Project Description</h5>
                <p>{selectedProject.description}</p>
              </div>

              <div className="project-details-grid">
                <div className="detail-item">
                  <span className="detail-label">Department</span>
                  <span className="detail-value">{selectedProject.department}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Assigned By</span>
                  <span className="detail-value">{selectedProject.assignedBy}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Start Date</span>
                  <span className="detail-value">{formatDate(selectedProject.startDate)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">End Date</span>
                  <span className="detail-value">{formatDate(selectedProject.endDate)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Duration</span>
                  <span className="detail-value">
                    {calculateTimeline(selectedProject.startDate, selectedProject.endDate)}
                  </span>
                </div>
              </div>

              {/* Progress Section */}
              <div className="progress-section-large">
                <h5>Project Progress</h5>
                <div className="progress-overview">
                  <div className="progress-item">
                    <span>Overall Progress</span>
                    <div className="progress-with-bar">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${selectedProject.progress}%` }}
                        ></div>
                      </div>
                      <span className="progress-percentage">{selectedProject.progress}%</span>
                    </div>
                  </div>
                  <div className="progress-item">
                    <span>Tasks Completion</span>
                    <div className="progress-with-bar">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ 
                            width: `${(selectedProject.completedTasks / selectedProject.tasks) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <span className="progress-percentage">
                        {selectedProject.completedTasks}/{selectedProject.tasks} tasks
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="project-actions">
                <button className="btn-primary">
                  📋 View Tasks
                </button>
                <button className="btn-secondary">
                  📁 View Documents
                </button>
                <button className="btn-whatsapp">
                  📱 Contact Supervisor
                </button>
              </div>

              {/* Timeline */}
              <div className="project-timeline">
                <h5>Project Timeline</h5>
                <div className="timeline-visual">
                  <div className="timeline-bar">
                    <div 
                      className="timeline-progress"
                      style={{ 
                        width: `${selectedProject.progress}%` 
                      }}
                    ></div>
                  </div>
                  <div className="timeline-dates">
                    <span>{formatDate(selectedProject.startDate)}</span>
                    <span>Today</span>
                    <span>{formatDate(selectedProject.endDate)}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="project-details-placeholder">
              <div className="placeholder-content">
                <span className="placeholder-icon">📊</span>
                <h3>Select a Project</h3>
                <p>Click on a project from the list to view detailed information</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProjects;