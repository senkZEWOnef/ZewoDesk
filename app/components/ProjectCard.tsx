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
    status: {
      lastCommitAt: Date | null;
      lastDeployAt: Date | null;
      lastDeployState: string | null;
    } | null;
  };
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [showDeleteMenu, setShowDeleteMenu] = useState(false);

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

  return (
    <Link href={`/projects/${project.slug}`} style={{ textDecoration: "none" }}>
      <article className="project-card" style={{ position: "relative" }}>
        <button
          onClick={handleDelete}
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
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
            opacity: 0,
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
        
        <div className="project-stats" style={{ marginBottom: "16px" }}>
          <div>Last commit: {project.status?.lastCommitAt?.toISOString()?.slice(0, 19).replace('T', ' ') ?? "—"}</div>
          <div>Last deploy: {project.status?.lastDeployAt?.toISOString()?.slice(0, 19).replace('T', ' ') ?? "—"}</div>
          <div>Deploy state: {project.status?.lastDeployState ?? "—"}</div>
        </div>

        <div className="project-links">
          {project.repoFullName && (
            <a 
              href={`https://github.com/${project.repoFullName}`} 
              target="_blank" 
              rel="noreferrer"
              className="project-link"
              onClick={(e) => e.stopPropagation()}
            >
              <span>📁</span>
              {project.repoFullName}
            </a>
          )}
          {project.liveUrl && (
            <a 
              href={project.liveUrl} 
              target="_blank" 
              rel="noreferrer"
              className="project-link"
              onClick={(e) => e.stopPropagation()}
            >
              <span>🌐</span>
              Live Site
            </a>
          )}
        </div>
      </article>
    </Link>
  );
}