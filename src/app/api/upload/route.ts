import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

const ADMIN_TOKEN = "admin-token";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${ADMIN_TOKEN}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "File harus berupa gambar (PNG, JPG, JPEG, WebP)" },
        { status: 400 }
      );
    }

    // Max 2MB to keep base64 within server limits
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Ukuran gambar maksimal 2MB" },
        { status: 400 }
      );
    }

    // Convert to base64 data URL
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;

    return NextResponse.json({
      fileUrl: dataUrl,
      message: "Gambar berhasil diupload",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Upload gagal";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}