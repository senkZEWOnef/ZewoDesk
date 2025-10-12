// app/page.tsx
import { prisma } from "@/lib/prisma";
import ProjectCard from "./components/ProjectCard";

export const dynamic = 'force-dynamic';

export default async function Page() {
  let projects = [];
  let error = null;
  
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    
    projects = await prisma.project.findMany({
      include: { status: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {
    console.error('Database error:', e);
    error = 'Database connection failed. Please check your environment variables.';
  }

  return (
    <>
      <div style={{ marginBottom: "32px" }} className="page-header">
        <h1 style={{ 
          fontSize: "32px", 
          fontWeight: "700", 
          marginBottom: "8px",
          background: "linear-gradient(135deg, var(--accent-blue), var(--accent-purple))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text"
        }} className="page-title">
          Projects
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "16px" }} className="page-description">
          Manage all your projects from one place
        </p>
      </div>

      {error && (
        <div style={{ 
          background: "var(--accent-red)",
          color: "white",
          padding: "16px",
          borderRadius: "8px",
          marginBottom: "32px",
          textAlign: "center"
        }}>
          <h3>⚠️ Configuration Required</h3>
          <p>{error}</p>
          <p style={{ fontSize: "14px", marginTop: "8px" }}>
            Set your DATABASE_URL environment variable in Netlify dashboard.
          </p>
        </div>
      )}

      {!error && (
        <form action="/api/projects" method="post" style={{ 
          background: "var(--bg-secondary)",
          padding: "24px",
          borderRadius: "12px",
          border: "1px solid var(--border)",
          marginBottom: "32px"
        }} className="project-form">
          <h3 style={{ marginBottom: "16px", fontSize: "18px", fontWeight: "600" }}>Add New Project</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }} className="form-row">
            <input name="name" placeholder="Project Name" required />
            <input name="slug" placeholder="project-slug" required />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }} className="form-row">
            <input name="repoFullName" placeholder="username/repo-name (GitHub)" />
            <input name="liveUrl" placeholder="https://app.example.com" />
          </div>
          <button type="submit">Add Project</button>
        </form>
      )}

      <div className="project-grid">
        {projects.map(p => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>

      {!error && projects.length === 0 && (
        <div style={{ 
          textAlign: "center", 
          padding: "64px 32px",
          color: "var(--text-secondary)"
        }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🚀</div>
          <h3 style={{ marginBottom: "8px", color: "var(--text-primary)" }}>No projects yet</h3>
          <p>Add your first project above to get started!</p>
        </div>
      )}
    </>
  );
}