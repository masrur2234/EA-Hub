import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// IMPORTANT: Force dynamic - prevent Vercel from caching API responses
export const dynamic = 'force-dynamic';

const ADMIN_TOKEN = "admin-token";

function verifyAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${ADMIN_TOKEN}`;
}

// GET /api/tools/[id] - Get single tool by ID
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const tool = await db.tradingTool.findUnique({
      where: { id },
    });

    if (!tool) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 });
    }

    return NextResponse.json(tool);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch tool";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT /api/tools/[id] - Update tool (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existingTool = await db.tradingTool.findUnique({
      where: { id },
    });

    if (!existingTool) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 });
    }

    const body = await request.json();
    const tool = await db.tradingTool.update({
      where: { id },
      data: {
        name: body.name !== undefined ? body.name : existingTool.name,
        description: body.description !== undefined ? body.description : existingTool.description,
        category: body.category !== undefined ? body.category : existingTool.category,
        type: body.type !== undefined ? body.type : existingTool.type,
        platform: body.platform !== undefined ? body.platform : existingTool.platform,
        tags: body.tags !== undefined ? body.tags : existingTool.tags,
        fileUrl: body.fileUrl !== undefined ? body.fileUrl : existingTool.fileUrl,
        fileName: body.fileName !== undefined ? body.fileName : existingTool.fileName,
        imageUrl: body.imageUrl !== undefined ? body.imageUrl : existingTool.imageUrl,
        version: body.version !== undefined ? body.version : existingTool.version,
        author: body.author !== undefined ? body.author : existingTool.author,
        rating: body.rating !== undefined ? body.rating : existingTool.rating,
        downloadCount: body.downloadCount !== undefined ? body.downloadCount : existingTool.downloadCount,
        isFeatured: body.isFeatured !== undefined ? body.isFeatured : existingTool.isFeatured,
        isHot: body.isHot !== undefined ? body.isHot : existingTool.isHot,
      },
    });

    return NextResponse.json(tool);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update tool";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/tools/[id] - Delete tool (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existingTool = await db.tradingTool.findUnique({
      where: { id },
    });

    if (!existingTool) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 });
    }

    await db.tradingTool.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Tool deleted successfully" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete tool";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
