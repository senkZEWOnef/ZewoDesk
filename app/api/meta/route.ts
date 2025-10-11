import { NextResponse } from "next/server";

function parseDbHost(dbUrl?: string) {
  try {
    if (!dbUrl) return null;
    const u = new URL(dbUrl.replace("postgresql://", "http://"));
    return u.host; // e.g. ep-sweet-1234.us-east-2.aws.neon.tech
  } catch {
    return null;
  }
}

export async function GET() {
  const provider = process.env.NETLIFY
    ? "netlify"
    : process.env.VERCEL
    ? "vercel"
    : process.env.AWS_REGION
    ? "amplify"
    : "local";
  const dbHost = parseDbHost(process.env.DATABASE_URL);
  const meta = {
    app: process.env.APP_NAME || "dev-console",
    provider,
    nodeEnv: process.env.NODE_ENV,
    dbHost,
    hasDatabaseUrl: !!process.env.DATABASE_URL,
  };
  return NextResponse.json(meta);
}
