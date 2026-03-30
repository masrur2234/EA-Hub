import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const ADMIN_TOKEN = "admin-token";

function verifyAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${ADMIN_TOKEN}`;
}

// GET /api/tools - List all tools with optional filters
export async function GET(request: NextRequest) {
  try {
    // Seed admin user if none exists
    const adminCount = await db.admin.count();
    if (adminCount === 0) {
      await db.admin.create({
        data: {
          username: "admin",
          password: "admin123",
        },
      });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const type = searchParams.get("type") || "";
    const platform = searchParams.get("platform") || "";

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { tags: { contains: search } },
        { author: { contains: search } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (type) {
      where.type = type;
    }

    if (platform) {
      where.platform = platform;
    }

    const tools = await db.tradingTool.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(tools);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch tools";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/tools - Create a new tool (admin only)
export async function POST(request: NextRequest) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contentType = request.headers.get("content-type") || "";

    let data: Record<string, unknown>;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      data = {
        name: (formData.get("name") as string) || "",
        description: (formData.get("description") as string) || "",
        category: (formData.get("category") as string) || "tools",
        type: (formData.get("type") as string) || "ea",
        platform: (formData.get("platform") as string) || "mt4",
        tags: (formData.get("tags") as string) || "",
        fileUrl: (formData.get("fileUrl") as string) || "",
        fileName: (formData.get("fileName") as string) || "",
        imageUrl: (formData.get("imageUrl") as string) || "",
        version: (formData.get("version") as string) || "1.0",
        author: (formData.get("author") as string) || "Anonymous",
        rating: formData.get("rating") ? parseFloat(formData.get("rating") as string) : 0,
        downloadCount: formData.get("downloadCount") ? parseInt(formData.get("downloadCount") as string) : 0,
        isFeatured: formData.get("isFeatured") === "true",
        isHot: formData.get("isHot") === "true",
      };
    } else {
      data = await request.json();
    }

    if (!data.name || typeof data.name !== "string" || data.name.trim() === "") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const tool = await db.tradingTool.create({
      data: {
        name: data.name as string,
        description: (data.description as string) || "",
        category: (data.category as string) || "tools",
        type: (data.type as string) || "ea",
        platform: (data.platform as string) || "mt4",
        tags: (data.tags as string) || "",
        fileUrl: (data.fileUrl as string) || "",
        fileName: (data.fileName as string) || "",
        imageUrl: (data.imageUrl as string) || "",
        version: (data.version as string) || "1.0",
        author: (data.author as string) || "Anonymous",
        rating: (data.rating as number) || 0,
        downloadCount: (data.downloadCount as number) || 0,
        isFeatured: (data.isFeatured as boolean) || false,
        isHot: (data.isHot as boolean) || false,
      },
    });

    return NextResponse.json(tool, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create tool";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
