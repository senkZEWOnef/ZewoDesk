// app/api/projects/[slug]/docs/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const body = await request.json();
    
    const project = await prisma.project.findUnique({
      where: { slug }
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Update the project docs
    const updatedDocs = await prisma.projectDocs.upsert({
      where: { projectId: project.id },
      update: {
        ...(body.notesMd !== undefined && { notesMd: body.notesMd }),
        ...(body.brainstormingMd !== undefined && { brainstormingMd: body.brainstormingMd }),
        ...(body.dbDiagramData !== undefined && { dbDiagramData: body.dbDiagramData }),
        updatedAt: new Date()
      },
      create: {
        projectId: project.id,
        notesMd: body.notesMd || "",
        brainstormingMd: body.brainstormingMd || "",
        dbDiagramData: body.dbDiagramData || null
      }
    });

    return NextResponse.json({ 
      message: "Docs updated successfully",
      docs: updatedDocs
    });

  } catch (error) {
    console.error("Failed to update docs:", error);
    return NextResponse.json({ error: "Failed to update docs" }, { status: 500 });
  }
}