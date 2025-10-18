// app/api/hooks/netlify/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const netlifyEvent = request.headers.get("x-netlify-event");
    
    console.log("Netlify webhook received:", netlifyEvent, body);
    
    // Handle different Netlify deploy events
    if (!["deploy-succeeded", "deploy-failed", "deploy-building"].includes(netlifyEvent || "")) {
      return NextResponse.json({ message: "Event ignored" }, { status: 200 });
    }

    // Extract deploy information from Netlify payload
    const {
      id: deployId,
      site_id: siteId,
      deploy_id,
      state,
      url,
      deploy_ssl_url,
      created_at,
      updated_at,
      branch,
      commit_ref,
      commit_url,
      context,
      site_url
    } = body;

    if (!deployId && !deploy_id) {
      return NextResponse.json({ error: "No deploy ID in payload" }, { status: 400 });
    }

    // Try to find project by site URL or external ID
    let project = await prisma.project.findFirst({
      where: {
        OR: [
          { liveUrl: { contains: site_url } },
          { deployExternalId: siteId },
          { liveUrl: { contains: url } },
          { liveUrl: { contains: deploy_ssl_url } }
        ]
      }
    });

    // If project found but no deployProvider set, auto-set it to netlify
    if (project && !project.deployProvider) {
      console.log(`Auto-setting deployProvider to netlify for project: ${project.name}`);
      project = await prisma.project.update({
        where: { id: project.id },
        data: { deployProvider: "netlify" }
      });
    }

    if (!project) {
      console.log("No matching project found for Netlify site:", siteId, site_url);
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    // Map Netlify state to our deploy state
    const deployState = state || (netlifyEvent === "deploy-succeeded" ? "success" : 
                                 netlifyEvent === "deploy-failed" ? "failed" : 
                                 netlifyEvent === "deploy-building" ? "building" : "unknown");

    // Update project status with deployment info
    await prisma.projectStatus.upsert({
      where: { projectId: project.id },
      update: {
        lastDeployId: deployId || deploy_id,
        lastDeployState: deployState,
        lastDeployAt: new Date(updated_at || created_at || new Date()),
        updatedAt: new Date()
      },
      create: {
        projectId: project.id,
        lastDeployId: deployId || deploy_id,
        lastDeployState: deployState,
        lastDeployAt: new Date(updated_at || created_at || new Date()),
        updatedAt: new Date()
      }
    });

    // Record the integration event
    await prisma.integrationEvent.create({
      data: {
        projectId: project.id,
        source: "netlify",
        type: netlifyEvent || "deploy",
        payload: {
          deployId: deployId || deploy_id,
          siteId,
          state: deployState,
          url: deploy_ssl_url || url,
          branch,
          commitRef: commit_ref,
          commitUrl: commit_url,
          context
        },
        occurredAt: new Date(updated_at || created_at || new Date())
      }
    });

    return NextResponse.json({ 
      message: "Netlify webhook processed",
      project: project.slug,
      deploy: (deployId || deploy_id)?.substring(0, 7),
      state: deployState
    });

  } catch (error) {
    console.error("Netlify webhook error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}