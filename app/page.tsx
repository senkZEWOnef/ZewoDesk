// app/page.tsx
import { prisma } from "@/lib/prisma";
import ProjectCard from "./components/ProjectCard";

export default async function Page() {
  const projects = await prisma.project.findMany({
    include: { status: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ 
          fontSize: "32px", 
          fontWeight: "700", 
          marginBottom: "8px",
          background: "linear-gradient(135deg, var(--accent-blue), var(--accent-purple))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text"
        }}>
          Projects
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "16px" }}>
          Manage all your projects from one place
        </p>
      </div>

      <form action="/api/projects" method="post" style={{ 
        background: "var(--bg-secondary)",
        padding: "24px",
        borderRadius: "12px",
        border: "1px solid var(--border)",
        marginBottom: "32px"
      }}>
        <h3 style={{ marginBottom: "16px", fontSize: "18px", fontWeight: "600" }}>Add New Project</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
          <input name="name" placeholder="Project Name" required />
          <input name="slug" placeholder="project-slug" required />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
          <input name="repoFullName" placeholder="username/repo-name (GitHub)" />
          <input name="liveUrl" placeholder="https://app.example.com" />
        </div>
        <button type="submit">Add Project</button>
      </form>

      <div className="project-grid">
        {projects.map(p => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>

      {projects.length === 0 && (
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