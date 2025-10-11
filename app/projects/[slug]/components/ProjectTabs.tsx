"use client";

import { useState } from "react";

interface Project {
  id: string;
  name: string;
  slug: string;
  repoFullName: string | null;
  liveUrl: string | null;
  docs: {
    readmeMd: string | null;
    notesMd: string;
    brainstormingMd: string;
  } | null;
  events: Array<{
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
  const [notes, setNotes] = useState(project.docs?.notesMd || "");
  const [brainstorm, setBrainstorm] = useState(project.docs?.brainstormingMd || "");
  const [isEditing, setIsEditing] = useState({ notes: false, brainstorm: false });

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

  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "readme", label: "README", icon: "📖" },
    { id: "notes", label: "Notes", icon: "📝" },
    { id: "brainstorm", label: "Brainstorm", icon: "💡" },
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
                  {project.docs?.readmeMd ? (
                    <div style={{ 
                      whiteSpace: "pre-wrap",
                      fontSize: "14px",
                      lineHeight: "1.6",
                      color: "var(--text-secondary)"
                    }}>
                      {project.docs.readmeMd.slice(0, 500)}...
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
                  {project.events.length > 0 ? (
                    <div style={{ fontSize: "14px" }}>
                      {project.events.slice(0, 5).map((event, i) => (
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
              {project.docs?.readmeMd ? (
                <pre style={{ 
                  whiteSpace: "pre-wrap",
                  fontSize: "14px",
                  lineHeight: "1.6",
                  color: "var(--text-secondary)",
                  margin: 0
                }}>
                  {project.docs.readmeMd}
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

        {activeTab === "activity" && (
          <div>
            <h3 style={{ marginBottom: "16px", fontSize: "20px" }}>Activity Timeline</h3>
            <div style={{ 
              background: "var(--bg-secondary)",
              padding: "24px",
              borderRadius: "8px",
              border: "1px solid var(--border)"
            }}>
              {project.events.length > 0 ? (
                <div>
                  {project.events.map((event, i) => (
                    <div key={event.id.toString()} style={{ 
                      marginBottom: "24px",
                      paddingBottom: "24px",
                      borderBottom: i < project.events.length - 1 ? "1px solid var(--border)" : "none",
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