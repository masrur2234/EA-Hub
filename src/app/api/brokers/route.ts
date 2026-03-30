import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const ADMIN_TOKEN = "admin-token";

function verifyAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${ADMIN_TOKEN}`;
}

// GET /api/brokers — list all brokers (public)
export async function GET() {
  try {
    const brokers = await db.broker.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(brokers);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch brokers";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/brokers — create broker (admin only)
export async function POST(request: NextRequest) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, logoUrl, affiliateUrl, rating, features, bonusInfo, isFeatured, sortOrder } = body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const broker = await db.broker.create({
      data: {
        name: name.trim(),
        description: (description || "").trim(),
        logoUrl: (logoUrl || "").trim(),
        affiliateUrl: (affiliateUrl || "").trim(),
        rating: typeof rating === "number" ? rating : 0,
        features: (features || "").trim(),
        bonusInfo: (bonusInfo || "").trim(),
        isFeatured: !!isFeatured,
        sortOrder: typeof sortOrder === "number" ? sortOrder : 0,
      },
    });

    return NextResponse.json(broker, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create broker";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
