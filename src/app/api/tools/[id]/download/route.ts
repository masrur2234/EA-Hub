import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST /api/tools/[id]/download - Increment download count
export async function POST(
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

    const updated = await db.tradingTool.update({
      where: { id },
      data: {
        downloadCount: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({
      success: true,
      downloadCount: updated.downloadCount,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update download count";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}