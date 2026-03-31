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
    "isHot" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Broker" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "logoUrl" TEXT NOT NULL DEFAULT '',
    "affiliateUrl" TEXT NOT NULL DEFAULT '',
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "features" TEXT NOT NULL DEFAULT '',
    "bonusInfo" TEXT NOT NULL DEFAULT '',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Admin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "toolId" TEXT NOT NULL DEFAULT '',
    "toolName" TEXT NOT NULL DEFAULT '',
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'Trader',
    "comment" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "SiteConfig" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'main',
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "Admin_username_key" ON "Admin"("username");
CREATE UNIQUE INDEX IF NOT EXISTS "SiteConfig_key_key" ON "SiteConfig"("key");
`;

const SAMPLE_TOOLS = [
  {
    name: "Gold Scalper Pro EA",
    description: "A high-frequency scalping Expert Advisor designed specifically for XAUUSD. Uses advanced price action analysis and RSI-based entries to capture quick pips on M1 and M5 timeframes.",
    category: "scalping", type: "ea", platform: "mt4",
    tags: "Scalping,Gold,XAUUSD,M1,M5,Price Action",
    version: "3.2.1", author: "FXAlgos Lab", rating: 4.7, downloadCount: 1250,
    isFeatured: true, isHot: true,
  },
  {
    name: "Trend Master EA",
    description: "A trend-following Expert Advisor that uses moving average crossovers and ATR for dynamic position sizing. Works best on H1 and H4 timeframes across major forex pairs.",
    category: "auto-trading", type: "ea", platform: "both",
    tags: "Trend,MA Crossover,ATR,Major Pairs,H1,H4",
    version: "2.5.0", author: "TradeLogic Systems", rating: 4.5, downloadCount: 980,
    isFeatured: true, isHot: false,
  },
  {
    name: "RSI Divergence Indicator",
    description: "Detects regular and hidden RSI divergences on any timeframe. Draws clear arrows and trendlines on the chart when a divergence is spotted.",
    category: "indicator", type: "indicator", platform: "mt4",
    tags: "RSI,Divergence,Signal,Alert,All Timeframes",
    version: "1.8.3", author: "IndicatorFactory", rating: 4.3, downloadCount: 750,
    isFeatured: false, isHot: true,
  },
  {
    name: "Grid Trader EA",
    description: "A grid-based Expert Advisor that places pending orders at fixed intervals. Optimized for ranging markets with adjustable grid spacing.",
    category: "auto-trading", type: "ea", platform: "mt5",
    tags: "Grid,Hedging,Ranging,News Filter,Risk Management",
    version: "4.1.0", author: "AlgoTraders Pro", rating: 4.1, downloadCount: 620,
    isFeatured: false, isHot: false,
  },
  {
    name: "Multi-Timeframe Dashboard",
    description: "An all-in-one dashboard indicator showing trend direction, strength, and key levels across multiple timeframes.",
    category: "tools", type: "indicator", platform: "both",
    tags: "Dashboard,MTF,RSI,MACD,MA,Analysis",
    version: "2.0.5", author: "ForexTools Dev", rating: 4.6, downloadCount: 890,
    isFeatured: true, isHot: false,
  },
  {
    name: "Scalping Momentum EA",
    description: "A momentum-based scalper that uses Stochastic and Bollinger Bands for entries. Designed for EURUSD and GBPUSD on M1-M15 timeframes.",
    category: "scalping", type: "ea", platform: "mt4",
    tags: "Scalping,Momentum,Stochastic,Bollinger Bands,EURUSD,GBPUSD",
    version: "1.6.2", author: "SpeedFX Trading", rating: 4.2, downloadCount: 540,
    isFeatured: false, isHot: true,
  },
  {
    name: "Supply & Demand Zones Indicator",
    description: "Automatically identifies and draws supply and demand zones on the chart. Zones are refreshed on each new bar and include strength indicators.",
    category: "indicator", type: "indicator", platform: "mt5",
    tags: "Supply,Demand,Zones,SR Levels,Price Action",
    version: "3.0.0", author: "SmartChart Tools", rating: 4.8, downloadCount: 1100,
    isFeatured: true, isHot: true,
  },
  {
    name: "Risk Management Calculator",
    description: "A comprehensive risk management tool that calculates lot size based on account balance, risk percentage, and stop loss distance.",
    category: "tools", type: "indicator", platform: "both",
    tags: "Risk Management,Position Sizing,Lot Calculator,Drawdown",
    version: "1.4.1", author: "SafeTrade Dev", rating: 4.4, downloadCount: 670,
    isFeatured: false, isHot: false,
  },
  {
    name: "News Spike Trader EA",
    description: "An Expert Advisor specifically designed to trade around high-impact news events. Places straddle orders before news releases.",
    category: "auto-trading", type: "ea", platform: "mt4",
    tags: "News,Spike,Straddle,Economic Calendar,Event Trading",
    version: "2.3.0", author: "NewsTrader HQ", rating: 4.0, downloadCount: 430,
    isFeatured: false, isHot: false,
  },
  {
    name: "Heikin Ashi Smoothed Indicator",
    description: "An enhanced Heikin Ashi charting indicator with smoothing algorithms for clearer trend identification. Ideal for swing trading on H1-D1 timeframes.",
    category: "indicator", type: "indicator", platform: "mt5",
    tags: "Heikin Ashi,Smoothed,Trend,Swing Trading,H1,D1",
    version: "1.2.0", author: "ChartMaster Pro", rating: 4.3, downloadCount: 580,
    isFeatured: false, isHot: false,
  },
];

const SEED_REVIEWS = [
  { name: "Rizky F.", role: "Forex Trader", comment: "EA nya work bro! Auto profit konsisten", rating: 5, isApproved: true, isFeatured: true },
  { name: "Ahmad D.", role: "Scalper", comment: "Gratis tapi kualitas premium. Mantap!", rating: 5, isApproved: true, isFeatured: true },
  { name: "Budi S.", role: "Pro Trader", comment: "Sistem grid EA nya keren banget, recommended!", rating: 4, isApproved: true, isFeatured: true },
  { name: "Dewi A.", role: "Analyst", comment: "Indicator-nya akurat, bisa buat EA sendiri juga", rating: 5, isApproved: true, isFeatured: true },
  { name: "Fajar M.", role: "Beginner", comment: "No ribet, tinggal download langsung pakai. Gas!", rating: 5, isApproved: true, isFeatured: true },
];

// POST /api/setup - Create tables + seed data
export async function POST() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        error: "DATABASE_URL not set.",
      }, { status: 500 });
    }

    const steps: string[] = [];

    // Create tables
    try {
      for (const sql of CREATE_TABLES_SQL.split(';').filter(s => s.trim())) {
        if (sql.trim()) await db.$executeRawUnsafe(sql.trim());
      }
      steps.push("Tables created");
    } catch (err) {
      steps.push(`Table creation: ${err instanceof Error ? err.message : 'warning'}`);
    }

    // Admin
    try {
      const adminCount = await db.admin.count();
      if (adminCount === 0) {
        await db.admin.create({ data: { username: "admin", password: "admin123" } });
        steps.push("Admin created (admin/admin123)");
      } else {
        steps.push("Admin already exists");
      }
    } catch (err) {
      steps.push(`Admin: ${err instanceof Error ? err.message : 'skipped'}`);
    }

    // Tools
    try {
      const toolCount = await db.tradingTool.count();
      if (toolCount === 0) {
        await db.tradingTool.createMany({ data: SAMPLE_TOOLS });
        steps.push(`${SAMPLE_TOOLS.length} tools seeded`);
      } else {
        steps.push(`${toolCount} tools already exist`);
      }
    } catch (err) {
      steps.push(`Tools: ${err instanceof Error ? err.message : 'skipped'}`);
    }

    // Broker
    try {
      const brokerCount = await db.broker.count();
      if (brokerCount === 0) {
        await db.broker.create({
          data: {
            name: "Exness",
            description: "Broker terpercaya dengan spread rendah dan deposit mudah via bank lokal Indonesia.",
            logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Exness_logo.svg/512px-Exness_logo.svg.png",
            affiliateUrl: "https://one.exnessonelink.com/a/whvtydd8u3?source=app",
            rating: 4.8,
            features: "Spread mulai 0.0 pip,Leverage sampai 1:2000,Deposit mulai $1,Bank lokal Indonesia",
            bonusInfo: "Welcome Bonus 100%",
            isFeatured: true,
            sortOrder: 1,
          },
        });
        steps.push("Broker (Exness) seeded");
      } else {
        steps.push(`${brokerCount} brokers already exist`);
      }
    } catch (err) {
      steps.push(`Broker: ${err instanceof Error ? err.message : 'skipped'}`);
    }

    // Reviews
    try {
      const reviewCount = await db.review.count();
      if (reviewCount === 0) {
        await db.review.createMany({ data: SEED_REVIEWS });
        steps.push(`${SEED_REVIEWS.length} reviews seeded`);
      } else {
        steps.push(`${reviewCount} reviews already exist`);
      }
    } catch (err) {
      steps.push(`Reviews: ${err instanceof Error ? err.message : 'skipped'}`);
    }

    // Site config
    try {
      const cfg = await db.siteConfig.findUnique({ where: { key: "saweriaUrl" } });
      if (!cfg) {
        await db.siteConfig.upsert({
          where: { key: "saweriaUrl" },
          update: {},
          create: { key: "saweriaUrl", value: "https://saweria.co/eahub" },
        });
        steps.push("Saweria config seeded");
      } else {
        steps.push("Config already exists");
      }
    } catch (err) {
      steps.push(`Config: ${err instanceof Error ? err.message : 'skipped'}`);
    }

    return NextResponse.json({ success: true, message: "Setup completed!", steps });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Setup failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
