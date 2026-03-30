import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/reviews
// - ?all=true → return all (admin)
// - ?approved=true&featured=true → return approved+featured (public)
// - default → return approved+featured
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all") === "true";
    const approved = searchParams.get("approved") === "true";
    const featured = searchParams.get("featured") === "true";

    if (all) {
      const reviews = await db.review.findMany({
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(reviews);
    }

    if (approved || featured) {
      const where: Record<string, boolean> = {};
      if (approved) where.isApproved = true;
      if (featured) where.isFeatured = true;
      const reviews = await db.review.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(reviews);
    }

    // Default: return approved + featured
    const reviews = await db.review.findMany({
      where: {
        isApproved: true,
        isFeatured: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(reviews);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch reviews";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/reviews - Create a new review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { toolId, toolName, name, role, comment, rating } = body;

    if (!name || !comment || !rating) {
      return NextResponse.json(
        { error: "Name, comment, and rating are required" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    const review = await db.review.create({
      data: {
        toolId: toolId || "",
        toolName: toolName || "",
        name,
        role: role || "Trader",
        comment,
        rating: Number(rating),
        isApproved: false,
        isFeatured: false,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create review";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
