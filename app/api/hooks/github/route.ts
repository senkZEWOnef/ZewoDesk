// app/api/hooks/github/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const event = request.headers.get("x-github-event");
    
    // Only handle push events for now
    if (event !== "push") {
      return NextResponse.json({ message: "Event ignored" }, { status: 200 });
    }

    const { repository, head_commit, ref } = body;
    
    if (!repository || !head_commit) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Find project by repository full name (e.g., "username/repo-name")
    const repoFullName = repository.full_name;
    const project = await prisma.project.findFirst({
      where: { repoFullName }
    });

    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    // Update project status with latest commit info
    await prisma.projectStatus.upsert({
      where: { projectId: project.id },
      update: {
        lastCommitSha: head_commit.id,
        lastCommitAt: new Date(head_commit.timestamp),
        updatedAt: new Date()
      },
      create: {
        projectId: project.id,
        lastCommitSha: head_commit.id,
        lastCommitAt: new Date(head_commit.timestamp),
        updatedAt: new Date()
      }
    });

    // Record the event
    await prisma.integrationEvent.create({
      data: {
        projectId: project.id,
        source: "github",
        type: "push",
        payload: {
          commitSha: head_commit.id,
          commitMessage: head_commit.message,
          author: head_commit.author?.name,
          branch: ref?.replace("refs/heads/", ""),
          url: head_commit.url
        },
        occurredAt: new Date(head_commit.timestamp)
      }
    });

    return NextResponse.json({ 
      message: "Webhook processed",
      project: project.slug,
      commit: head_commit.id.substring(0, 7)
    });

  } catch (error) {
    console.error("GitHub webhook error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}