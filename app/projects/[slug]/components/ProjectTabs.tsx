"use client";

import { useState } from "react";

interface Project {
  id: string;
  name: string;
  slug: string;
  repoFullName: string | null;
  liveUrl: string | null;
  ProjectDocs: {
    readmeMd: string | null;
    notesMd: string;
    brainstormingMd: string;
    dbDiagramData: string | null;
  } | null;
  IntegrationEvent: Array<{
    id: bigint;
    source: string;
    type: string;
    payload: any;
    occurredAt: Date;
  }>;
}

interface ProjectTabsProps {
  project: Project;
}

export default function ProjectTabs({ project }: ProjectTabsProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [notes, setNotes] = useState(project.ProjectDocs?.notesMd || "");
  const [brainstorm, setBrainstorm] = useState(project.ProjectDocs?.brainstormingMd || "");
  const [isEditing, setIsEditing] = useState({ notes: false, brainstorm: false });
  const [dbDiagram, setDbDiagram] = useState<string | null>(() => {
    // Try to load from database first, then fallback to localStorage
    const dbData = project.ProjectDocs?.dbDiagramData;
    if (dbData) return dbData;
    
    // Fallback to localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`db-diagram-${project.slug}`);
      return stored;
    }
    
    return null;
  });
  const [diagramMode, setDiagramMode] = useState<'image' | 'text'>('image');
  const [diagramText, setDiagramText] = useState('');

  const saveNotes = async (type: "notes" | "brainstorm", content: string) => {
    try {
      const response = await fetch(`/api/projects/${project.slug}/docs`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          [type === "notes" ? "notesMd" : "brainstormingMd"]: content 
        })
      });
      
      if (response.ok) {
        setIsEditing(prev => ({ ...prev, [type]: false }));
      }
    } catch (error) {
      console.error("Failed to save:", error);
    }
  };

  const saveDiagram = async (diagramData: string | null) => {
    // Always save to localStorage immediately
    if (typeof window !== 'undefined') {
      if (diagramData) {
        localStorage.setItem(`db-diagram-${project.slug}`, diagramData);
        console.log("Diagram saved to localStorage");
      } else {
        localStorage.removeItem(`db-diagram-${project.slug}`);
        console.log("Diagram removed from localStorage");
      }
    }

    // Try to save to database, but don't fail if it doesn't work
    try {
      console.log("Attempting to save diagram to database for project:", project.slug);
      const response = await fetch(`/api/projects/${project.slug}/docs`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dbDiagramData: diagramData })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.warn("Database save failed, but localStorage saved:", response.status, errorText);
        return; // Don't throw error, localStorage is working
      }
      
      const result = await response.json();
      console.log("Diagram saved to database successfully:", result);
    } catch (error) {
      console.warn("Database save failed, but localStorage saved:", error);
      // Don't re-throw the error since localStorage worked
    }
  };

  const saveTextDiagram = async () => {
    await saveDiagram(diagramText);
    setDbDiagram(diagramText);
  };

  const isImageData = (data: string | null): boolean => {
    if (!data) return false;
    return data.startsWith('data:image/');
  };

  const handleDbDiagramUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const result = e.target?.result as string;
        setDbDiagram(result);
        await saveDiagram(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveDiagram = async () => {
    setDbDiagram(null);
    await saveDiagram(null);
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "readme", label: "README", icon: "📖" },
    { id: "notes", label: "Notes", icon: "📝" },
    { id: "brainstorm", label: "Brainstorm", icon: "💡" },
    { id: "dbdiagram", label: "DB diagram", icon: "🗃️" },
    { id: "activity", label: "Activity", icon: "🕒" }
  ];

  return (
    <div>
      {/* Tab Navigation */}
      <div style={{ 
        borderBottom: "1px solid var(--border)",
        marginBottom: "32px"
      }}>
        <div style={{ display: "flex", gap: "0" }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "16px 24px",
                border: "none",
                background: activeTab === tab.id ? "var(--bg-secondary)" : "transparent",
                color: activeTab === tab.id ? "var(--text-primary)" : "var(--text-secondary)",
                borderBottom: activeTab === tab.id ? "2px solid var(--accent-blue)" : "2px solid transparent",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.2s ease"
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div style={{ minHeight: "400px" }}>
        {activeTab === "overview" && (
          <div>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "2fr 1fr", 
              gap: "32px",
              marginBottom: "32px"
            }}>
              <div>
                <h3 style={{ marginBottom: "16px", fontSize: "20px" }}>Project Overview</h3>
                <div style={{ 
                  background: "var(--bg-secondary)",
                  padding: "24px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)"
                }}>
                  {project.ProjectDocs?.readmeMd ? (
                    <div style={{ 
                      whiteSpace: "pre-wrap",
                      fontSize: "14px",
                      lineHeight: "1.6",
                      color: "var(--text-secondary)"
                    }}>
                      {project.ProjectDocs.readmeMd.slice(0, 500)}...
                    </div>
                  ) : (
                    <div style={{ 
                      color: "var(--text-muted)",
                      fontStyle: "italic",
                      textAlign: "center",
                      padding: "32px"
                    }}>
                      No README available
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 style={{ marginBottom: "16px", fontSize: "20px" }}>Recent Activity</h3>
                <div style={{ 
                  background: "var(--bg-secondary)",
                  padding: "16px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)"
                }}>
                  {project.IntegrationEvent.length > 0 ? (
                    <div style={{ fontSize: "14px" }}>
                      {project.IntegrationEvent.slice(0, 5).map((event, i) => (
                        <div key={event.id.toString()} style={{ 
                          marginBottom: "12px",
                          paddingBottom: "12px",
                          borderBottom: i < 4 ? "1px solid var(--border)" : "none"
                        }}>
                          <div style={{ 
                            display: "flex", 
                            justifyContent: "space-between",
                            marginBottom: "4px"
                          }}>
                            <span style={{ color: "var(--text-primary)", fontWeight: "500" }}>
                              {event.source} {event.type}
                            </span>
                            <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>
                              {new Date(event.occurredAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div style={{ color: "var(--text-secondary)", fontSize: "12px" }}>
                            {event.payload?.commitMessage || event.payload?.message || "No details"}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ 
                      color: "var(--text-muted)",
                      fontStyle: "italic",
                      textAlign: "center",
                      padding: "16px"
                    }}>
                      No recent activity
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "readme" && (
          <div>
            <h3 style={{ marginBottom: "16px", fontSize: "20px" }}>README</h3>
            <div style={{ 
              background: "var(--bg-secondary)",
              padding: "24px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              minHeight: "400px"
            }}>
              {project.ProjectDocs?.readmeMd ? (
                <pre style={{ 
                  whiteSpace: "pre-wrap",
                  fontSize: "14px",
                  lineHeight: "1.6",
                  color: "var(--text-secondary)",
                  margin: 0
                }}>
                  {project.ProjectDocs.readmeMd}
                </pre>
              ) : (
                <div style={{ 
                  color: "var(--text-muted)",
                  fontStyle: "italic",
                  textAlign: "center",
                  padding: "64px"
                }}>
                  📖 No README available
                  {project.repoFullName && (
                    <div style={{ marginTop: "16px" }}>
                      <button
                        onClick={() => fetch(`/api/projects/${project.slug}/refresh`, { method: "POST" }).then(() => window.location.reload())}
                        style={{ fontSize: "14px" }}
                      >
                        Refresh from GitHub
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "notes" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "20px" }}>Notes</h3>
              <button
                onClick={() => {
                  if (isEditing.notes) {
                    saveNotes("notes", notes);
                  } else {
                    setIsEditing(prev => ({ ...prev, notes: true }));
                  }
                }}
                style={{ fontSize: "14px" }}
              >
                {isEditing.notes ? "💾 Save" : "✏️ Edit"}
              </button>
            </div>
            
            {isEditing.notes ? (
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Write your project notes here... (Markdown supported)"
                style={{ 
                  width: "100%",
                  minHeight: "400px",
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  padding: "16px",
                  color: "var(--text-primary)",
                  fontSize: "14px",
                  lineHeight: "1.6",
                  fontFamily: "Monaco, Consolas, monospace",
                  resize: "vertical"
                }}
              />
            ) : (
              <div style={{ 
                background: "var(--bg-secondary)",
                padding: "24px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                minHeight: "400px",
                cursor: "pointer"
              }}
              onClick={() => setIsEditing(prev => ({ ...prev, notes: true }))}
              >
                {notes ? (
                  <pre style={{ 
                    whiteSpace: "pre-wrap",
                    fontSize: "14px",
                    lineHeight: "1.6",
                    color: "var(--text-secondary)",
                    margin: 0
                  }}>
                    {notes}
                  </pre>
                ) : (
                  <div style={{ 
                    color: "var(--text-muted)",
                    fontStyle: "italic",
                    textAlign: "center",
                    padding: "64px"
                  }}>
                    📝 Click to add notes...
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "brainstorm" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "20px" }}>Brainstorm</h3>
              <button
                onClick={() => {
                  if (isEditing.brainstorm) {
                    saveNotes("brainstorm", brainstorm);
                  } else {
                    setIsEditing(prev => ({ ...prev, brainstorm: true }));
                  }
                }}
                style={{ fontSize: "14px" }}
              >
                {isEditing.brainstorm ? "💾 Save" : "✏️ Edit"}
              </button>
            </div>
            
            {isEditing.brainstorm ? (
              <textarea
                value={brainstorm}
                onChange={(e) => setBrainstorm(e.target.value)}
                placeholder="Brainstorm ideas, features, improvements... (Markdown supported)"
                style={{ 
                  width: "100%",
                  minHeight: "400px",
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  padding: "16px",
                  color: "var(--text-primary)",
                  fontSize: "14px",
                  lineHeight: "1.6",
                  fontFamily: "Monaco, Consolas, monospace",
                  resize: "vertical"
                }}
              />
            ) : (
              <div style={{ 
                background: "var(--bg-secondary)",
                padding: "24px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                minHeight: "400px",
                cursor: "pointer"
              }}
              onClick={() => setIsEditing(prev => ({ ...prev, brainstorm: true }))}
              >
                {brainstorm ? (
                  <pre style={{ 
                    whiteSpace: "pre-wrap",
                    fontSize: "14px",
                    lineHeight: "1.6",
                    color: "var(--text-secondary)",
                    margin: 0
                  }}>
                    {brainstorm}
                  </pre>
                ) : (
                  <div style={{ 
                    color: "var(--text-muted)",
                    fontStyle: "italic",
                    textAlign: "center",
                    padding: "64px"
                  }}>
                    💡 Click to start brainstorming...
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "dbdiagram" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "20px" }}>DB Diagram</h3>
              {!dbDiagram && (
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => setDiagramMode('image')}
                    style={{
                      background: diagramMode === 'image' ? "var(--accent-blue)" : "transparent",
                      color: diagramMode === 'image' ? "white" : "var(--text-secondary)",
                      border: "1px solid var(--border)",
                      padding: "6px 12px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      cursor: "pointer"
                    }}
                  >
                    📁 Image
                  </button>
                  <button
                    onClick={() => setDiagramMode('text')}
                    style={{
                      background: diagramMode === 'text' ? "var(--accent-blue)" : "transparent",
                      color: diagramMode === 'text' ? "white" : "var(--text-secondary)",
                      border: "1px solid var(--border)",
                      padding: "6px 12px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      cursor: "pointer"
                    }}
                  >
                    📝 Text
                  </button>
                </div>
              )}
            </div>
            
            <div style={{ 
              background: "var(--bg-secondary)",
              padding: "24px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              minHeight: "400px"
            }}>
              {dbDiagram ? (
                <div>
                  <div style={{ marginBottom: "16px", textAlign: "center" }}>
                    <button
                      onClick={handleRemoveDiagram}
                      style={{
                        background: "var(--accent-red)",
                        color: "white",
                        padding: "8px 16px",
                        borderRadius: "4px",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: "500"
                      }}
                    >
                      🗑️ Remove Diagram
                    </button>
                  </div>
                  
                  {isImageData(dbDiagram) ? (
                    <img
                      src={dbDiagram}
                      alt="Database Diagram"
                      style={{
                        width: "100%",
                        height: "auto",
                        borderRadius: "8px",
                        border: "1px solid var(--border)"
                      }}
                    />
                  ) : (
                    <pre style={{
                      whiteSpace: "pre-wrap",
                      fontSize: "12px",
                      lineHeight: "1.4",
                      color: "var(--text-secondary)",
                      margin: 0,
                      background: "var(--bg-tertiary)",
                      padding: "16px",
                      borderRadius: "6px",
                      border: "1px solid var(--border)",
                      overflow: "auto"
                    }}>
                      {dbDiagram}
                    </pre>
                  )}
                </div>
              ) : (
                <div>
                  {diagramMode === 'image' ? (
                    <div style={{ 
                      color: "var(--text-muted)",
                      fontStyle: "italic",
                      padding: "64px",
                      textAlign: "center"
                    }}>
                      <div style={{ fontSize: "48px", marginBottom: "16px" }}>🗃️</div>
                      <div style={{ fontSize: "18px", marginBottom: "8px" }}>Upload Database Diagram</div>
                      <div style={{ fontSize: "14px" }}>
                        Upload an image of your database diagram
                      </div>
                      <div style={{ marginTop: "24px" }}>
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          id="db-diagram-upload"
                          onChange={handleDbDiagramUpload}
                        />
                        <label
                          htmlFor="db-diagram-upload"
                          style={{
                            background: "var(--accent-blue)",
                            color: "white",
                            padding: "12px 24px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "14px",
                            fontWeight: "500",
                            display: "inline-block",
                            transition: "background 0.2s ease"
                          }}
                        >
                          📁 Upload Image
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ marginBottom: "16px" }}>
                        <div style={{ fontSize: "16px", marginBottom: "8px", color: "var(--text-primary)" }}>
                          📝 Text Diagram
                        </div>
                        <div style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
                          Paste your text-based database diagram (ASCII art, markdown, etc.)
                        </div>
                      </div>
                      <textarea
                        value={diagramText}
                        onChange={(e) => setDiagramText(e.target.value)}
                        placeholder="Paste your database diagram here...

Example:
┌─────────────────┐    ┌─────────────────┐
│     Project     │────│   ProjectDocs   │
├─────────────────┤    ├─────────────────┤
│ id (PK)         │    │ projectId (FK)  │
│ name            │    │ readmeMd        │
│ slug            │    │ notesMd         │
└─────────────────┘    └─────────────────┘"
                        style={{
                          width: "100%",
                          minHeight: "300px",
                          background: "var(--bg-tertiary)",
                          border: "1px solid var(--border)",
                          borderRadius: "6px",
                          padding: "16px",
                          color: "var(--text-primary)",
                          fontSize: "12px",
                          lineHeight: "1.4",
                          fontFamily: "Monaco, Consolas, monospace",
                          resize: "vertical"
                        }}
                      />
                      <div style={{ marginTop: "16px", textAlign: "center" }}>
                        <button
                          onClick={saveTextDiagram}
                          disabled={!diagramText.trim()}
                          style={{
                            background: diagramText.trim() ? "var(--accent-green)" : "var(--bg-tertiary)",
                            color: diagramText.trim() ? "white" : "var(--text-muted)",
                            padding: "12px 24px",
                            borderRadius: "6px",
                            border: "none",
                            cursor: diagramText.trim() ? "pointer" : "not-allowed",
                            fontSize: "14px",
                            fontWeight: "500"
                          }}
                        >
                          💾 Save Text Diagram
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "activity" && (
          <div>
            <h3 style={{ marginBottom: "16px", fontSize: "20px" }}>Activity Timeline</h3>
            <div style={{ 
              background: "var(--bg-secondary)",
              padding: "24px",
              borderRadius: "8px",
              border: "1px solid var(--border)"
            }}>
              {project.IntegrationEvent.length > 0 ? (
                <div>
                  {project.IntegrationEvent.map((event, i) => (
                    <div key={event.id.toString()} style={{ 
                      marginBottom: "24px",
                      paddingBottom: "24px",
                      borderBottom: i < project.IntegrationEvent.length - 1 ? "1px solid var(--border)" : "none",
                      display: "flex",
                      gap: "16px"
                    }}>
                      <div style={{ 
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        background: "var(--accent-blue)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0
                      }}>
                        {event.source === "github" ? "📁" : "🚀"}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          display: "flex", 
                          justifyContent: "space-between",
                          marginBottom: "8px"
                        }}>
                          <h4 style={{ 
                            color: "var(--text-primary)", 
                            fontWeight: "500",
                            fontSize: "16px"
                          }}>
                            {event.source} {event.type}
                          </h4>
                          <span style={{ color: "var(--text-muted)", fontSize: "14px" }}>
                            {new Date(event.occurredAt).toLocaleDateString()} at {new Date(event.occurredAt).toLocaleTimeString()}
                          </span>
                        </div>
                        <div style={{ 
                          color: "var(--text-secondary)", 
                          fontSize: "14px",
                          lineHeight: "1.5"
                        }}>
                          {event.payload?.commitMessage || event.payload?.message || "No details available"}
                        </div>
                        {event.payload?.author && (
                          <div style={{ 
                            color: "var(--text-muted)", 
                            fontSize: "12px",
                            marginTop: "4px"
                          }}>
                            by {event.payload.author}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ 
                  color: "var(--text-muted)",
                  fontStyle: "italic",
                  textAlign: "center",
                  padding: "64px"
                }}>
                  🕒 No activity recorded yet
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}