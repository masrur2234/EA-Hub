import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// IMPORTANT: Force dynamic - prevent Vercel from caching API responses
export const dynamic = 'force-dynamic';

const ADMIN_TOKEN = "admin-token";

function verifyAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${ADMIN_TOKEN}`;
}

// GET /api/site-config - Get all configs as key-value object
export async function GET() {
  try {
    const configs = await db.siteConfig.findMany();
    const kv: Record<string, string> = {};
    for (const c of configs) {
      kv[c.key] = c.value;
    }
    return NextResponse.json(kv);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch site config";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT /api/site-config - Update or create a config (admin only)
export async function PUT(request: NextRequest) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { key, value } = body;

    if (!key) {
      return NextResponse.json({ error: "Key is required" }, { status: 400 });
    }

    const config = await db.siteConfig.upsert({
      where: { key },
      update: { value: value || "" },
      create: { key, value: value || "" },
    });

    return NextResponse.json(config);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update site config";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
