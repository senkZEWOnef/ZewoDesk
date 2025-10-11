// app/projects/[slug]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProjectTabs from "./components/ProjectTabs";
import DeleteButton from "./components/DeleteButton";

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug },
    include: { 
      status: true, 
      docs: true,
      events: {
        orderBy: { occurredAt: "desc" },
        take: 10
      }
    }
  });

  if (!project) {
    notFound();
  }

  return (
    <>
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <Link href="/" style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "8px",
            color: "var(--text-secondary)",
            fontSize: "14px"
          }}>
            ← Back to Dashboard
          </Link>
          <DeleteButton projectSlug={project.slug} projectName={project.name} />
        </div>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ 
              fontSize: "36px", 
              fontWeight: "700", 
              marginBottom: "8px",
              color: "var(--text-primary)"
            }}>
              {project.name}
            </h1>
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "16px",
              marginBottom: "16px"
            }}>
              <span style={{ 
                color: "var(--text-muted)", 
                fontSize: "14px",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>
                {project.slug}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span className={`status-indicator ${project.status?.lastCommitAt ? 'status-active' : 'status-inactive'}`}></span>
                <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
                  {project.status?.lastCommitAt ? 'Active' : 'No commits'}
                </span>
              </div>
            </div>
            
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              {project.repoFullName && (
                <a 
                  href={`https://github.com/${project.repoFullName}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="project-link"
                  style={{ display: "inline-flex" }}
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
                  style={{ display: "inline-flex" }}
                >
                  <span>🌐</span>
                  Live Site
                </a>
              )}
            </div>
          </div>
          
          <div style={{ 
            background: "var(--bg-secondary)",
            padding: "16px",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            minWidth: "200px"
          }}>
            <h4 style={{ marginBottom: "12px", fontSize: "14px", color: "var(--text-secondary)" }}>
              Quick Stats
            </h4>
            <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
              <div style={{ marginBottom: "8px" }}>
                <strong>Last Commit:</strong><br />
                {project.status?.lastCommitAt?.toISOString()?.slice(0, 19).replace('T', ' ') ?? "Never"}
              </div>
              <div style={{ marginBottom: "8px" }}>
                <strong>Last Deploy:</strong><br />
                {project.status?.lastDeployAt?.toISOString()?.slice(0, 19).replace('T', ' ') ?? "Never"}
              </div>
              <div>
                <strong>Deploy State:</strong><br />
                {project.status?.lastDeployState ?? "Unknown"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProjectTabs project={project} />
    </>
  );
}