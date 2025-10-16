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
    status: {
      lastCommitAt: Date | null;
      lastDeployAt: Date | null;
      lastDeployState: string | null;
    } | null;
  };
}

export default function ProjectCard({ project }: ProjectCardProps) {
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
    
    if (confirm(`Are you sure you want to delete "${project.name}"?`)) {
      try {
        const response = await fetch(`/api/projects/${project.slug}`, {
          method: "DELETE"
        });
        
        if (response.ok) {
          window.location.reload();
        } else {
          alert("Failed to delete project");
        }
      } catch (error) {
        console.error("Delete failed:", error);
        alert("Failed to delete project");
      }
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
    <Link href={`/projects/${project.slug}`} style={{ textDecoration: "none" }}>
      <article 
        className={`project-card ${project.previewImage ? 'project-card-with-preview' : ''}`}
        style={{ 
          position: "relative",
          ...(project.previewImage && {
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url(${project.previewImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'top center',
            color: '#ffffff'
          })
        }}
      >
        <div style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          display: "flex",
          gap: "8px",
          opacity: 0.3,
          transition: "all 0.2s ease"
        }} className="project-actions">
          {project.liveUrl && (
            <button
              onClick={handleGenerateScreenshot}
              disabled={isGeneratingScreenshot}
              style={{
                background: "transparent",
                border: "1px solid var(--border)",
                color: project.previewImage ? "var(--text-muted)" : "var(--accent-blue)",
                borderRadius: "4px",
                width: "24px",
                height: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: isGeneratingScreenshot ? "not-allowed" : "pointer",
                fontSize: "12px",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                if (!isGeneratingScreenshot) {
                  e.currentTarget.style.borderColor = "var(--accent-blue)";
                  e.currentTarget.style.color = "var(--accent-blue)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.color = project.previewImage ? "var(--text-muted)" : "var(--accent-blue)";
              }}
              title={isGeneratingScreenshot ? "Generating..." : "Generate screenshot"}
            >
              {isGeneratingScreenshot ? "⏳" : "📸"}
            </button>
          )}
          <button
            onClick={handleEdit}
            style={{
              background: "transparent",
              border: "1px solid var(--border)",
              color: "var(--text-muted)",
              borderRadius: "4px",
              width: "24px",
              height: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: "12px",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--accent-green)";
              e.currentTarget.style.color = "var(--accent-green)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.color = "var(--text-muted)";
            }}
            title="Edit project"
          >
            ✏️
          </button>
          <button
            onClick={handleDelete}
            style={{
              background: "transparent",
              border: "1px solid var(--border)",
              color: "var(--text-muted)",
              borderRadius: "4px",
              width: "24px",
              height: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: "12px",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--accent-red)";
              e.currentTarget.style.color = "var(--accent-red)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.color = "var(--text-muted)";
            }}
            title="Delete project"
          >
            ×
          </button>
        </div>
        
        <div className="project-header">
          <div>
            <h2 className="project-title">{project.name}</h2>
            <div className="project-slug">{project.slug}</div>
          </div>
          <div className="project-stats">
            <div>
              <span className={`status-indicator ${project.status?.lastCommitAt ? 'status-active' : 'status-inactive'}`}></span>
              {project.status?.lastCommitAt ? 'Active' : 'No commits'}
            </div>
          </div>
        </div>
        
        {/* Completion Progress Bar */}
        <div style={{ marginBottom: "16px" }}>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            marginBottom: "4px" 
          }}>
            <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Progress</span>
            <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{project.completionPct || 0}%</span>
          </div>
          <div style={{
            width: "100%",
            height: "6px",
            background: "var(--bg-tertiary)",
            borderRadius: "3px",
            overflow: "hidden"
          }}>
            <div style={{
              width: `${project.completionPct || 0}%`,
              height: "100%",
              background: project.completionPct === 100 
                ? "var(--accent-green)" 
                : project.completionPct && project.completionPct > 50 
                  ? "var(--accent-blue)" 
                  : "var(--accent-purple)",
              transition: "width 0.3s ease"
            }} />
          </div>
        </div>
        
        <div className="project-stats" style={{ marginBottom: "16px" }}>
          <div>Last commit: {project.status?.lastCommitAt?.toISOString()?.slice(0, 19).replace('T', ' ') ?? "—"}</div>
          <div>Last deploy: {project.status?.lastDeployAt?.toISOString()?.slice(0, 19).replace('T', ' ') ?? "—"}</div>
          <div>Deploy state: {project.status?.lastDeployState ?? "—"}</div>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <div style={{
            background: "var(--bg-tertiary)",
            padding: "16px",
            borderRadius: "8px",
            marginBottom: "16px",
            border: "1px solid var(--border)"
          }}>
            <h4 style={{ marginBottom: "12px", fontSize: "14px", color: "var(--text-primary)" }}>Edit Project</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({...editData, name: e.target.value})}
                placeholder="Project Name"
                style={{ fontSize: "12px", padding: "8px" }}
              />
              <input
                type="text"
                value={editData.repoFullName}
                onChange={(e) => setEditData({...editData, repoFullName: e.target.value})}
                placeholder="GitHub repo (username/repo-name)"
                style={{ fontSize: "12px", padding: "8px" }}
              />
              <input
                type="text"
                value={editData.liveUrl}
                onChange={(e) => setEditData({...editData, liveUrl: e.target.value})}
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

        <div className="project-links">
          {project.repoFullName && (
            <div 
              className="project-link"
              onClick={(e) => {
                e.stopPropagation();
                window.open(`https://github.com/${project.repoFullName}`, '_blank');
              }}
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
                window.open(project.liveUrl!, '_blank');
              }}
            >
              <span>🌐</span>
              Live Site
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}