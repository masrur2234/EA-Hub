import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const ADMIN_TOKEN = "admin-token";

function verifyAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${ADMIN_TOKEN}`;
}

// GET /api/brokers/[id]
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const broker = await db.broker.findUnique({ where: { id } });
    if (!broker) {
      return NextResponse.json({ error: "Broker not found" }, { status: 404 });
    }
    return NextResponse.json(broker);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch broker";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT /api/brokers/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await db.broker.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Broker not found" }, { status: 404 });
    }

    const body = await request.json();
    const broker = await db.broker.update({
      where: { id },
      data: {
        name: body.name !== undefined ? body.name : existing.name,
        description: body.description !== undefined ? body.description : existing.description,
        logoUrl: body.logoUrl !== undefined ? body.logoUrl : existing.logoUrl,
        affiliateUrl: body.affiliateUrl !== undefined ? body.affiliateUrl : existing.affiliateUrl,
        rating: body.rating !== undefined ? body.rating : existing.rating,
        features: body.features !== undefined ? body.features : existing.features,
        bonusInfo: body.bonusInfo !== undefined ? body.bonusInfo : existing.bonusInfo,
        isFeatured: body.isFeatured !== undefined ? body.isFeatured : existing.isFeatured,
        sortOrder: body.sortOrder !== undefined ? body.sortOrder : existing.sortOrder,
      },
    });

    return NextResponse.json(broker);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update broker";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/brokers/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await db.broker.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Broker not found" }, { status: 404 });
    }

    await db.broker.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Broker deleted" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete broker";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
