"use client";

import Link from "next/link";
import { useState } from "react";

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    slug: string;
    repoFullName: string | null;
    liveUrl: string | null;
    previewImage: string | null;
    completionPct: number | null;
    ProjectStatus: {
      lastCommitAt: Date | null;
      lastDeployAt: Date | null;
      lastDeployState: string | null;
    } | null;
  };
  visitorMode?: boolean;
}

export default function ProjectCard({ project, visitorMode = false }: ProjectCardProps) {
  const [showDeleteMenu, setShowDeleteMenu] = useState(false);
  const [isGeneratingScreenshot, setIsGeneratingScreenshot] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: project.name,
    repoFullName: project.repoFullName || '',
    liveUrl: project.liveUrl || '',
    completionPct: project.completionPct || 0
  });

  const handleGenerateScreenshot = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!project.liveUrl) {
      alert("Project needs a live URL to generate screenshot");
      return;
    }

    setIsGeneratingScreenshot(true);
    try {
      const response = await fetch(`/api/projects/${project.slug}/screenshot`, {
        method: "POST"
      });
      
      if (response.ok) {
        window.location.reload();
      } else {
        alert("Failed to generate screenshot");
      }
    } catch (error) {
      console.error("Screenshot generation failed:", error);
      alert("Failed to generate screenshot");
    } finally {
      setIsGeneratingScreenshot(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // First confirm deletion
    if (!confirm(`Are you sure you want to delete "${project.name}"?`)) {
      return;
    }

    // Then require password
    const password = prompt('Enter admin password to confirm deletion:');
    if (password !== 'Poesie509$$$') {
      if (password !== null) {
        alert('Incorrect password. Deletion cancelled.');
      }
      return;
    }

    // Proceed with deletion
    try {
      const response = await fetch(`/api/projects/${project.slug}`, {
        method: "DELETE"
      });
      
      if (response.ok) {
        alert(`"${project.name}" has been deleted successfully.`);
        window.location.reload();
      } else {
        alert("Failed to delete project");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete project");
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleSaveEdit = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const response = await fetch(`/api/projects/${project.slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(editData)
      });
      
      if (response.ok) {
        window.location.reload();
      } else {
        alert("Failed to update project");
      }
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update project");
    }
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(false);
    setEditData({
      name: project.name,
      repoFullName: project.repoFullName || '',
      liveUrl: project.liveUrl || '',
      completionPct: project.completionPct || 0
    });
  };

  return (
    <article 
      className={`project-card ${project.previewImage ? 'project-card-with-preview' : ''}`}
      style={{ 
        position: "relative",
        textDecoration: "none",
        cursor: "pointer",
        ...(project.previewImage && {
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url(${project.previewImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'top center',
          color: '#ffffff'
        })
      }}
    >
      {/* Clickable overlay for navigation - only when not in visitor mode */}
      {!visitorMode && (
        <Link 
          href={`/projects/${project.slug}`} 
          style={{ 
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            textDecoration: 'none'
          }}
        />
      )}
      {!visitorMode && (
        <div style={{
          position: "absolute",
          top: "var(--space-lg)",
          right: "var(--space-lg)",
          display: "flex",
          gap: "var(--space-sm)",
          opacity: 0.3,
          transition: "var(--transition)",
          zIndex: 20
        }} className="project-actions">
        {project.liveUrl && (
          <button
            type="button"
            onMouseDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleGenerateScreenshot(e);
            }}
            disabled={isGeneratingScreenshot}
            className="btn-ghost btn-sm"
            style={{
              minWidth: "auto",
              width: "32px",
              height: "32px",
              padding: 0,
              fontSize: "0.875rem",
              backdropFilter: "blur(10px)",
              background: "var(--bg-glass)",
              position: "relative",
              zIndex: 21
            }}
            title={isGeneratingScreenshot ? "Generating..." : "Generate screenshot"}
          >
            {isGeneratingScreenshot ? "⏳" : "📸"}
          </button>
        )}
        <button
          type="button"
          onMouseDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            handleEdit(e);
          }}
          className="btn-ghost btn-sm"
          style={{
            minWidth: "auto",
            width: "32px",
            height: "32px",
            padding: 0,
            fontSize: "0.875rem",
            backdropFilter: "blur(10px)",
            background: "var(--bg-glass)",
            position: "relative",
            zIndex: 21
          }}
          title="Edit project"
        >
          ✏️
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            handleDelete(e);
          }}
          className="btn-danger btn-sm"
          style={{
            minWidth: "auto",
            width: "32px",
            height: "32px",
            padding: 0,
            fontSize: "0.875rem",
            backdropFilter: "blur(10px)",
            background: "rgba(239, 68, 68, 0.8)",
            position: "relative",
            zIndex: 21
          }}
          title="Delete project"
        >
          ×
        </button>
        </div>
      )}
        
      {/* Project content with proper z-index */}
      <div style={{ position: 'relative', zIndex: 10, pointerEvents: 'none' }}>
        <div className="project-header">
          <div style={{ flex: 1 }}>
            <h2 className="project-title">{project.name}</h2>
            <div className="project-slug">{project.slug}</div>
          </div>
          <div className="project-stats">
            <div className={`status-indicator ${project.ProjectStatus?.lastCommitAt ? 'status-active' : 'status-inactive'}`}>
              {project.ProjectStatus?.lastCommitAt ? 'Active' : 'Inactive'}
            </div>
          </div>
        </div>
        
        {!visitorMode && (
          <>
            {/* Modern Completion Progress */}
            <div className="project-completion">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${project.completionPct || 0}%` }}
                />
              </div>
              <span className="progress-text">{project.completionPct || 0}%</span>
            </div>
            
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "1fr 1fr", 
              gap: "var(--space-sm)", 
              marginBottom: "var(--space-lg)",
              fontSize: "0.75rem",
              color: "var(--text-tertiary)"
            }}>
              <div>
                <span style={{ fontWeight: "500" }}>Last commit:</span><br />
                {project.ProjectStatus?.lastCommitAt ? new Date(project.ProjectStatus.lastCommitAt).toLocaleDateString() : "—"}
              </div>
              <div>
                <span style={{ fontWeight: "500" }}>Deploy:</span><br />
                {project.ProjectStatus?.lastDeployState ?? "—"}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Edit Form with proper z-index */}
      {!visitorMode && isEditing && (
        <div 
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          style={{
            background: "var(--bg-tertiary)",
            padding: "var(--space-lg)",
            borderRadius: "var(--radius-md)",
            marginBottom: "var(--space-lg)",
            border: "1px solid var(--border)",
            position: "relative",
            zIndex: 30,
            pointerEvents: "auto"
          }}>
            <h4 style={{ marginBottom: "12px", fontSize: "14px", color: "var(--text-primary)" }}>Edit Project</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({...editData, name: e.target.value})}
                onClick={(e) => e.stopPropagation()}
                placeholder="Project Name"
                style={{ fontSize: "12px", padding: "8px" }}
              />
              <input
                type="text"
                value={editData.repoFullName}
                onChange={(e) => setEditData({...editData, repoFullName: e.target.value})}
                onClick={(e) => e.stopPropagation()}
                placeholder="GitHub repo (username/repo-name)"
                style={{ fontSize: "12px", padding: "8px" }}
              />
              <input
                type="text"
                value={editData.liveUrl}
                onChange={(e) => setEditData({...editData, liveUrl: e.target.value})}
                onClick={(e) => e.stopPropagation()}
                placeholder="Live URL"
                style={{ fontSize: "12px", padding: "8px" }}
              />
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editData.completionPct}
                  onChange={(e) => setEditData({...editData, completionPct: parseInt(e.target.value) || 0})}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="0"
                  style={{ fontSize: "12px", padding: "8px", width: "60px" }}
                />
                <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>% complete</span>
              </div>
              <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                <button
                  onClick={handleSaveEdit}
                  style={{
                    background: "var(--accent-green)",
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    cursor: "pointer"
                  }}
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  style={{
                    background: "transparent",
                    color: "var(--text-secondary)",
                    border: "1px solid var(--border)",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      {/* Project Links with proper z-index */}
      <div 
        className="project-links"
        style={{
          position: "relative",
          zIndex: 15,
          pointerEvents: "auto"
        }}
      >
        {project.repoFullName && (
          <div 
            className="project-link"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              window.open(`https://github.com/${project.repoFullName}`, '_blank');
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <span>📁</span>
            {project.repoFullName}
          </div>
        )}
        {project.liveUrl && (
          <div 
            className="project-link"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              window.open(project.liveUrl!, '_blank');
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <span>🌐</span>
            Live Site
          </div>
        )}
      </div>
    </article>
  );
}