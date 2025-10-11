import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getLatestCommit, getReadme } from "@/lib/github";

export async function GET() {
  const projects = await prisma.project.findMany({ include: { status: true } });
  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  let data: any = {};
  if (contentType.includes("application/json")) {
    data = await request.json();
  } else if (contentType.includes("application/x-www-form-urlencoded")) {
    const form = await request.formData();
    data = Object.fromEntries(form.entries());
  } else {
    data = await request.json().catch(() => ({}));
  }

  const { name, slug, liveUrl, repoFullName } = data;
  if (!name || !slug)
    return NextResponse.json(
      { error: "name and slug required" },
      { status: 400 }
    );

  // Create the project
  const project = await prisma.project.create({
    data: {
      name,
      slug,
      liveUrl: liveUrl || null,
      repoFullName: repoFullName || null,
      status: { create: {} },
      docs: { create: {} },
    },
  });

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

  return NextResponse.redirect(new URL("/", request.url));
}
