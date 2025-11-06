// app/projects/page.tsx
import { prisma } from "@/lib/prisma";
import ProjectCard from "../components/ProjectCard";
import PaginationControls from "../components/PaginationControls";
import ProjectForm from "../components/ProjectForm";

export const dynamic = 'force-dynamic';

const PROJECTS_PER_PAGE = 12;

export default async function ProjectsPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ page?: string; visitor?: string }> 
}) {
  let projects = [];
  let totalProjects = 0;
  let error = null;
  
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt(resolvedSearchParams.page || '1');
  const isVisitorMode = resolvedSearchParams.visitor === 'true';
  const skip = (currentPage - 1) * PROJECTS_PER_PAGE;
  
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    
    [projects, totalProjects] = await Promise.all([
      prisma.project.findMany({
        include: { ProjectStatus: true },
        orderBy: { createdAt: "desc" },
        take: PROJECTS_PER_PAGE,
        skip: skip,
      }),
      prisma.project.count(),
    ]);
  } catch (e) {
    console.error('Database error:', e);
    error = 'Database connection failed. Please check your environment variables.';
  }

  const totalPages = Math.ceil(totalProjects / PROJECTS_PER_PAGE);

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
          {isVisitorMode ? "Browse Zewo's projects" : "Manage all your projects from one place"}
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

      {!error && !isVisitorMode && <ProjectForm />}

      <div className="project-grid">
        {projects.map(p => (
          <ProjectCard key={p.id} project={p} visitorMode={isVisitorMode} />
        ))}
      </div>

      {!error && projects.length === 0 && currentPage === 1 && (
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

      {/* Pagination */}
      {!error && totalPages > 1 && (
        <PaginationControls 
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalProjects}
          itemsPerPage={PROJECTS_PER_PAGE}
        />
      )}
    </>
  );
}