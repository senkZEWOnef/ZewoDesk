// app/api/projects/[slug]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    
    const project = await prisma.project.findUnique({
      where: { slug }
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Delete the project (cascade will handle related records)
    await prisma.project.delete({
      where: { slug }
    });

    return NextResponse.json({ 
      message: "Project deleted successfully",
      slug 
    });

  } catch (error) {
    console.error("Failed to delete project:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
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
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);

  } catch (error) {
    console.error("Failed to fetch project:", error);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}