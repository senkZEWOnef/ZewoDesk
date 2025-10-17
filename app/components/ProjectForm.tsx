"use client";

import { useState } from "react";

interface ProjectFormProps {
  isVisible?: boolean;
}

export default function ProjectForm({ isVisible = false }: ProjectFormProps) {
  const [showForm, setShowForm] = useState(isVisible);

  return (
    <div style={{ marginBottom: "32px" }}>
      {!showForm && (
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <button
            onClick={() => setShowForm(true)}
            style={{
              background: "var(--accent-blue)",
              color: "white",
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.2s ease"
            }}
          >
            <span>➕</span>
            Add Project
          </button>
        </div>
      )}

      {showForm && (
        <form action="/api/projects" method="post" style={{ 
          background: "var(--bg-secondary)",
          padding: "24px",
          borderRadius: "12px",
          border: "1px solid var(--border)"
        }} className="project-form">
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            marginBottom: "16px" 
          }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600" }}>Add New Project</h3>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              style={{
                background: "transparent",
                border: "1px solid var(--border)",
                color: "var(--text-secondary)",
                padding: "4px 8px",
                borderRadius: "4px",
                fontSize: "14px",
                cursor: "pointer"
              }}
            >
              ✕ Cancel
            </button>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }} className="form-row">
            <input name="name" placeholder="Project Name" required />
            <input name="slug" placeholder="project-slug" required />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }} className="form-row">
            <input name="repoFullName" placeholder="username/repo-name (GitHub)" />
            <input name="liveUrl" placeholder="https://app.example.com" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px", marginBottom: "16px" }} className="form-row">
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <label htmlFor="completionPct" style={{ color: "var(--text-secondary)", fontSize: "14px", minWidth: "120px" }}>
                Completion: 
              </label>
              <input 
                name="completionPct" 
                id="completionPct"
                type="number" 
                min="0" 
                max="100" 
                defaultValue="0"
                placeholder="0" 
                style={{ width: "80px" }}
              />
              <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}>%</span>
            </div>
          </div>
          <button type="submit">Add Project</button>
        </form>
      )}
    </div>
  );
}