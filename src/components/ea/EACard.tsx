'use client';

import { Star, Download, Bot } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { TradingTool } from '@/lib/store';

interface EACardProps {
  tool: TradingTool;
  onSelect: (tool: TradingTool) => void;
}

function StarRating({ rating }: { rating: number }) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(
        <Star key={i} className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
      );
    } else if (i === fullStars && hasHalf) {
      stars.push(
        <div key={i} className="relative w-3.5 h-3.5">
          <Star className="w-3.5 h-3.5 text-[#1F2937]" />
          <div className="absolute inset-0 overflow-hidden w-[50%]">
            <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
          </div>
        </div>
      );
    } else {
      stars.push(
        <Star key={i} className="w-3.5 h-3.5 text-[#1F2937]" />
      );
    }
  }
  return <div className="flex items-center gap-0.5">{stars}</div>;
}

export default function EACard({ tool, onSelect }: EACardProps) {
  const tagList = tool.tags
    ? tool.tags.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  return (
    <div
      onClick={() => onSelect(tool)}
      className="card-hover cursor-pointer rounded-2xl border border-[#1F2937] bg-[#111827] overflow-hidden flex flex-col"
    >
      {/* Top: Image / Placeholder */}
      <div className="relative h-40 bg-[#0B0F1A] overflow-hidden">
        {tool.imageUrl ? (
          <img
            src={tool.imageUrl}
            alt={tool.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#111827] to-[#0B0F1A]">
            <div className="w-16 h-16 rounded-2xl bg-[#00FFB2]/10 flex items-center justify-center">
              <Bot className="w-8 h-8 text-[#00FFB2]/60" />
            </div>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <Badge className="bg-[#00FFB2] text-[#0B0F1A] border-0 font-bold text-[10px] px-2 py-0.5">
            FREE
          </Badge>
          <Badge className="bg-[#3B82F6] text-white border-0 font-semibold text-[10px] px-2 py-0.5">
            {tool.platform?.toUpperCase() || 'MT4/MT5'}
          </Badge>
        </div>
        {tool.isHot && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-gradient-to-r from-[#EF4444] to-[#F59E0B] text-white border-0 font-bold text-[10px] px-2 py-0.5 animate-pulse">
              🔥 HOT
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        {/* Name */}
        <h3 className="font-bold text-base text-white line-clamp-1 leading-tight">
          {tool.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-[#9CA3AF] line-clamp-2 leading-relaxed">
          {tool.description}
        </p>

        {/* Tags */}
        {tagList.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tagList.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded-full bg-[#1F2937] text-[#9CA3AF] border border-[#1F2937]"
              >
                {tag}
              </span>
            ))}
            {tagList.length > 3 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1F2937] text-[#9CA3AF]">
                +{tagList.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom: Rating + Downloads */}
        <div className="flex items-center justify-between pt-2 border-t border-[#1F2937]">
          <div className="flex items-center gap-1.5">
            <StarRating rating={tool.rating} />
            <span className="text-xs text-[#9CA3AF] ml-1">{tool.rating}</span>
          </div>
          <div className="flex items-center gap-1 text-[#9CA3AF]">
            <Download className="w-3.5 h-3.5" />
            <span className="text-xs">
              {tool.downloadCount >= 1000
                ? `${(tool.downloadCount / 1000).toFixed(1)}K`
                : tool.downloadCount}
            </span>
          </div>
        </div>

        {/* Download Button */}
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(tool);
          }}
          className="w-full bg-gradient-to-r from-[#00FFB2] to-[#00cc8e] text-[#0B0F1A] font-bold hover:opacity-90 btn-neon h-10 text-sm"
        >
          <Download className="w-4 h-4 mr-1.5" />
          Download
        </Button>
      </div>
    </div>
  );
}
