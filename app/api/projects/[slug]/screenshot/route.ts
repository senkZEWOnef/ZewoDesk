import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import puppeteer from "puppeteer";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  console.log('Screenshot API called for slug:', slug);
  
  try {
    const project = await prisma.project.findUnique({
      where: { slug },
    });

    console.log('Found project:', project ? `${project.name} - ${project.liveUrl}` : 'null');

    if (!project || !project.liveUrl) {
      console.log('Error: Project not found or no live URL');
      return NextResponse.json(
        { error: "Project not found or no live URL" },
        { status: 404 }
      );
    }

    console.log('Launching Puppeteer browser...');
    // Launch browser
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ],
    });

    console.log('Browser launched, creating new page...');
    const page = await browser.newPage();
    
    // Set viewport to capture hero section properly
    await page.setViewport({ width: 1200, height: 800 });
    
    console.log('Navigating to URL:', project.liveUrl);
    // Navigate to the live URL
    await page.goto(project.liveUrl, { 
      waitUntil: 'domcontentloaded',
      timeout: 15000 
    });

    console.log('Page loaded, waiting for content...');
    // Wait a bit for any animations/lazy loading
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('Taking screenshot...');
    // Take screenshot
    const screenshot = await page.screenshot({
      type: 'jpeg',
      quality: 85,
      fullPage: false, // Only capture viewport (hero section)
    });

    console.log('Screenshot taken, closing browser...');
    await browser.close();

    // Save screenshot
    const filename = `${project.slug}-preview.jpg`;
    const filepath = path.join(process.cwd(), 'public', 'previews', filename);
    
    console.log('Saving screenshot to:', filepath);
    await writeFile(filepath, screenshot);
    console.log('Screenshot saved successfully');

    // Update project with preview image path
    const previewImagePath = `/previews/${filename}`;
    console.log('Updating project with preview image path:', previewImagePath);
    
    await prisma.project.update({
      where: { slug },
      data: { previewImage: previewImagePath },
    });

    console.log('Project updated successfully');
    return NextResponse.json({ 
      success: true, 
      previewImage: previewImagePath 
    });

  } catch (error) {
    console.error('Screenshot generation failed:', error);
    console.error('Error details:', error.message);
    console.error('Stack trace:', error.stack);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate screenshot',
        details: error.message 
      },
      { status: 500 }
    );
  }
}