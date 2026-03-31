import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// SQL to create all tables if they don't exist
const CREATE_TABLES_SQL = `
CREATE TABLE IF NOT EXISTS "TradingTool" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "category" TEXT NOT NULL DEFAULT 'tools',
    "type" TEXT NOT NULL DEFAULT 'ea',
    "platform" TEXT NOT NULL DEFAULT 'mt4',
    "tags" TEXT NOT NULL DEFAULT '',
    "fileUrl" TEXT NOT NULL DEFAULT '',
    "fileName" TEXT NOT NULL DEFAULT '',
    "imageUrl" TEXT NOT NULL DEFAULT '',
    "version" TEXT NOT NULL DEFAULT '1.0',
    "author" TEXT NOT NULL DEFAULT 'Anonymous',
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isHot" BOOLEAN NOT