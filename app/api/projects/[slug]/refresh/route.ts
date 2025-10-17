// app/api/projects/[slug]/refresh/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getLatestCommit, getReadme } from "@/lib/github";

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    
    const project = await prisma.project.findUnique({
      where: { slug },
      include: { ProjectStatus: true, ProjectDocs: true }
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (!project.repoFullName) {
      return NextResponse.json({ error: "No GitHub repo configured" }, { status: 400 });
    }

    // Fetch fresh GitHub data
    const [latestCommit, readme] = await Promise.all([
      getLatestCommit(project.repoFullName),
      getReadme(project.repoFullName)
    ]);

    let updatedCommit = false;
    let updatedReadme = false;

    // Update status with latest commit
    if (latestCommit) {
      await prisma.projectStatus.update({
        where: { projectId: project.id },
        data: {
          lastCommitSha: latestCommit.sha,
          lastCommitAt: new Date(latestCommit.commit.author.date),
        }
      });
      updatedCommit = true;
    }

    // Update docs with README
    if (readme) {
      await prisma.projectDocs.update({
        where: { projectId: project.id },
        data: { readmeMd: readme }
      });
      updatedReadme = true;
    }

    return NextResponse.json({
      message: "GitHub data refreshed",
      updated: {
        commit: updatedCommit,
        readme: updatedReadme
      }
    });

  } catch (error) {
    console.error("Failed to refresh GitHub data:", error);
    return NextResponse.json({ error: "Failed to refresh" }, { status: 500 });
  }
}