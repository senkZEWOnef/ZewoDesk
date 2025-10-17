import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getLatestCommit, getReadme } from "@/lib/github";
import { randomUUID } from "crypto";

export async function GET() {
  const projects = await prisma.project.findMany({ include: { ProjectStatus: true } });
  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  console.log('POST /api/projects called');
  const contentType = request.headers.get("content-type") || "";
  console.log('Content-Type:', contentType);
  
  let data: any = {};
  if (contentType.includes("application/json")) {
    data = await request.json();
  } else if (contentType.includes("application/x-www-form-urlencoded")) {
    const form = await request.formData();
    data = Object.fromEntries(form.entries());
  } else {
    data = await request.json().catch(() => ({}));
  }
  
  console.log('Received data:', data);

  const { name, slug, liveUrl, repoFullName, completionPct } = data;
  if (!name || !slug)
    return NextResponse.json(
      { error: "name and slug required" },
      { status: 400 }
    );

  // Validate completion percentage
  let validCompletionPct = 0;
  if (completionPct !== undefined && completionPct !== null && completionPct !== '') {
    const pct = parseInt(completionPct);
    if (!isNaN(pct) && pct >= 0 && pct <= 100) {
      validCompletionPct = pct;
    }
  }

  // Ensure liveUrl has protocol if provided
  let processedLiveUrl = liveUrl || null;
  if (processedLiveUrl && !processedLiveUrl.startsWith('http://') && !processedLiveUrl.startsWith('https://')) {
    processedLiveUrl = `https://${processedLiveUrl}`;
  }

  // Create the project
  console.log('Creating project with data:', {
    name,
    slug,
    liveUrl: processedLiveUrl,
    repoFullName: repoFullName || null,
    completionPct: validCompletionPct
  });
  
  const project = await prisma.project.create({
    data: {
      id: randomUUID(),
      name,
      slug,
      liveUrl: processedLiveUrl,
      repoFullName: repoFullName || null,
      completionPct: validCompletionPct,
      updatedAt: new Date(),
      ProjectStatus: { create: { updatedAt: new Date() } },
      ProjectDocs: { create: { updatedAt: new Date() } },
    },
  });
  
  console.log('Project created successfully:', project.id);

  // If GitHub repo provided, fetch initial data
  if (repoFullName) {
    try {
      const [latestCommit, readme] = await Promise.all([
        getLatestCommit(repoFullName),
        getReadme(repoFullName)
      ]);

      // Update status with latest commit
      if (latestCommit) {
        await prisma.projectStatus.update({
          where: { projectId: project.id },
          data: {
            lastCommitSha: latestCommit.sha,
            lastCommitAt: new Date(latestCommit.commit.author.date),
          }
        });
      }

      // Update docs with README
      if (readme) {
        await prisma.projectDocs.update({
          where: { projectId: project.id },
          data: { readmeMd: readme }
        });
      }
    } catch (error) {
      console.error("Failed to fetch GitHub data:", error);
      // Continue anyway - project is created, GitHub data is optional
    }
  }

  return NextResponse.redirect(new URL("/projects", request.url));
}
