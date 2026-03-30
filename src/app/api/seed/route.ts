import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const ADMIN_TOKEN = "admin-token";

function verifyAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${ADMIN_TOKEN}`;
}

interface SeedTool {
  name: string;
  description: string;
  category: string;
  type: string;
  platform: string;
  tags: string;
  version: string;
  author: string;
  rating: number;
  downloadCount: number;
  isFeatured: boolean;
  isHot: boolean;
}

const SAMPLE_TOOLS: SeedTool[] = [
  {
    name: "Gold Scalper Pro EA",
    description:
      "A high-frequency scalping Expert Advisor designed specifically for XAUUSD. Uses advanced price action analysis and RSI-based entries to capture quick pips on M1 and M5 timeframes. Includes built-in trailing stop and break-even management.",
    category: "scalping",
    type: "ea",
    platform: "mt4",
    tags: "Scalping,Gold,XAUUSD,M1,M5,Price Action",
    version: "3.2.1",
    author: "FXAlgos Lab",
    rating: 4.7,
    downloadCount: 1250,
    isFeatured: true,
    isHot: true,
  },
  {
    name: "Trend Master EA",
    description:
      "A trend-following Expert Advisor that uses moving average crossovers and ATR for dynamic position sizing. Works best on H1 and H4 timeframes across major forex pairs. Features multi-currency support and smart risk management.",
    category: "auto-trading",
    type: "ea",
    platform: "both",
    tags: "Trend,MA Crossover,ATR,Major Pairs,H1,H4",
    version: "2.5.0",
    author: "TradeLogic Systems",
    rating: 4.5,
    downloadCount: 980,
    isFeatured: true,
    isHot: false,
  },
  {
    name: "RSI Divergence Indicator",
    description:
      "Detects regular and hidden RSI divergences on any timeframe. Draws clear arrows and trendlines on the chart when a divergence is spotted. Highly customizable with alert notifications via email and push.",
    category: "indicator",
    type: "indicator",
    platform: "mt4",
    tags: "RSI,Divergence,Signal,Alert,All Timeframes",
    version: "1.8.3",
    author: "IndicatorFactory",
    rating: 4.3,
    downloadCount: 750,
    isFeatured: false,
    isHot: true,
  },
  {
    name: "Grid Trader EA",
    description:
      "A grid-based Expert Advisor that places pending orders at fixed intervals. Optimized for ranging markets with adjustable grid spacing, lot multiplier, and maximum open trades. Includes news filter to avoid high-impact events.",
    category: "auto-trading",
    type: "ea",
    platform: "mt5",
    tags: "Grid,Hedging,Ranging,News Filter,Risk Management",
    version: "4.1.0",
    author: "AlgoTraders Pro",
    rating: 4.1,
    downloadCount: 620,
    isFeatured: false,
    isHot: false,
  },
  {
    name: "Multi-Timeframe Dashboard",
    description:
      "An all-in-one dashboard indicator showing trend direction, strength, and key levels across multiple timeframes. Displays RSI, MACD, and Moving Average signals in a clean table format. Essential for multi-timeframe analysis.",
    category: "tools",
    type: "indicator",
    platform: "both",
    tags: "Dashboard,MTF,RSI,MACD,MA,Analysis",
    version: "2.0.5",
    author: "ForexTools Dev",
    rating: 4.6,
    downloadCount: 890,
    isFeatured: true,
    isHot: false,
  },
  {
    name: "Scalping Momentum EA",
    description:
      "A momentum-based scalper that uses Stochastic and Bollinger Bands for entries. Designed for EURUSD and GBPUSD on M1-M15 timeframes. Features ultra-fast execution and a unique spread filter to avoid wide spreads.",
    category: "scalping",
    type: "ea",
    platform: "mt4",
    tags: "Scalping,Momentum,Stochastic,Bollinger Bands,EURUSD,GBPUSD",
    version: "1.6.2",
    author: "SpeedFX Trading",
    rating: 4.2,
    downloadCount: 540,
    isFeatured: false,
    isHot: true,
  },
  {
    name: "Supply & Demand Zones Indicator",
    description:
      "Automatically identifies and draws supply and demand zones on the chart. Zones are refreshed on each new bar and include strength indicators. Shows historical zones for backtesting and supports all timeframes.",
    category: "indicator",
    type: "indicator",
    platform: "mt5",
    tags: "Supply,Demand,Zones,SR Levels,Price Action",
    version: "3.0.0",
    author: "SmartChart Tools",
    rating: 4.8,
    downloadCount: 1100,
    isFeatured: true,
    isHot: true,
  },
  {
    name: "Risk Management Calculator",
    description:
      "A comprehensive risk management tool that calculates lot size based on account balance, risk percentage, and stop loss distance. Includes pip value calculator, drawdown tracker, and equity curve display directly on the chart.",
    category: "tools",
    type: "indicator",
    platform: "both",
    tags: "Risk Management,Position Sizing,Lot Calculator,Drawdown",
    version: "1.4.1",
    author: "SafeTrade Dev",
    rating: 4.4,
    downloadCount: 670,
    isFeatured: false,
    isHot: false,
  },
  {
    name: "News Spike Trader EA",
    description:
      "An Expert Advisor specifically designed to trade around high-impact news events. Places straddle orders before news releases and manages positions with tight stops. Compatible with major economic calendar events.",
    category: "auto-trading",
    type: "ea",
    platform: "mt4",
    tags: "News,Spike,Straddle,Economic Calendar,Event Trading",
    version: "2.3.0",
    author: "NewsTrader HQ",
    rating: 4.0,
    downloadCount: 430,
    isFeatured: false,
    isHot: false,
  },
  {
    name: "Heikin Ashi Smoothed Indicator",
    description:
      "An enhanced Heikin Ashi charting indicator with smoothing algorithms for clearer trend identification. Includes color-coded bars, built-in MA, and signal arrows. Ideal for swing trading on H1-D1 timeframes.",
    category: "indicator",
    type: "indicator",
    platform: "mt5",
    tags: "Heikin Ashi,Smoothed,Trend,Swing Trading,H1,D1",
    version: "1.2.0",
    author: "ChartMaster Pro",
    rating: 4.3,
    downloadCount: 580,
    isFeatured: false,
    isHot: false,
  },
];

const SEED_REVIEWS = [
  {
    name: "Rizky F.",
    role: "Forex Trader",
    comment: "EA nya work bro! Auto profit konsisten 🔥",
    rating: 5,
    isApproved: true,
    isFeatured: true,
  },
  {
    name: "Ahmad D.",
    role: "Scalper",
    comment: "Gratis tapi kualitas premium. Mantap!",
    rating: 5,
    isApproved: true,
    isFeatured: true,
  },
  {
    name: "Budi S.",
    role: "Pro Trader",
    comment: "Sistem grid EA nya keren banget, recommended!",
    rating: 4,
    isApproved: true,
    isFeatured: true,
  },
  {
    name: "Dewi A.",
    role: "Analyst",
    comment: "Indicator-nya akurat, bisa buat EA sendiri juga",
    rating: 5,
    isApproved: true,
    isFeatured: true,
  },
  {
    name: "Fajar M.",
    role: "Beginner",
    comment: "No ribet, tinggal download langsung pakai. Gas!",
    rating: 5,
    isApproved: true,
    isFeatured: true,
  },
];

// POST /api/seed - Seed database with sample tools, reviews, and site config
export async function POST(request: NextRequest) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure admin user exists
    const adminCount = await db.admin.count();
    if (adminCount === 0) {
      await db.admin.create({
        data: {
          username: "user admin",
          password: "123admin",
        },
      });
    }

    // Check if data already exists
    const existingCount = await db.tradingTool.count();
    if (existingCount > 0) {
      // Still seed reviews and site config even if tools exist
      const reviewCount = await db.review.count();
      if (reviewCount === 0) {
        await db.review.createMany({ data: SEED_REVIEWS });
      }

      // Seed site config
      const existingConfig = await db.siteConfig.findUnique({
        where: { key: "saweriaUrl" },
      });
      if (!existingConfig) {
        await db.siteConfig.upsert({
          where: { key: "saweriaUrl" },
          update: {},
          create: {
            key: "saweriaUrl",
            value: "https://saweria.co/eahub",
          },
        });
      }

      return NextResponse.json({
        success: true,
        message: `Database already has ${existingCount} tools. Skipping tool seed. Reviews and configs synced.`,
        count: existingCount,
      });
    }

    // Seed the tools
    const createdTools = await db.tradingTool.createMany({
      data: SAMPLE_TOOLS.map((tool) => ({
        name: tool.name,
        description: tool.description,
        category: tool.category,
        type: tool.type,
        platform: tool.platform,
        tags: tool.tags,
        version: tool.version,
        author: tool.author,
        rating: tool.rating,
        downloadCount: tool.downloadCount,
        isFeatured: tool.isFeatured,
        isHot: tool.isHot,
      })),
    });

    // Seed reviews
    const reviewCount = await db.review.count();
    if (reviewCount === 0) {
      await db.review.createMany({ data: SEED_REVIEWS });
    }

    // Seed site config
    const existingConfig = await db.siteConfig.findUnique({
      where: { key: "saweriaUrl" },
    });
    if (!existingConfig) {
      await db.siteConfig.upsert({
        where: { key: "saweriaUrl" },
        update: {},
        create: {
          key: "saweriaUrl",
          value: "https://saweria.co/eahub",
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${createdTools.count} sample tools, reviews, and site config.`,
      count: createdTools.count,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to seed database";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
