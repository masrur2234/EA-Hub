'use client';

import { useState } from 'react';
import {
  Download,
  Star,
  Bot,
  Tag,
  Layers,
  Monitor,
  User,
  Calendar,
  Send,
  Check,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import type { TradingTool } from '@/lib/store';

const ROLE_OPTIONS = ['Trader', 'Scalper', 'Beginner', 'Pro Trader', 'Analyst', 'Investor'];

interface EADetailModalProps {
  tool: TradingTool | null;
  open: boolean;
  onClose: () => void;
}

function StarRating({ rating, size = 'md', interactive = false, onRate }: { rating: number; size?: 'sm' | 'md'; interactive?: boolean; onRate?: (r: number) => void }) {
  const starSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (interactive) {
      stars.push(
        <Star
          key={i}
          className={`${starSize} cursor-pointer transition-colors ${
            i < rating
              ? 'fill-[#F59E0B] text-[#F59E0B]'
              : 'text-[#1F2937] hover:text-[#F59E0B]'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onRate?.(i + 1);
          }}
        />
      );
    } else if (i < fullStars) {
      stars.push(
        <Star key={i} className={`${starSize} fill-[#F59E0B] text-[#F59E0B]`} />
      );
    } else if (i === fullStars && hasHalf) {
      stars.push(
        <div key={i} className={`relative ${starSize}`}>
          <Star className={`${starSize} text-[#1F2937]`} />
          <div className="absolute inset-0 overflow-hidden w-[50%]">
            <Star className={`${starSize} fill-[#F59E0B] text-[#F59E0B]`} />
          </div>
        </div>
      );
    } else {
      stars.push(
        <Star key={i} className={`${starSize} text-[#1F2937]`} />
      );
    }
  }
  return <div className="flex items-center gap-0.5">{stars}</div>;
}

function ReviewDialog({
  tool,
  open,
  onClose,
}: {
  tool: TradingTool;
  open: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('Trader');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !comment.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolId: tool.id,
          toolName: tool.name,
          name: name.trim(),
          role,
          comment: comment.trim(),
          rating,
        }),
      });
      if (res.ok) {
        setSuccess(true);
      }
    } catch {
      // silent fail
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="bg-[#111827] border-[#1F2937] text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            ✨ Beri Review
          </DialogTitle>
          <DialogDescription className="text-[#9CA3AF]">
            Bagi pengalaman kamu tentang {tool.name}
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#00FFB2]/10 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-[#00FFB2]" />
            </div>
            <h3 className="text-lg font-bold text-white">Terima kasih! 🎉</h3>
            <p className="text-sm text-[#9CA3AF]">
              Review kamu akan muncul setelah di-approve admin.
            </p>
            <Button
              onClick={onClose}
              className="bg-[#00FFB2] text-[#0B0F1A] font-bold hover:opacity-90"
            >
              Tutup
            </Button>
          </div>
        ) : (
          <div className="space-y-4 mt-2">
            {/* Name */}
            <div>
              <label className="text-sm text-[#9CA3AF] mb-1.5 block">Nama</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama kamu..."
                className="bg-[#0B0F1A] border-[#1F2937] text-white placeholder:text-[#9CA3AF]/50 focus:border-[#00FFB2]"
              />
            </div>

            {/* Role */}
            <div>
              <label className="text-sm text-[#9CA3AF] mb-1.5 block">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-md bg-[#0B0F1A] border border-[#1F2937] text-white px-3 py-2 text-sm focus:border-[#00FFB2] focus:outline-none"
              >
                {ROLE_OPTIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Star Rating */}
            <div>
              <label className="text-sm text-[#9CA3AF] mb-1.5 block">Rating</label>
              <StarRating
                rating={rating}
                interactive
                onRate={setRating}
              />
            </div>

            {/* Comment */}
            <div>
              <label className="text-sm text-[#9CA3AF] mb-1.5 block">Komentar</label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Ceritakan pengalaman kamu..."
                rows={3}
                className="bg-[#0B0F1A] border-[#1F2937] text-white placeholder:text-[#9CA3AF]/50 focus:border-[#00FFB2] resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="ghost"
                onClick={onClose}
                className="flex-1 border border-[#1F2937] text-[#9CA3AF] hover:bg-[#1F2937] hover:text-white"
              >
                Lewati
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={submitting || !name.trim() || !comment.trim()}
                className="flex-1 bg-gradient-to-r from-[#00FFB2] to-[#00cc8e] text-[#0B0F1A] font-bold hover:opacity-90 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#0B0F1A] border-t-transparent rounded-full animate-spin mr-2" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Kirim Review
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function EADetailModal({
  tool,
  open,
  onClose,
}: EADetailModalProps) {
  const [downloading, setDownloading] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [downloadMsg, setDownloadMsg] = useState('');

  if (!tool) return null;

  const tagList = tool.tags
    ? tool.tags.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  const handleDownload = async () => {
    if (!tool.fileUrl) {
      setDownloadMsg('File belum tersedia. Hubungi admin untuk info update.');
      setTimeout(() => setDownloadMsg(''), 3000);
      return;
    }
    setDownloading(true);
    setDownloadMsg('');
    try {
      // Increment download count
      fetch(`/api/tools/${tool.id}/download`, { method: 'POST' }).catch(() => {});
      
      // Support both regular URLs and base64 data URLs
      if (tool.fileUrl.startsWith('data:')) {
        const res = await fetch(tool.fileUrl);
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = tool.fileName || `${tool.name}.ex4`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        const link = document.createElement('a');
        link.href = tool.fileUrl;
        link.download = tool.fileName || tool.name;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      setShowReview(true);
    } catch {
      setDownloadMsg('Download gagal. Coba lagi nanti.');
      setTimeout(() => setDownloadMsg(''), 3000);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
        <DialogContent className="bg-[#111827] border-[#1F2937] text-white max-w-2xl max-h-[90vh] overflow-y-auto hide-scrollbar">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white flex items-center gap-3">
              {tool.name}
              {tool.isHot && (
                <Badge className="bg-gradient-to-r from-[#EF4444] to-[#F59E0B] text-white border-0 text-xs">
                  🔥 HOT
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription className="text-[#9CA3AF]">
              {tool.description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 mt-2">
            {/* Image */}
            <div className="w-full aspect-video rounded-xl overflow-hidden bg-[#0B0F1A]">
              {tool.imageUrl ? (
                <img
                  src={tool.imageUrl}
                  alt={tool.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Bot className="w-20 h-20 text-[#00FFB2]/20" />
                </div>
              )}
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#0B0F1A] rounded-xl p-3 text-center border border-[#1F2937]">
                <div className="text-[#9CA3AF] text-xs mb-1 flex items-center justify-center gap-1">
                  <Monitor className="w-3 h-3" />
                  Platform
                </div>
                <div className="text-white font-semibold text-sm">
                  {tool.platform?.toUpperCase() || 'MT4/MT5'}
                </div>
              </div>
              <div className="bg-[#0B0F1A] rounded-xl p-3 text-center border border-[#1F2937]">
                <div className="text-[#9CA3AF] text-xs mb-1 flex items-center justify-center gap-1">
                  <Layers className="w-3 h-3" />
                  Category
                </div>
                <div className="text-white font-semibold text-sm capitalize">
                  {tool.category}
                </div>
              </div>
              <div className="bg-[#0B0F1A] rounded-xl p-3 text-center border border-[#1F2937]">
                <div className="text-[#9CA3AF] text-xs mb-1 flex items-center justify-center gap-1">
                  <User className="w-3 h-3" />
                  Author
                </div>
                <div className="text-white font-semibold text-sm">
                  {tool.author || 'EA Hub'}
                </div>
              </div>
              <div className="bg-[#0B0F1A] rounded-xl p-3 text-center border border-[#1F2937]">
                <div className="text-[#9CA3AF] text-xs mb-1 flex items-center justify-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Version
                </div>
                <div className="text-white font-semibold text-sm">
                  v{tool.version || '1.0'}
                </div>
              </div>
            </div>

            {/* Rating & Downloads */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <StarRating rating={tool.rating} />
                <span className="text-sm font-medium text-white">
                  {tool.rating}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[#9CA3AF]">
                <Download className="w-4 h-4" />
                <span className="text-sm">
                  {tool.downloadCount.toLocaleString()} downloads
                </span>
              </div>
              <Badge className="bg-[#00FFB2] text-[#0B0F1A] border-0 font-bold text-xs">
                FREE
              </Badge>
            </div>

            <Separator className="bg-[#1F2937]" />

            {/* Tags */}
            {tagList.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tagList.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 rounded-full bg-[#1F2937] text-[#9CA3AF] border border-[#1F2937] flex items-center gap-1"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Download Button */}
            <Button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full bg-gradient-to-r from-[#00FFB2] to-[#00cc8e] text-[#0B0F1A] font-bold hover:opacity-90 btn-neon h-12 text-base"
            >
              {downloading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#0B0F1A] border-t-transparent rounded-full animate-spin mr-2" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  Download Gratis
                </>
              )}
            </Button>

            {/* Download Message */}
            {downloadMsg && (
              <p className="text-center text-sm text-[#F59E0B]">{downloadMsg}</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Review Dialog */}
      <ReviewDialog
        tool={tool}
        open={showReview}
        onClose={() => setShowReview(false)}
      />
    </>
  );
}
