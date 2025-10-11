"use client";

import { useState } from "react";

interface MetaTabsProps {
  analytics: {
    overview: {
      totalProjects: number;
      activeProjects: number;
      totalEvents: number;
      totalRevenue: number;
      totalExpenses: number;
      netProfit: number;
    };
    health: {
      projectsWithIssues: number;
      overdueInvoices: number;
      deploymentFailures: number;
    };
    recent: Array<{
      id: bigint;
      source: string;
      type: string;
      occurredAt: Date;
      project: { name: string; slug: string };
    }>;
  };
  projects: Array<{
    id: string;
    name: string;
    slug: string;
    status: {
      lastCommitAt: Date | null;
      lastDeployAt: Date | null;
      lastDeployState: string | null;
    } | null;
    _count: {
      events: number;
      invoices: number;
      expenses: number;
    };
  }>;
  invoices: Array<{
    id: string;
    title: string | null;
    amountCents: number;
    status: string;
    issuedAt: Date | null;
    paidAt: Date | null;
    project: { name: string; slug: string };
  }>;
  expenses: Array<{
    id: bigint;
    description: string;
    amountCents: number;
    category: string | null;
    incurredAt: Date;
    project: { name: string; slug: string };
  }>;
}

export default function MetaTabs({ analytics, projects, invoices, expenses }: MetaTabsProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "health", label: "Health", icon: "🏥" },
    { id: "finances", label: "Finances", icon: "💰" },
    { id: "activity", label: "Activity", icon: "🔄" },
    { id: "settings", label: "Settings", icon: "⚙️" }
  ];

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const formatDate = (date: Date | null) => 
    date ? new Date(date).toLocaleDateString() : "Never";

  const getDaysAgo = (date: Date | null) => {
    if (!date) return "∞";
    const days = Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
    return days === 0 ? "Today" : `${days}d ago`;
  };

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
      <div style={{ minHeight: "500px" }}>
        {activeTab === "overview" && (
          <div>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
              gap: "24px",
              marginBottom: "32px"
            }}>
              <div style={{ 
                background: "var(--bg-secondary)",
                padding: "24px",
                borderRadius: "12px",
                border: "1px solid var(--border)"
              }}>
                <h3 style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "8px" }}>
                  Total Projects
                </h3>
                <div style={{ fontSize: "32px", fontWeight: "700", color: "var(--accent-blue)" }}>
                  {analytics.overview.totalProjects}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  {analytics.overview.activeProjects} active
                </div>
              </div>

              <div style={{ 
                background: "var(--bg-secondary)",
                padding: "24px",
                borderRadius: "12px",
                border: "1px solid var(--border)"
              }}>
                <h3 style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "8px" }}>
                  Total Events
                </h3>
                <div style={{ fontSize: "32px", fontWeight: "700", color: "var(--accent-purple)" }}>
                  {analytics.overview.totalEvents}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  Commits, deploys, etc.
                </div>
              </div>

              <div style={{ 
                background: "var(--bg-secondary)",
                padding: "24px",
                borderRadius: "12px",
                border: "1px solid var(--border)"
              }}>
                <h3 style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "8px" }}>
                  Net Profit
                </h3>
                <div style={{ 
                  fontSize: "32px", 
                  fontWeight: "700", 
                  color: analytics.overview.netProfit >= 0 ? "var(--accent-green)" : "var(--accent-red)"
                }}>
                  {formatCurrency(analytics.overview.netProfit)}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  {formatCurrency(analytics.overview.totalRevenue)} - {formatCurrency(analytics.overview.totalExpenses)}
                </div>
              </div>
            </div>

            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "2fr 1fr", 
              gap: "32px"
            }}>
              <div>
                <h3 style={{ marginBottom: "16px", fontSize: "20px" }}>Project Performance</h3>
                <div style={{ 
                  background: "var(--bg-secondary)",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  overflow: "hidden"
                }}>
                  {projects.map((project, i) => (
                    <div key={project.id} style={{ 
                      padding: "16px 20px",
                      borderBottom: i < projects.length - 1 ? "1px solid var(--border)" : "none",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}>
                      <div>
                        <div style={{ fontWeight: "500", marginBottom: "4px" }}>{project.name}</div>
                        <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                          {project._count.events} events • {project._count.invoices} invoices
                        </div>
                      </div>
                      <div style={{ textAlign: "right", fontSize: "12px" }}>
                        <div style={{ 
                          color: project.status?.lastCommitAt ? "var(--accent-green)" : "var(--text-muted)"
                        }}>
                          {getDaysAgo(project.status?.lastCommitAt)}
                        </div>
                        <div style={{ color: "var(--text-muted)" }}>
                          {project.status?.lastDeployState || "No deploys"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 style={{ marginBottom: "16px", fontSize: "20px" }}>System Info</h3>
                <div style={{ 
                  background: "var(--bg-secondary)",
                  padding: "20px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  fontSize: "14px"
                }}>
                  <div style={{ marginBottom: "12px" }}>
                    <strong>Environment:</strong> Development
                  </div>
                  <div style={{ marginBottom: "12px" }}>
                    <strong>Database:</strong> Connected
                  </div>
                  <div style={{ marginBottom: "12px" }}>
                    <strong>Provider:</strong> Local
                  </div>
                  <div>
                    <strong>Version:</strong> 1.0.0
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "health" && (
          <div>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
              gap: "24px",
              marginBottom: "32px"
            }}>
              <div style={{ 
                background: analytics.health.projectsWithIssues > 0 ? "rgba(239, 68, 68, 0.1)" : "var(--bg-secondary)",
                padding: "20px",
                borderRadius: "8px",
                border: `1px solid ${analytics.health.projectsWithIssues > 0 ? "var(--accent-red)" : "var(--border)"}`
              }}>
                <h4 style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "8px" }}>
                  Stale Projects
                </h4>
                <div style={{ 
                  fontSize: "24px", 
                  fontWeight: "700", 
                  color: analytics.health.projectsWithIssues > 0 ? "var(--accent-red)" : "var(--accent-green)"
                }}>
                  {analytics.health.projectsWithIssues}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  No commits in 7+ days
                </div>
              </div>

              <div style={{ 
                background: analytics.health.overdueInvoices > 0 ? "rgba(239, 68, 68, 0.1)" : "var(--bg-secondary)",
                padding: "20px",
                borderRadius: "8px",
                border: `1px solid ${analytics.health.overdueInvoices > 0 ? "var(--accent-red)" : "var(--border)"}`
              }}>
                <h4 style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "8px" }}>
                  Overdue Invoices
                </h4>
                <div style={{ 
                  fontSize: "24px", 
                  fontWeight: "700", 
                  color: analytics.health.overdueInvoices > 0 ? "var(--accent-red)" : "var(--accent-green)"
                }}>
                  {analytics.health.overdueInvoices}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  30+ days unpaid
                </div>
              </div>

              <div style={{ 
                background: analytics.health.deploymentFailures > 0 ? "rgba(239, 68, 68, 0.1)" : "var(--bg-secondary)",
                padding: "20px",
                borderRadius: "8px",
                border: `1px solid ${analytics.health.deploymentFailures > 0 ? "var(--accent-red)" : "var(--border)"}`
              }}>
                <h4 style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "8px" }}>
                  Failed Deploys
                </h4>
                <div style={{ 
                  fontSize: "24px", 
                  fontWeight: "700", 
                  color: analytics.health.deploymentFailures > 0 ? "var(--accent-red)" : "var(--accent-green)"
                }}>
                  {analytics.health.deploymentFailures}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  Recent failures
                </div>
              </div>
            </div>

            <h3 style={{ marginBottom: "16px", fontSize: "20px" }}>Project Health Details</h3>
            <div style={{ 
              background: "var(--bg-secondary)",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              overflow: "hidden"
            }}>
              {projects.map((project, i) => {
                const daysSinceCommit = project.status?.lastCommitAt ? 
                  (Date.now() - new Date(project.status.lastCommitAt).getTime()) / (1000 * 60 * 60 * 24) : 
                  999;
                const isStale = daysSinceCommit > 7;
                const deployStatus = project.status?.lastDeployState;
                const hasIssues = isStale || deployStatus === "failed";

                return (
                  <div key={project.id} style={{ 
                    padding: "16px 20px",
                    borderBottom: i < projects.length - 1 ? "1px solid var(--border)" : "none",
                    background: hasIssues ? "rgba(239, 68, 68, 0.05)" : "transparent"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ 
                          fontWeight: "500", 
                          color: hasIssues ? "var(--accent-red)" : "var(--text-primary)",
                          marginBottom: "4px"
                        }}>
                          {project.name}
                        </div>
                        <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                          Last commit: {getDaysAgo(project.status?.lastCommitAt)}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        {isStale && (
                          <span style={{ 
                            background: "var(--accent-red)",
                            color: "white",
                            padding: "2px 8px",
                            borderRadius: "4px",
                            fontSize: "10px",
                            fontWeight: "500"
                          }}>
                            STALE
                          </span>
                        )}
                        {deployStatus === "failed" && (
                          <span style={{ 
                            background: "var(--accent-red)",
                            color: "white",
                            padding: "2px 8px",
                            borderRadius: "4px",
                            fontSize: "10px",
                            fontWeight: "500"
                          }}>
                            DEPLOY FAILED
                          </span>
                        )}
                        {!hasIssues && (
                          <span style={{ 
                            background: "var(--accent-green)",
                            color: "white",
                            padding: "2px 8px",
                            borderRadius: "4px",
                            fontSize: "10px",
                            fontWeight: "500"
                          }}>
                            HEALTHY
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "finances" && (
          <div>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "1fr 1fr", 
              gap: "32px"
            }}>
              <div>
                <h3 style={{ marginBottom: "16px", fontSize: "20px" }}>Recent Invoices</h3>
                <div style={{ 
                  background: "var(--bg-secondary)",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  overflow: "hidden"
                }}>
                  {invoices.slice(0, 10).map((invoice, i) => {
                    const isOverdue = invoice.status === "sent" && 
                      invoice.issuedAt && 
                      new Date(invoice.issuedAt).getTime() < Date.now() - (30 * 24 * 60 * 60 * 1000);

                    return (
                      <div key={invoice.id} style={{ 
                        padding: "16px 20px",
                        borderBottom: i < Math.min(invoices.length, 10) - 1 ? "1px solid var(--border)" : "none",
                        background: isOverdue ? "rgba(239, 68, 68, 0.05)" : "transparent"
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                          <div style={{ fontWeight: "500" }}>
                            {invoice.title || `Invoice for ${invoice.project.name}`}
                          </div>
                          <div style={{ fontWeight: "600" }}>
                            {formatCurrency(invoice.amountCents / 100)}
                          </div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                          <div style={{ color: "var(--text-secondary)" }}>
                            {invoice.project.name}
                          </div>
                          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            <span style={{ 
                              background: invoice.status === "paid" ? "var(--accent-green)" :
                                         invoice.status === "sent" ? "var(--accent-blue)" : "var(--text-muted)",
                              color: "white",
                              padding: "2px 6px",
                              borderRadius: "3px",
                              fontSize: "10px"
                            }}>
                              {invoice.status.toUpperCase()}
                            </span>
                            {isOverdue && (
                              <span style={{ 
                                background: "var(--accent-red)",
                                color: "white",
                                padding: "2px 6px",
                                borderRadius: "3px",
                                fontSize: "10px"
                              }}>
                                OVERDUE
                              </span>
                            )}
                            <span style={{ color: "var(--text-muted)" }}>
                              {formatDate(invoice.issuedAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {invoices.length === 0 && (
                    <div style={{ 
                      padding: "32px",
                      textAlign: "center",
                      color: "var(--text-muted)"
                    }}>
                      No invoices yet
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 style={{ marginBottom: "16px", fontSize: "20px" }}>Recent Expenses</h3>
                <div style={{ 
                  background: "var(--bg-secondary)",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  overflow: "hidden"
                }}>
                  {expenses.slice(0, 10).map((expense, i) => (
                    <div key={expense.id.toString()} style={{ 
                      padding: "16px 20px",
                      borderBottom: i < Math.min(expenses.length, 10) - 1 ? "1px solid var(--border)" : "none"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                        <div style={{ fontWeight: "500" }}>
                          {expense.description}
                        </div>
                        <div style={{ fontWeight: "600", color: "var(--accent-red)" }}>
                          -{formatCurrency(expense.amountCents / 100)}
                        </div>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                        <div style={{ color: "var(--text-secondary)" }}>
                          {expense.project.name}
                        </div>
                        <div style={{ display: "flex", gap: "8px" }}>
                          {expense.category && (
                            <span style={{ 
                              background: "var(--bg-tertiary)",
                              color: "var(--text-secondary)",
                              padding: "2px 6px",
                              borderRadius: "3px",
                              fontSize: "10px"
                            }}>
                              {expense.category}
                            </span>
                          )}
                          <span style={{ color: "var(--text-muted)" }}>
                            {formatDate(expense.incurredAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {expenses.length === 0 && (
                    <div style={{ 
                      padding: "32px",
                      textAlign: "center",
                      color: "var(--text-muted)"
                    }}>
                      No expenses yet
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "activity" && (
          <div>
            <h3 style={{ marginBottom: "16px", fontSize: "20px" }}>Recent Activity</h3>
            <div style={{ 
              background: "var(--bg-secondary)",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              overflow: "hidden"
            }}>
              {analytics.recent.map((event, i) => (
                <div key={event.id.toString()} style={{ 
                  padding: "16px 20px",
                  borderBottom: i < analytics.recent.length - 1 ? "1px solid var(--border)" : "none",
                  display: "flex",
                  gap: "16px"
                }}>
                  <div style={{ 
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: event.source === "github" ? "var(--accent-blue)" : "var(--accent-green)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    fontSize: "14px"
                  }}>
                    {event.source === "github" ? "📁" : "🚀"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <div style={{ fontWeight: "500" }}>
                        {event.source} {event.type.replace("_", " ")}
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                        {getDaysAgo(event.occurredAt)}
                      </div>
                    </div>
                    <div style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                      {event.project.name}
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                      {new Date(event.occurredAt).toLocaleDateString()} at {new Date(event.occurredAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              {analytics.recent.length === 0 && (
                <div style={{ 
                  padding: "64px",
                  textAlign: "center",
                  color: "var(--text-muted)"
                }}>
                  🕒 No recent activity
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "1fr", 
              gap: "32px"
            }}>
              <div>
                <h3 style={{ marginBottom: "16px", fontSize: "20px" }}>System Settings</h3>
                <div style={{ 
                  background: "var(--bg-secondary)",
                  padding: "24px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)"
                }}>
                  <div style={{ marginBottom: "24px" }}>
                    <h4 style={{ marginBottom: "8px", fontSize: "16px" }}>Database Connection</h4>
                    <div style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "8px",
                      padding: "12px",
                      background: "rgba(16, 185, 129, 0.1)",
                      border: "1px solid var(--accent-green)",
                      borderRadius: "6px"
                    }}>
                      <span style={{ color: "var(--accent-green)" }}>✓</span>
                      <span>Connected to Neon PostgreSQL</span>
                    </div>
                  </div>

                  <div style={{ marginBottom: "24px" }}>
                    <h4 style={{ marginBottom: "8px", fontSize: "16px" }}>GitHub Integration</h4>
                    <div style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "8px",
                      padding: "12px",
                      background: "rgba(16, 185, 129, 0.1)",
                      border: "1px solid var(--accent-green)",
                      borderRadius: "6px"
                    }}>
                      <span style={{ color: "var(--accent-green)" }}>✓</span>
                      <span>Webhook endpoint active</span>
                    </div>
                  </div>

                  <div style={{ marginBottom: "24px" }}>
                    <h4 style={{ marginBottom: "8px", fontSize: "16px" }}>Notifications</h4>
                    <div style={{ 
                      padding: "12px",
                      background: "var(--bg-tertiary)",
                      border: "1px solid var(--border)",
                      borderRadius: "6px",
                      color: "var(--text-secondary)"
                    }}>
                      Email notifications for overdue invoices and deployment failures (Coming soon)
                    </div>
                  </div>

                  <div>
                    <h4 style={{ marginBottom: "8px", fontSize: "16px" }}>Data Export</h4>
                    <button style={{ 
                      padding: "8px 16px",
                      background: "var(--accent-blue)",
                      border: "none",
                      borderRadius: "6px",
                      color: "white",
                      cursor: "pointer",
                      fontSize: "14px"
                    }}>
                      Export All Data (JSON)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}