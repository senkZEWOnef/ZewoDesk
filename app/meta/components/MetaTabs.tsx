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
    ProjectStatus: {
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
  const [selectedBusinessType, setSelectedBusinessType] = useState<"startup" | "growing" | "enterprise" | null>(null);

  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "health", label: "Health", icon: "🏥" },
    { id: "finances", label: "Finances", icon: "💰" },
    { id: "activity", label: "Activity", icon: "🔄" },
    { id: "settings", label: "Settings", icon: "⚙️" },
    { id: "packages", label: "Packages", icon: "📦" }
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
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Left Sidebar */}
      <div style={{
        width: "280px",
        background: "var(--bg-secondary)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        padding: "24px",
        marginRight: "32px",
        height: "fit-content",
        position: "sticky",
        top: "32px"
      }}>
        {/* Sidebar Header */}
        <div style={{ marginBottom: "32px" }}>
          <h2 style={{
            fontSize: "24px",
            fontWeight: "700",
            marginBottom: "8px",
            background: "linear-gradient(135deg, var(--accent-blue), var(--accent-purple))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            Meta Dashboard
          </h2>
          <p style={{
            color: "var(--text-secondary)",
            fontSize: "14px",
            lineHeight: "1.5"
          }}>
            Analytics, health monitoring, and system settings
          </p>
        </div>

        {/* Navigation Menu */}
        <nav>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "16px 20px",
                marginBottom: "8px",
                border: "none",
                borderRadius: "10px",
                background: activeTab === tab.id 
                  ? "linear-gradient(135deg, var(--accent-blue), var(--accent-purple))" 
                  : "transparent",
                color: activeTab === tab.id ? "white" : "var(--text-secondary)",
                fontSize: "15px",
                fontWeight: activeTab === tab.id ? "600" : "500",
                cursor: "pointer",
                transition: "all 0.3s ease",
                textAlign: "left"
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.background = "var(--bg-tertiary)";
                  e.currentTarget.style.color = "var(--text-primary)";
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--text-secondary)";
                }
              }}
            >
              <span style={{ fontSize: "18px" }}>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, minHeight: "500px" }}>
        {activeTab === "overview" && (
          <div>
            {/* Page Header */}
            <div style={{ marginBottom: "40px" }}>
              <h1 style={{
                fontSize: "32px",
                fontWeight: "700",
                marginBottom: "8px",
                background: "linear-gradient(135deg, var(--accent-blue), var(--accent-purple))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}>
                Overview
              </h1>
              <p style={{ color: "var(--text-secondary)", fontSize: "16px" }}>
                Key metrics and performance indicators
              </p>
            </div>

            {/* Stats Cards */}
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(3, 1fr)", 
              gap: "24px",
              marginBottom: "48px"
            }}>
              <div style={{ 
                background: "linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary))",
                padding: "32px",
                borderRadius: "16px",
                border: "1px solid var(--border)",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)"
              }}>
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  background: "linear-gradient(90deg, var(--accent-blue), #3b82f6)"
                }} />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                  <h3 style={{ fontSize: "16px", color: "var(--text-secondary)", fontWeight: "600" }}>
                    Total Projects
                  </h3>
                  <div style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: "rgba(59, 130, 246, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px"
                  }}>
                    📁
                  </div>
                </div>
                <div style={{ fontSize: "40px", fontWeight: "800", color: "var(--accent-blue)", marginBottom: "8px" }}>
                  {analytics.overview.totalProjects}
                </div>
                <div style={{ fontSize: "14px", color: "var(--text-muted)" }}>
                  {analytics.overview.activeProjects} active projects
                </div>
              </div>

              <div style={{ 
                background: "linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary))",
                padding: "32px",
                borderRadius: "16px",
                border: "1px solid var(--border)",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)"
              }}>
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  background: "linear-gradient(90deg, var(--accent-purple), #8b5cf6)"
                }} />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                  <h3 style={{ fontSize: "16px", color: "var(--text-secondary)", fontWeight: "600" }}>
                    Total Events
                  </h3>
                  <div style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: "rgba(139, 92, 246, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px"
                  }}>
                    ⚡
                  </div>
                </div>
                <div style={{ fontSize: "40px", fontWeight: "800", color: "var(--accent-purple)", marginBottom: "8px" }}>
                  {analytics.overview.totalEvents}
                </div>
                <div style={{ fontSize: "14px", color: "var(--text-muted)" }}>
                  Commits, deploys, etc.
                </div>
              </div>

              <div style={{ 
                background: "linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary))",
                padding: "32px",
                borderRadius: "16px",
                border: "1px solid var(--border)",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)"
              }}>
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  background: analytics.overview.netProfit >= 0 
                    ? "linear-gradient(90deg, var(--accent-green), #10b981)"
                    : "linear-gradient(90deg, var(--accent-red), #ef4444)"
                }} />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                  <h3 style={{ fontSize: "16px", color: "var(--text-secondary)", fontWeight: "600" }}>
                    Net Profit
                  </h3>
                  <div style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: analytics.overview.netProfit >= 0 
                      ? "rgba(16, 185, 129, 0.1)"
                      : "rgba(239, 68, 68, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px"
                  }}>
                    💰
                  </div>
                </div>
                <div style={{ 
                  fontSize: "40px", 
                  fontWeight: "800", 
                  color: analytics.overview.netProfit >= 0 ? "var(--accent-green)" : "var(--accent-red)",
                  marginBottom: "8px"
                }}>
                  {formatCurrency(analytics.overview.netProfit)}
                </div>
                <div style={{ fontSize: "14px", color: "var(--text-muted)" }}>
                  Revenue: {formatCurrency(analytics.overview.totalRevenue)}
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
                          color: project.ProjectStatus?.lastCommitAt ? "var(--accent-green)" : "var(--text-muted)"
                        }}>
                          {getDaysAgo(project.ProjectStatus?.lastCommitAt)}
                        </div>
                        <div style={{ color: "var(--text-muted)" }}>
                          {project.ProjectStatus?.lastDeployState || "No deploys"}
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
            {/* Page Header */}
            <div style={{ marginBottom: "40px" }}>
              <h1 style={{
                fontSize: "32px",
                fontWeight: "700",
                marginBottom: "8px",
                background: "linear-gradient(135deg, var(--accent-blue), var(--accent-purple))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}>
                System Health
              </h1>
              <p style={{ color: "var(--text-secondary)", fontSize: "16px" }}>
                Monitor project status and deployment health
              </p>
            </div>

            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(3, 1fr)", 
              gap: "24px",
              marginBottom: "48px"
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
                const daysSinceCommit = project.ProjectStatus?.lastCommitAt ? 
                  (Date.now() - new Date(project.ProjectStatus.lastCommitAt).getTime()) / (1000 * 60 * 60 * 24) : 
                  999;
                const isStale = daysSinceCommit > 7;
                const deployStatus = project.ProjectStatus?.lastDeployState;
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
                          Last commit: {getDaysAgo(project.ProjectStatus?.lastCommitAt)}
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
            {/* Page Header */}
            <div style={{ marginBottom: "40px" }}>
              <h1 style={{
                fontSize: "32px",
                fontWeight: "700",
                marginBottom: "8px",
                background: "linear-gradient(135deg, var(--accent-blue), var(--accent-purple))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}>
                Finances
              </h1>
              <p style={{ color: "var(--text-secondary)", fontSize: "16px" }}>
                Track invoices, expenses, and revenue
              </p>
            </div>

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
            {/* Page Header */}
            <div style={{ marginBottom: "40px" }}>
              <h1 style={{
                fontSize: "32px",
                fontWeight: "700",
                marginBottom: "8px",
                background: "linear-gradient(135deg, var(--accent-blue), var(--accent-purple))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}>
                Activity
              </h1>
              <p style={{ color: "var(--text-secondary)", fontSize: "16px" }}>
                Recent events and project activities
              </p>
            </div>

            <h3 style={{ marginBottom: "24px", fontSize: "20px", fontWeight: "600" }}>Recent Activity</h3>
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
            {/* Page Header */}
            <div style={{ marginBottom: "40px" }}>
              <h1 style={{
                fontSize: "32px",
                fontWeight: "700",
                marginBottom: "8px",
                background: "linear-gradient(135deg, var(--accent-blue), var(--accent-purple))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}>
                Settings
              </h1>
              <p style={{ color: "var(--text-secondary)", fontSize: "16px" }}>
                System configuration and preferences
              </p>
            </div>

            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "1fr", 
              gap: "32px"
            }}>
              <div>
                <h3 style={{ marginBottom: "24px", fontSize: "20px", fontWeight: "600" }}>System Settings</h3>
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

        {activeTab === "packages" && (
          <div>
            <div style={{ marginBottom: "40px" }}>
              <h3 style={{ 
                marginBottom: "8px", 
                fontSize: "28px", 
                fontWeight: "700",
                background: "linear-gradient(135deg, var(--accent-blue), var(--accent-purple))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}>
                Service Packages
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "16px" }}>
                Professional web development and social media management services
              </p>
            </div>

            {/* Individual Packages */}
            <div style={{ marginBottom: "64px" }}>
              <h4 style={{ 
                marginBottom: "32px", 
                fontSize: "22px", 
                fontWeight: "600",
                background: "linear-gradient(90deg, var(--accent-blue), var(--accent-green))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}>
                🌐 Website Development
              </h4>
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(3, 1fr)", 
                gap: "20px"
              }}>
                {/* Basic Website Package */}
                <div style={{
                  background: "linear-gradient(145deg, var(--bg-secondary), var(--bg-tertiary))",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  borderRadius: "16px",
                  padding: "24px",
                  position: "relative",
                  transition: "all 0.4s ease",
                  boxShadow: "0 4px 20px rgba(16, 185, 129, 0.1)",
                  minHeight: "380px",
                  display: "flex",
                  flexDirection: "column"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = "0 12px 40px rgba(16, 185, 129, 0.2)";
                  e.currentTarget.style.borderColor = "rgba(16, 185, 129, 0.6)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(16, 185, 129, 0.1)";
                  e.currentTarget.style.borderColor = "rgba(16, 185, 129, 0.3)";
                }}
                >
                  <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background: "linear-gradient(90deg, var(--accent-green), #10b981)",
                    borderRadius: "16px 16px 0 0"
                  }} />
                  <div style={{ textAlign: "center", marginBottom: "20px" }}>
                    <div style={{ fontSize: "32px", marginBottom: "8px" }}>🌱</div>
                    <h5 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px", color: "var(--accent-green)" }}>
                      Basic Website
                    </h5>
                    <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
                      Professional business website
                    </p>
                  </div>
                  <div style={{ textAlign: "center", marginBottom: "24px" }}>
                    <div style={{ fontSize: "36px", fontWeight: "800", color: "var(--accent-green)", marginBottom: "4px" }}>
                      $1,000
                    </div>
                    <div style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
                      + $50/month maintenance
                    </div>
                  </div>
                  <div style={{ fontSize: "14px", lineHeight: "1.8", color: "var(--text-primary)" }}>
                    <div style={{ marginBottom: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ color: "var(--accent-green)" }}>✓</span> Custom responsive design
                    </div>
                    <div style={{ marginBottom: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ color: "var(--accent-green)" }}>✓</span> Contact forms & SEO
                    </div>
                    <div style={{ marginBottom: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ color: "var(--accent-green)" }}>✓</span> Mobile optimization
                    </div>
                    <div style={{ marginBottom: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ color: "var(--accent-green)" }}>✓</span> Basic analytics
                    </div>
                  </div>
                </div>

                {/* E-commerce Website Package */}
                <div style={{
                  background: "linear-gradient(145deg, var(--bg-secondary), var(--bg-tertiary))",
                  border: "2px solid rgba(14, 165, 233, 0.5)",
                  borderRadius: "16px",
                  padding: "24px",
                  position: "relative",
                  transition: "all 0.4s ease",
                  boxShadow: "0 8px 32px rgba(14, 165, 233, 0.15)",
                  minHeight: "380px",
                  display: "flex",
                  flexDirection: "column"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = "0 16px 48px rgba(14, 165, 233, 0.25)";
                  e.currentTarget.style.borderColor = "rgba(14, 165, 233, 0.8)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(14, 165, 233, 0.15)";
                  e.currentTarget.style.borderColor = "rgba(14, 165, 233, 0.5)";
                }}
                >
                  <div style={{
                    position: "absolute",
                    top: "-16px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "linear-gradient(135deg, var(--accent-blue), #0ea5e9)",
                    color: "white",
                    padding: "6px 16px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "700",
                    boxShadow: "0 4px 12px rgba(14, 165, 233, 0.3)"
                  }}>
                    ⭐ POPULAR
                  </div>
                  <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background: "linear-gradient(90deg, var(--accent-blue), #0ea5e9)",
                    borderRadius: "16px 16px 0 0"
                  }} />
                  <div style={{ textAlign: "center", marginBottom: "20px" }}>
                    <div style={{ fontSize: "32px", marginBottom: "8px" }}>🛒</div>
                    <h5 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px", color: "var(--accent-blue)" }}>
                      E-commerce Website
                    </h5>
                    <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
                      Complete online store solution
                    </p>
                  </div>
                  <div style={{ textAlign: "center", marginBottom: "24px" }}>
                    <div style={{ fontSize: "36px", fontWeight: "800", color: "var(--accent-blue)", marginBottom: "4px" }}>
                      $3,000
                    </div>
                    <div style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
                      + $100/month maintenance
                    </div>
                  </div>
                  <div style={{ fontSize: "14px", lineHeight: "1.8", color: "var(--text-primary)" }}>
                    <div style={{ marginBottom: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ color: "var(--accent-blue)" }}>✓</span> Everything in Basic
                    </div>
                    <div style={{ marginBottom: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ color: "var(--accent-blue)" }}>✓</span> Shopping cart & checkout
                    </div>
                    <div style={{ marginBottom: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ color: "var(--accent-blue)" }}>✓</span> Payment integration
                    </div>
                    <div style={{ marginBottom: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ color: "var(--accent-blue)" }}>✓</span> Inventory & orders
                    </div>
                  </div>
                </div>

                {/* Enterprise E-commerce Package */}
                <div style={{
                  background: "linear-gradient(145deg, var(--bg-secondary), var(--bg-tertiary))",
                  border: "1px solid rgba(139, 92, 246, 0.3)",
                  borderRadius: "16px",
                  padding: "24px",
                  position: "relative",
                  transition: "all 0.4s ease",
                  boxShadow: "0 4px 20px rgba(139, 92, 246, 0.1)",
                  minHeight: "380px",
                  display: "flex",
                  flexDirection: "column"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = "0 12px 40px rgba(139, 92, 246, 0.2)";
                  e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.6)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(139, 92, 246, 0.1)";
                  e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.3)";
                }}
                >
                  <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background: "linear-gradient(90deg, var(--accent-purple), #8b5cf6)",
                    borderRadius: "16px 16px 0 0"
                  }} />
                  <div style={{ textAlign: "center", marginBottom: "20px" }}>
                    <div style={{ fontSize: "32px", marginBottom: "8px" }}>🏢</div>
                    <h5 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px", color: "var(--accent-purple)" }}>
                      Enterprise E-commerce
                    </h5>
                    <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
                      Advanced business solution
                    </p>
                  </div>
                  <div style={{ textAlign: "center", marginBottom: "24px" }}>
                    <div style={{ fontSize: "36px", fontWeight: "800", color: "var(--accent-purple)", marginBottom: "4px" }}>
                      $5,000
                    </div>
                    <div style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
                      + $250/month maintenance
                    </div>
                  </div>
                  <div style={{ fontSize: "14px", lineHeight: "1.8", color: "var(--text-primary)" }}>
                    <div style={{ marginBottom: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ color: "var(--accent-purple)" }}>✓</span> Everything in E-commerce
                    </div>
                    <div style={{ marginBottom: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ color: "var(--accent-purple)" }}>✓</span> Advanced analytics
                    </div>
                    <div style={{ marginBottom: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ color: "var(--accent-purple)" }}>✓</span> Multi-vendor support
                    </div>
                    <div style={{ marginBottom: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ color: "var(--accent-purple)" }}>✓</span> Custom integrations
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media Packages */}
            <div style={{ marginBottom: "64px" }}>
              <h4 style={{ 
                marginBottom: "32px", 
                fontSize: "22px", 
                fontWeight: "600",
                background: "linear-gradient(90deg, var(--accent-purple), var(--accent-blue))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}>
                📱 Social Media Management
              </h4>
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(3, 1fr)", 
                gap: "20px"
              }}>
                {/* Starter Package */}
                <div style={{
                  background: "linear-gradient(145deg, var(--bg-secondary), var(--bg-tertiary))",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  borderRadius: "16px",
                  padding: "20px",
                  position: "relative",
                  transition: "all 0.4s ease",
                  boxShadow: "0 4px 20px rgba(16, 185, 129, 0.1)",
                  minHeight: "280px",
                  display: "flex",
                  flexDirection: "column"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(16, 185, 129, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(16, 185, 129, 0.1)";
                }}
                >
                  <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "3px",
                    background: "linear-gradient(90deg, var(--accent-green), #10b981)",
                    borderRadius: "16px 16px 0 0"
                  }} />
                  <div style={{ textAlign: "center", marginBottom: "16px" }}>
                    <div style={{ fontSize: "24px", marginBottom: "8px" }}>📈</div>
                    <h5 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "4px", color: "var(--accent-green)" }}>
                      Starter
                    </h5>
                  </div>
                  <div style={{ textAlign: "center", marginBottom: "16px" }}>
                    <div style={{ fontSize: "28px", fontWeight: "800", color: "var(--accent-green)" }}>
                      $100
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                      per month
                    </div>
                  </div>
                  <div style={{ fontSize: "13px", lineHeight: "1.6" }}>
                    <div style={{ marginBottom: "4px" }}>✓ 1 post per week</div>
                    <div style={{ marginBottom: "4px" }}>✓ Content creation</div>
                    <div style={{ marginBottom: "4px" }}>✓ Basic hashtags</div>
                    <div style={{ marginBottom: "4px" }}>✓ Monthly reporting</div>
                  </div>
                </div>

                {/* Growth Package */}
                <div style={{
                  background: "linear-gradient(145deg, var(--bg-secondary), var(--bg-tertiary))",
                  border: "2px solid rgba(14, 165, 233, 0.5)",
                  borderRadius: "16px",
                  padding: "20px",
                  position: "relative",
                  transition: "all 0.4s ease",
                  boxShadow: "0 6px 24px rgba(14, 165, 233, 0.12)",
                  minHeight: "280px",
                  display: "flex",
                  flexDirection: "column"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = "0 12px 36px rgba(14, 165, 233, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 6px 24px rgba(14, 165, 233, 0.12)";
                }}
                >
                  <div style={{
                    position: "absolute",
                    top: "-12px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "linear-gradient(135deg, var(--accent-blue), #0ea5e9)",
                    color: "white",
                    padding: "4px 12px",
                    borderRadius: "16px",
                    fontSize: "10px",
                    fontWeight: "700"
                  }}>
                    RECOMMENDED
                  </div>
                  <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "3px",
                    background: "linear-gradient(90deg, var(--accent-blue), #0ea5e9)",
                    borderRadius: "16px 16px 0 0"
                  }} />
                  <div style={{ textAlign: "center", marginBottom: "16px" }}>
                    <div style={{ fontSize: "24px", marginBottom: "8px" }}>🚀</div>
                    <h5 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "4px", color: "var(--accent-blue)" }}>
                      Growth
                    </h5>
                  </div>
                  <div style={{ textAlign: "center", marginBottom: "16px" }}>
                    <div style={{ fontSize: "28px", fontWeight: "800", color: "var(--accent-blue)" }}>
                      $300
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                      per month
                    </div>
                  </div>
                  <div style={{ fontSize: "13px", lineHeight: "1.6" }}>
                    <div style={{ marginBottom: "4px" }}>✓ 3 posts per week</div>
                    <div style={{ marginBottom: "4px" }}>✓ Professional content</div>
                    <div style={{ marginBottom: "4px" }}>✓ Some paid ads</div>
                    <div style={{ marginBottom: "4px" }}>✓ Analytics & insights</div>
                  </div>
                </div>

                {/* Premium Package */}
                <div style={{
                  background: "linear-gradient(145deg, var(--bg-secondary), var(--bg-tertiary))",
                  border: "1px solid rgba(139, 92, 246, 0.3)",
                  borderRadius: "16px",
                  padding: "20px",
                  position: "relative",
                  transition: "all 0.4s ease",
                  boxShadow: "0 4px 20px rgba(139, 92, 246, 0.1)",
                  minHeight: "280px",
                  display: "flex",
                  flexDirection: "column"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(139, 92, 246, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(139, 92, 246, 0.1)";
                }}
                >
                  <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "3px",
                    background: "linear-gradient(90deg, var(--accent-purple), #8b5cf6)",
                    borderRadius: "16px 16px 0 0"
                  }} />
                  <div style={{ textAlign: "center", marginBottom: "16px" }}>
                    <div style={{ fontSize: "24px", marginBottom: "8px" }}>💎</div>
                    <h5 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "4px", color: "var(--accent-purple)" }}>
                      Premium
                    </h5>
                  </div>
                  <div style={{ textAlign: "center", marginBottom: "16px" }}>
                    <div style={{ fontSize: "28px", fontWeight: "800", color: "var(--accent-purple)" }}>
                      $500
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                      per month
                    </div>
                  </div>
                  <div style={{ fontSize: "13px", lineHeight: "1.6" }}>
                    <div style={{ marginBottom: "4px" }}>✓ 3-5 posts per week</div>
                    <div style={{ marginBottom: "4px" }}>✓ Premium content</div>
                    <div style={{ marginBottom: "4px" }}>✓ Full ad campaigns</div>
                    <div style={{ marginBottom: "4px" }}>✓ Strategy consultation</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Type Selector & Combo Packages */}
            <div style={{ 
              background: "linear-gradient(135deg, rgba(14, 165, 233, 0.05), rgba(139, 92, 246, 0.05))",
              border: "1px solid rgba(14, 165, 233, 0.2)",
              borderRadius: "20px",
              padding: "32px",
              marginBottom: "32px"
            }}>
              <div style={{ textAlign: "center", marginBottom: "32px" }}>
                <h4 style={{ 
                  fontSize: "24px", 
                  fontWeight: "700",
                  marginBottom: "8px",
                  background: "linear-gradient(135deg, var(--accent-blue), var(--accent-purple))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}>
                  🎯 Combo Packages - Save More!
                </h4>
                <p style={{ color: "var(--text-secondary)", fontSize: "16px", marginBottom: "24px" }}>
                  Get both website and social media management with exclusive discounts
                </p>
                
                {/* Business Type Selector */}
                <div style={{ marginBottom: "32px" }}>
                  <p style={{ color: "var(--text-primary)", fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>
                    What type of business are you?
                  </p>
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "center", 
                    gap: "16px",
                    flexWrap: "wrap"
                  }}>
                    {[
                      { id: "startup", label: "Startup", icon: "🌱", description: "Just getting started" },
                      { id: "growing", label: "Growing Business", icon: "🚀", description: "Scaling up operations" },
                      { id: "enterprise", label: "Enterprise", icon: "🏢", description: "Large scale business" }
                    ].map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setSelectedBusinessType(type.id as "startup" | "growing" | "enterprise")}
                        style={{
                          background: selectedBusinessType === type.id 
                            ? "linear-gradient(135deg, var(--accent-blue), var(--accent-purple))"
                            : "var(--bg-secondary)",
                          border: selectedBusinessType === type.id 
                            ? "2px solid var(--accent-blue)" 
                            : "1px solid var(--border)",
                          borderRadius: "12px",
                          padding: "16px 20px",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          color: selectedBusinessType === type.id ? "white" : "var(--text-primary)",
                          minWidth: "160px",
                          textAlign: "center"
                        }}
                        onMouseEnter={(e) => {
                          if (selectedBusinessType !== type.id) {
                            e.currentTarget.style.borderColor = "var(--accent-blue)";
                            e.currentTarget.style.transform = "translateY(-2px)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedBusinessType !== type.id) {
                            e.currentTarget.style.borderColor = "var(--border)";
                            e.currentTarget.style.transform = "translateY(0)";
                          }
                        }}
                      >
                        <div style={{ fontSize: "24px", marginBottom: "8px" }}>{type.icon}</div>
                        <div style={{ fontSize: "16px", fontWeight: "600", marginBottom: "4px" }}>{type.label}</div>
                        <div style={{ fontSize: "12px", opacity: 0.8 }}>{type.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Combo Packages Based on Business Type */}
              {selectedBusinessType && (
                <div>
                  <h5 style={{ 
                    textAlign: "center",
                    fontSize: "20px", 
                    fontWeight: "600",
                    marginBottom: "24px",
                    color: "var(--accent-blue)"
                  }}>
                    Perfect combos for {selectedBusinessType === "startup" ? "Startups" : selectedBusinessType === "growing" ? "Growing Businesses" : "Enterprise Companies"}
                  </h5>
                  
                  <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: "repeat(3, 1fr)", 
                    gap: "20px"
                  }}>
                    {/* Startup Combos */}
                    {selectedBusinessType === "startup" && (
                      <>
                        {/* Basic + Starter */}
                        <div style={{
                          background: "linear-gradient(145deg, var(--bg-secondary), var(--bg-tertiary))",
                          border: "2px solid rgba(16, 185, 129, 0.4)",
                          borderRadius: "16px",
                          padding: "20px",
                          position: "relative",
                          transition: "all 0.4s ease",
                          overflow: "hidden"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-4px)";
                          e.currentTarget.style.boxShadow = "0 12px 40px rgba(16, 185, 129, 0.2)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                        >
                          <div style={{
                            position: "absolute",
                            top: "-8px",
                            right: "-8px",
                            background: "linear-gradient(135deg, var(--accent-red), #ef4444)",
                            color: "white",
                            padding: "4px 8px",
                            borderRadius: "8px",
                            fontSize: "10px",
                            fontWeight: "700",
                            transform: "rotate(12deg)"
                          }}>
                            $15/mo OFF
                          </div>
                          <div style={{ textAlign: "center", marginBottom: "16px" }}>
                            <h5 style={{ fontSize: "18px", fontWeight: "700", color: "var(--accent-green)", marginBottom: "4px" }}>
                              Essential Combo
                            </h5>
                            <p style={{ color: "var(--text-secondary)", fontSize: "12px" }}>
                              Basic Website + Social Starter
                            </p>
                          </div>
                          <div style={{ textAlign: "center", marginBottom: "16px" }}>
                            <div style={{ fontSize: "24px", fontWeight: "800", color: "var(--accent-green)" }}>
                              $1,000
                            </div>
                            <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                              setup + $135/month
                            </div>
                            <div style={{ fontSize: "10px", color: "var(--text-muted)", textDecoration: "line-through" }}>
                              (reg. $150/mo)
                            </div>
                          </div>
                          <div style={{ fontSize: "12px", lineHeight: "1.4" }}>
                            <div>🌱 Basic Website</div>
                            <div>📈 Social Media Starter</div>
                          </div>
                        </div>

                        {/* Basic + Growth */}
                        <div style={{
                          background: "linear-gradient(145deg, var(--bg-secondary), var(--bg-tertiary))",
                          border: "2px solid rgba(14, 165, 233, 0.5)",
                          borderRadius: "16px",
                          padding: "20px",
                          position: "relative",
                          transition: "all 0.4s ease",
                          overflow: "hidden"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-4px)";
                          e.currentTarget.style.boxShadow = "0 12px 40px rgba(14, 165, 233, 0.2)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                        >
                          <div style={{
                            position: "absolute",
                            top: "-8px",
                            right: "-8px",
                            background: "linear-gradient(135deg, var(--accent-red), #ef4444)",
                            color: "white",
                            padding: "4px 8px",
                            borderRadius: "8px",
                            fontSize: "10px",
                            fontWeight: "700",
                            transform: "rotate(12deg)"
                          }}>
                            $30/mo OFF
                          </div>
                          <div style={{
                            position: "absolute",
                            top: "-10px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            background: "var(--accent-blue)",
                            color: "white",
                            padding: "3px 8px",
                            borderRadius: "12px",
                            fontSize: "9px",
                            fontWeight: "700"
                          }}>
                            POPULAR
                          </div>
                          <div style={{ textAlign: "center", marginBottom: "16px", marginTop: "8px" }}>
                            <h5 style={{ fontSize: "18px", fontWeight: "700", color: "var(--accent-blue)", marginBottom: "4px" }}>
                              Growth Combo
                            </h5>
                            <p style={{ color: "var(--text-secondary)", fontSize: "12px" }}>
                              Basic Website + Social Growth
                            </p>
                          </div>
                          <div style={{ textAlign: "center", marginBottom: "16px" }}>
                            <div style={{ fontSize: "24px", fontWeight: "800", color: "var(--accent-blue)" }}>
                              $1,000
                            </div>
                            <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                              setup + $320/month
                            </div>
                            <div style={{ fontSize: "10px", color: "var(--text-muted)", textDecoration: "line-through" }}>
                              (reg. $350/mo)
                            </div>
                          </div>
                          <div style={{ fontSize: "12px", lineHeight: "1.4" }}>
                            <div>🌱 Basic Website</div>
                            <div>🚀 Social Media Growth</div>
                          </div>
                        </div>

                        {/* Basic + Premium */}
                        <div style={{
                          background: "linear-gradient(145deg, var(--bg-secondary), var(--bg-tertiary))",
                          border: "2px solid rgba(139, 92, 246, 0.4)",
                          borderRadius: "16px",
                          padding: "20px",
                          position: "relative",
                          transition: "all 0.4s ease",
                          overflow: "hidden"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-4px)";
                          e.currentTarget.style.boxShadow = "0 12px 40px rgba(139, 92, 246, 0.2)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                        >
                          <div style={{
                            position: "absolute",
                            top: "-8px",
                            right: "-8px",
                            background: "linear-gradient(135deg, var(--accent-red), #ef4444)",
                            color: "white",
                            padding: "4px 8px",
                            borderRadius: "8px",
                            fontSize: "10px",
                            fontWeight: "700",
                            transform: "rotate(12deg)"
                          }}>
                            $50/mo OFF
                          </div>
                          <div style={{ textAlign: "center", marginBottom: "16px" }}>
                            <h5 style={{ fontSize: "18px", fontWeight: "700", color: "var(--accent-purple)", marginBottom: "4px" }}>
                              Premium Combo
                            </h5>
                            <p style={{ color: "var(--text-secondary)", fontSize: "12px" }}>
                              Basic Website + Social Premium
                            </p>
                          </div>
                          <div style={{ textAlign: "center", marginBottom: "16px" }}>
                            <div style={{ fontSize: "24px", fontWeight: "800", color: "var(--accent-purple)" }}>
                              $1,000
                            </div>
                            <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                              setup + $500/month
                            </div>
                            <div style={{ fontSize: "10px", color: "var(--text-muted)", textDecoration: "line-through" }}>
                              (reg. $550/mo)
                            </div>
                          </div>
                          <div style={{ fontSize: "12px", lineHeight: "1.4" }}>
                            <div>🌱 Basic Website</div>
                            <div>💎 Social Media Premium</div>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Growing Business Combos */}
                    {selectedBusinessType === "growing" && (
                      <>
                        {/* E-commerce + Starter */}
                        <div style={{
                          background: "linear-gradient(145deg, var(--bg-secondary), var(--bg-tertiary))",
                          border: "2px solid rgba(16, 185, 129, 0.4)",
                          borderRadius: "16px",
                          padding: "20px",
                          position: "relative",
                          transition: "all 0.4s ease",
                          overflow: "hidden"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-4px)";
                          e.currentTarget.style.boxShadow = "0 12px 40px rgba(16, 185, 129, 0.2)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                        >
                          <div style={{
                            position: "absolute",
                            top: "-8px",
                            right: "-8px",
                            background: "linear-gradient(135deg, var(--accent-red), #ef4444)",
                            color: "white",
                            padding: "4px 8px",
                            borderRadius: "8px",
                            fontSize: "10px",
                            fontWeight: "700",
                            transform: "rotate(12deg)"
                          }}>
                            $15/mo OFF
                          </div>
                          <div style={{ textAlign: "center", marginBottom: "16px" }}>
                            <h5 style={{ fontSize: "18px", fontWeight: "700", color: "var(--accent-green)", marginBottom: "4px" }}>
                              Business Starter
                            </h5>
                            <p style={{ color: "var(--text-secondary)", fontSize: "12px" }}>
                              E-commerce + Social Starter
                            </p>
                          </div>
                          <div style={{ textAlign: "center", marginBottom: "16px" }}>
                            <div style={{ fontSize: "24px", fontWeight: "800", color: "var(--accent-green)" }}>
                              $2,800
                            </div>
                            <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                              setup + $185/month
                            </div>
                            <div style={{ fontSize: "10px", color: "var(--text-muted)", textDecoration: "line-through" }}>
                              (reg. $200/mo)
                            </div>
                          </div>
                          <div style={{ fontSize: "12px", lineHeight: "1.4" }}>
                            <div>🛒 E-commerce Website</div>
                            <div>📈 Social Media Starter</div>
                          </div>
                        </div>

                        {/* E-commerce + Growth */}
                        <div style={{
                          background: "linear-gradient(145deg, var(--bg-secondary), var(--bg-tertiary))",
                          border: "2px solid rgba(14, 165, 233, 0.5)",
                          borderRadius: "16px",
                          padding: "20px",
                          position: "relative",
                          transition: "all 0.4s ease",
                          overflow: "hidden"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-4px)";
                          e.currentTarget.style.boxShadow = "0 12px 40px rgba(14, 165, 233, 0.2)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                        >
                          <div style={{
                            position: "absolute",
                            top: "-8px",
                            right: "-8px",
                            background: "linear-gradient(135deg, var(--accent-red), #ef4444)",
                            color: "white",
                            padding: "4px 8px",
                            borderRadius: "8px",
                            fontSize: "10px",
                            fontWeight: "700",
                            transform: "rotate(12deg)"
                          }}>
                            $30/mo OFF
                          </div>
                          <div style={{
                            position: "absolute",
                            top: "-10px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            background: "var(--accent-blue)",
                            color: "white",
                            padding: "3px 8px",
                            borderRadius: "12px",
                            fontSize: "9px",
                            fontWeight: "700"
                          }}>
                            RECOMMENDED
                          </div>
                          <div style={{ textAlign: "center", marginBottom: "16px", marginTop: "8px" }}>
                            <h5 style={{ fontSize: "18px", fontWeight: "700", color: "var(--accent-blue)", marginBottom: "4px" }}>
                              Business Growth
                            </h5>
                            <p style={{ color: "var(--text-secondary)", fontSize: "12px" }}>
                              E-commerce + Social Growth
                            </p>
                          </div>
                          <div style={{ textAlign: "center", marginBottom: "16px" }}>
                            <div style={{ fontSize: "24px", fontWeight: "800", color: "var(--accent-blue)" }}>
                              $2,800
                            </div>
                            <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                              setup + $370/month
                            </div>
                            <div style={{ fontSize: "10px", color: "var(--text-muted)", textDecoration: "line-through" }}>
                              (reg. $400/mo)
                            </div>
                          </div>
                          <div style={{ fontSize: "12px", lineHeight: "1.4" }}>
                            <div>🛒 E-commerce Website</div>
                            <div>🚀 Social Media Growth</div>
                          </div>
                        </div>

                        {/* E-commerce + Premium */}
                        <div style={{
                          background: "linear-gradient(145deg, var(--bg-secondary), var(--bg-tertiary))",
                          border: "2px solid rgba(139, 92, 246, 0.4)",
                          borderRadius: "16px",
                          padding: "20px",
                          position: "relative",
                          transition: "all 0.4s ease",
                          overflow: "hidden"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-4px)";
                          e.currentTarget.style.boxShadow = "0 12px 40px rgba(139, 92, 246, 0.2)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                        >
                          <div style={{
                            position: "absolute",
                            top: "-8px",
                            right: "-8px",
                            background: "linear-gradient(135deg, var(--accent-red), #ef4444)",
                            color: "white",
                            padding: "4px 8px",
                            borderRadius: "8px",
                            fontSize: "10px",
                            fontWeight: "700",
                            transform: "rotate(12deg)"
                          }}>
                            $50/mo OFF
                          </div>
                          <div style={{ textAlign: "center", marginBottom: "16px" }}>
                            <h5 style={{ fontSize: "18px", fontWeight: "700", color: "var(--accent-purple)", marginBottom: "4px" }}>
                              Business Premium
                            </h5>
                            <p style={{ color: "var(--text-secondary)", fontSize: "12px" }}>
                              E-commerce + Social Premium
                            </p>
                          </div>
                          <div style={{ textAlign: "center", marginBottom: "16px" }}>
                            <div style={{ fontSize: "24px", fontWeight: "800", color: "var(--accent-purple)" }}>
                              $2,800
                            </div>
                            <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                              setup + $550/month
                            </div>
                            <div style={{ fontSize: "10px", color: "var(--text-muted)", textDecoration: "line-through" }}>
                              (reg. $600/mo)
                            </div>
                          </div>
                          <div style={{ fontSize: "12px", lineHeight: "1.4" }}>
                            <div>🛒 E-commerce Website</div>
                            <div>💎 Social Media Premium</div>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Enterprise Combos */}
                    {selectedBusinessType === "enterprise" && (
                      <>
                        {/* Enterprise + Starter */}
                        <div style={{
                          background: "linear-gradient(145deg, var(--bg-secondary), var(--bg-tertiary))",
                          border: "2px solid rgba(16, 185, 129, 0.4)",
                          borderRadius: "16px",
                          padding: "20px",
                          position: "relative",
                          transition: "all 0.4s ease",
                          overflow: "hidden"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-4px)";
                          e.currentTarget.style.boxShadow = "0 12px 40px rgba(16, 185, 129, 0.2)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                        >
                          <div style={{
                            position: "absolute",
                            top: "-8px",
                            right: "-8px",
                            background: "linear-gradient(135deg, var(--accent-red), #ef4444)",
                            color: "white",
                            padding: "4px 8px",
                            borderRadius: "8px",
                            fontSize: "10px",
                            fontWeight: "700",
                            transform: "rotate(12deg)"
                          }}>
                            $15/mo OFF
                          </div>
                          <div style={{ textAlign: "center", marginBottom: "16px" }}>
                            <h5 style={{ fontSize: "18px", fontWeight: "700", color: "var(--accent-green)", marginBottom: "4px" }}>
                              Enterprise Starter
                            </h5>
                            <p style={{ color: "var(--text-secondary)", fontSize: "12px" }}>
                              Enterprise + Social Starter
                            </p>
                          </div>
                          <div style={{ textAlign: "center", marginBottom: "16px" }}>
                            <div style={{ fontSize: "24px", fontWeight: "800", color: "var(--accent-green)" }}>
                              $4,500
                            </div>
                            <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                              setup + $335/month
                            </div>
                            <div style={{ fontSize: "10px", color: "var(--text-muted)", textDecoration: "line-through" }}>
                              (reg. $350/mo)
                            </div>
                          </div>
                          <div style={{ fontSize: "12px", lineHeight: "1.4" }}>
                            <div>🏢 Enterprise E-commerce</div>
                            <div>📈 Social Media Starter</div>
                          </div>
                        </div>

                        {/* Enterprise + Growth */}
                        <div style={{
                          background: "linear-gradient(145deg, var(--bg-secondary), var(--bg-tertiary))",
                          border: "2px solid rgba(14, 165, 233, 0.5)",
                          borderRadius: "16px",
                          padding: "20px",
                          position: "relative",
                          transition: "all 0.4s ease",
                          overflow: "hidden"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-4px)";
                          e.currentTarget.style.boxShadow = "0 12px 40px rgba(14, 165, 233, 0.2)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                        >
                          <div style={{
                            position: "absolute",
                            top: "-8px",
                            right: "-8px",
                            background: "linear-gradient(135deg, var(--accent-red), #ef4444)",
                            color: "white",
                            padding: "4px 8px",
                            borderRadius: "8px",
                            fontSize: "10px",
                            fontWeight: "700",
                            transform: "rotate(12deg)"
                          }}>
                            $30/mo OFF
                          </div>
                          <div style={{
                            position: "absolute",
                            top: "-10px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            background: "var(--accent-blue)",
                            color: "white",
                            padding: "3px 8px",
                            borderRadius: "12px",
                            fontSize: "9px",
                            fontWeight: "700"
                          }}>
                            POPULAR
                          </div>
                          <div style={{ textAlign: "center", marginBottom: "16px", marginTop: "8px" }}>
                            <h5 style={{ fontSize: "18px", fontWeight: "700", color: "var(--accent-blue)", marginBottom: "4px" }}>
                              Enterprise Growth
                            </h5>
                            <p style={{ color: "var(--text-secondary)", fontSize: "12px" }}>
                              Enterprise + Social Growth
                            </p>
                          </div>
                          <div style={{ textAlign: "center", marginBottom: "16px" }}>
                            <div style={{ fontSize: "24px", fontWeight: "800", color: "var(--accent-blue)" }}>
                              $4,500
                            </div>
                            <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                              setup + $520/month
                            </div>
                            <div style={{ fontSize: "10px", color: "var(--text-muted)", textDecoration: "line-through" }}>
                              (reg. $550/mo)
                            </div>
                          </div>
                          <div style={{ fontSize: "12px", lineHeight: "1.4" }}>
                            <div>🏢 Enterprise E-commerce</div>
                            <div>🚀 Social Media Growth</div>
                          </div>
                        </div>

                        {/* Enterprise + Premium */}
                        <div style={{
                          background: "linear-gradient(145deg, var(--bg-secondary), var(--bg-tertiary))",
                          border: "3px solid rgba(255, 215, 0, 0.5)",
                          borderRadius: "16px",
                          padding: "20px",
                          position: "relative",
                          transition: "all 0.4s ease",
                          overflow: "hidden"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-6px)";
                          e.currentTarget.style.boxShadow = "0 16px 48px rgba(255, 215, 0, 0.2)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                        >
                          <div style={{
                            position: "absolute",
                            top: "-8px",
                            right: "-8px",
                            background: "linear-gradient(135deg, #ffd700, #ffed4e)",
                            color: "#000",
                            padding: "4px 8px",
                            borderRadius: "8px",
                            fontSize: "10px",
                            fontWeight: "700",
                            transform: "rotate(12deg)"
                          }}>
                            $50/mo OFF
                          </div>
                          <div style={{
                            position: "absolute",
                            top: "-10px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            background: "linear-gradient(135deg, #ffd700, #ffed4e)",
                            color: "#000",
                            padding: "3px 8px",
                            borderRadius: "12px",
                            fontSize: "9px",
                            fontWeight: "700"
                          }}>
                            👑 ULTIMATE
                          </div>
                          <div style={{ textAlign: "center", marginBottom: "16px", marginTop: "8px" }}>
                            <h5 style={{ 
                              fontSize: "18px", 
                              fontWeight: "700", 
                              marginBottom: "4px",
                              background: "linear-gradient(135deg, #ffd700, #ffed4e)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                              backgroundClip: "text"
                            }}>
                              Ultimate Package
                            </h5>
                            <p style={{ color: "var(--text-secondary)", fontSize: "12px" }}>
                              Enterprise + Social Premium
                            </p>
                          </div>
                          <div style={{ textAlign: "center", marginBottom: "16px" }}>
                            <div style={{ 
                              fontSize: "24px", 
                              fontWeight: "800",
                              background: "linear-gradient(135deg, #ffd700, #ffed4e)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                              backgroundClip: "text"
                            }}>
                              $4,500
                            </div>
                            <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                              setup + $700/month
                            </div>
                            <div style={{ fontSize: "10px", color: "var(--text-muted)", textDecoration: "line-through" }}>
                              (reg. $750/mo)
                            </div>
                          </div>
                          <div style={{ fontSize: "12px", lineHeight: "1.4" }}>
                            <div>🏢 Enterprise E-commerce</div>
                            <div>💎 Social Media Premium</div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}