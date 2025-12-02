"use client";

import { useState } from "react";

interface ProjectFormProps {
  isVisible?: boolean;
}

export default function ProjectForm({ isVisible = false }: ProjectFormProps) {
  const [showForm, setShowForm] = useState(isVisible);

  return (
    <div style={{ marginBottom: "var(--space-2xl)" }}>
      {!showForm && (
        <div style={{ textAlign: "center", marginBottom: "var(--space-2xl)" }}>
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-lg"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--space-sm)",
              boxShadow: "var(--shadow-lg)",
              position: "relative",
              overflow: "hidden"
            }}
          >
            <span style={{ fontSize: "1.125rem" }}>✨</span>
            Create New Project
          </button>
        </div>
      )}

      {showForm && (
        <div style={{
          animation: "slideInDown 0.3s ease-out"
        }}>
          <form action="/api/projects" method="post" style={{ 
            background: "var(--bg-elevated)",
            padding: "var(--space-2xl)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border-light)",
            boxShadow: "var(--shadow-xl)",
            backdropFilter: "blur(10px)"
          }} className="project-form">
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "flex-start", 
              marginBottom: "var(--space-xl)" 
            }}>
              <div>
                <h3 style={{ 
                  fontSize: "1.5rem", 
                  fontWeight: "700",
                  color: "var(--text-primary)",
                  marginBottom: "var(--space-xs)",
                  letterSpacing: "-0.01em"
                }}>
                  Create New Project
                </h3>
                <p style={{
                  fontSize: "0.875rem",
                  color: "var(--text-tertiary)",
                  lineHeight: "1.4"
                }}>
                  Add a new project to your portfolio
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-ghost btn-sm"
                style={{
                  minWidth: "auto",
                  padding: "var(--space-sm)"
                }}
              >
                ✕
              </button>
            </div>
          
            <div style={{ display: "grid", gap: "var(--space-lg)", marginBottom: "var(--space-xl)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-lg)" }} className="form-row">
                <div>
                  <label style={{ 
                    display: "block", 
                    fontSize: "0.875rem", 
                    fontWeight: "500", 
                    color: "var(--text-secondary)", 
                    marginBottom: "var(--space-sm)" 
                  }}>
                    Project Name *
                  </label>
                  <input 
                    name="name" 
                    placeholder="My Awesome Project" 
                    required 
                    style={{
                      background: "var(--bg-secondary)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius)",
                      transition: "var(--transition)"
                    }}
                  />
                </div>
                <div>
                  <label style={{ 
                    display: "block", 
                    fontSize: "0.875rem", 
                    fontWeight: "500", 
                    color: "var(--text-secondary)", 
                    marginBottom: "var(--space-sm)" 
                  }}>
                    URL Slug *
                  </label>
                  <input 
                    name="slug" 
                    placeholder="my-awesome-project" 
                    required 
                    style={{
                      background: "var(--bg-secondary)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius)",
                      fontFamily: "ui-monospace, monospace",
                      transition: "var(--transition)"
                    }}
                  />
                </div>
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-lg)" }} className="form-row">
                <div>
                  <label style={{ 
                    display: "block", 
                    fontSize: "0.875rem", 
                    fontWeight: "500", 
                    color: "var(--text-secondary)", 
                    marginBottom: "var(--space-sm)" 
                  }}>
                    GitHub Repository
                  </label>
                  <input 
                    name="repoFullName" 
                    placeholder="username/repository-name"
                    style={{
                      background: "var(--bg-secondary)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius)",
                      fontFamily: "ui-monospace, monospace",
                      transition: "var(--transition)"
                    }}
                  />
                </div>
                <div>
                  <label style={{ 
                    display: "block", 
                    fontSize: "0.875rem", 
                    fontWeight: "500", 
                    color: "var(--text-secondary)", 
                    marginBottom: "var(--space-sm)" 
                  }}>
                    Live URL
                  </label>
                  <input 
                    name="liveUrl" 
                    placeholder="https://myproject.com"
                    style={{
                      background: "var(--bg-secondary)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius)",
                      transition: "var(--transition)"
                    }}
                  />
                </div>
              </div>
              
              <div>
                <label style={{ 
                  display: "block", 
                  fontSize: "0.875rem", 
                  fontWeight: "500", 
                  color: "var(--text-secondary)", 
                  marginBottom: "var(--space-sm)" 
                }}>
                  Completion Status
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
                  <input 
                    name="completionPct" 
                    id="completionPct"
                    type="number" 
                    min="0" 
                    max="100" 
                    defaultValue="0"
                    placeholder="0" 
                    style={{ 
                      width: "100px",
                      background: "var(--bg-secondary)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius)",
                      textAlign: "center",
                      fontFamily: "ui-monospace, monospace",
                      transition: "var(--transition)"
                    }}
                  />
                  <span style={{ 
                    color: "var(--text-tertiary)", 
                    fontSize: "0.875rem",
                    fontWeight: "500"
                  }}>
                    % complete
                  </span>
                </div>
              </div>
            </div>
            
            <div style={{ display: "flex", gap: "var(--space-md)", justifyContent: "flex-end" }}>
              <button 
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="btn"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-sm)"
                }}
              >
                <span>✨</span>
                Create Project
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}