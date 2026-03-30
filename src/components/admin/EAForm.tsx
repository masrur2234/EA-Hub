'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Upload, X, Save } from 'lucide-react';
import { toast } from 'sonner';
import type { TradingTool } from '@/lib/store';

interface EAFormProps {
  editTool?: TradingTool | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function EAForm({ editTool, onSuccess, onCancel }: EAFormProps) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    type: 'ea',
    category: 'scalping',
    platform: 'mt4',
    version: '1.0',
    author: '',
    tags: '',
    isFeatured: false,
    isHot: false,
  });
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (editTool) {
      setForm({
        name: editTool.name || '',
        description: editTool.description || '',
        type: editTool.type || 'ea',
        category: editTool.category || 'scalping',
        platform: editTool.platform || 'mt4',
        version: editTool.version || '1.0',
        author: editTool.author || '',
        tags: editTool.tags || '',
        isFeatured: editTool.isFeatured || false,
        isHot: editTool.isHot || false,
      });
      setFileUrl(editTool.fileUrl || '');
      setImageUrl(editTool.imageUrl || '');
    }
  }, [editTool]);

  const updateField = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const getToken = () => localStorage.getItem('admin-token');

  const uploadFile = async (fileToUpload: File, fieldName: string): Promise<string> => {
    const formData = new FormData();
    formData.append(fieldName, fileToUpload);

    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData,
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(data.error || 'Upload failed');
    }

    const data = await res.json();
    return data.fileUrl || '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error('Tool name is required');
      return;
    }

    setSubmitting(true);
    try {
      // Upload file if selected
      let finalFileUrl = fileUrl;
      if (file) {
        setUploading(true);
        finalFileUrl = await uploadFile(file, 'file');
        setFileUrl(finalFileUrl);
        setUploading(false);
      }

      // Upload image if selected
      let finalImageUrl = imageUrl;
      if (image) {
        setUploading(true);
        finalImageUrl = await uploadFile(image, 'image');
        setImageUrl(finalImageUrl);
        setUploading(false);
      }

      const payload = {
        ...form,
        fileUrl: finalFileUrl,
        fileName: file?.name || editTool?.fileName || '',
        imageUrl: finalImageUrl,
      };

      const isEditing = !!editTool?.id;
      const url = isEditing ? `/api/tools/${editTool.id}` : '/api/tools';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Failed to save tool' }));
        throw new Error(data.error || 'Failed to save tool');
      }

      toast.success(isEditing ? 'Tool updated successfully! ✅' : 'Tool created successfully! 🎉');
      resetForm();
      onSuccess();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      toast.error(message);
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      type: 'ea',
      category: 'scalping',
      platform: 'mt4',
      version: '1.0',
      author: '',
      tags: '',
      isFeatured: false,
      isHot: false,
    });
    setFile(null);
    setImage(null);
    setFileUrl('');
    setImageUrl('');
  };

  const handleCancel = () => {
    resetForm();
    onCancel();
  };

  const isEdit = !!editTool?.id;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          {isEdit ? '✏️ Edit Tool' : '➕ Add New Tool'}
        </h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCancel}
          className="text-gray-400 hover:text-white hover:bg-dark-hover"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
        {/* Name */}
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-gray-300 text-sm">
            Name *
          </Label>
          <Input
            id="name"
            placeholder="e.g. Gold Scalper Pro"
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
            className="bg-dark-bg border-dark-border text-white placeholder:text-gray-600 focus:border-neon focus:ring-neon/20"
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <Label htmlFor="description" className="text-gray-300 text-sm">
            Description
          </Label>
          <Textarea
            id="description"
            placeholder="Describe the tool..."
            rows={3}
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
            className="bg-dark-bg border-dark-border text-white placeholder:text-gray-600 focus:border-neon focus:ring-neon/20 resize-none"
          />
        </div>

        {/* Type & Category Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-gray-300 text-sm">Type</Label>
            <Select
              value={form.type}
              onValueChange={(v) => updateField('type', v)}
            >
              <SelectTrigger className="bg-dark-bg border-dark-border text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-dark-card border-dark-border">
                <SelectItem value="ea">EA (Expert Advisor)</SelectItem>
                <SelectItem value="indicator">Indicator</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-gray-300 text-sm">Category</Label>
            <Select
              value={form.category}
              onValueChange={(v) => updateField('category', v)}
            >
              <SelectTrigger className="bg-dark-bg border-dark-border text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-dark-card border-dark-border">
                <SelectItem value="scalping">Scalping</SelectItem>
                <SelectItem value="auto-trading">Auto Trading</SelectItem>
                <SelectItem value="indicator">Indicator</SelectItem>
                <SelectItem value="tools">Tools</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Platform */}
        <div className="space-y-1.5">
          <Label className="text-gray-300 text-sm">Platform</Label>
          <Select
            value={form.platform}
            onValueChange={(v) => updateField('platform', v)}
          >
            <SelectTrigger className="bg-dark-bg border-dark-border text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-dark-card border-dark-border">
              <SelectItem value="mt4">MT4</SelectItem>
              <SelectItem value="mt5">MT5</SelectItem>
              <SelectItem value="both">Both</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Version & Author Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="version" className="text-gray-300 text-sm">
              Version
            </Label>
            <Input
              id="version"
              placeholder="1.0"
              value={form.version}
              onChange={(e) => updateField('version', e.target.value)}
              className="bg-dark-bg border-dark-border text-white placeholder:text-gray-600 focus:border-neon focus:ring-neon/20"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="author" className="text-gray-300 text-sm">
              Author
            </Label>
            <Input
              id="author"
              placeholder="Author name"
              value={form.author}
              onChange={(e) => updateField('author', e.target.value)}
              className="bg-dark-bg border-dark-border text-white placeholder:text-gray-600 focus:border-neon focus:ring-neon/20"
            />
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-1.5">
          <Label htmlFor="tags" className="text-gray-300 text-sm">
            Tags
          </Label>
          <Input
            id="tags"
            placeholder="gold, scalping, trend (comma-separated)"
            value={form.tags}
            onChange={(e) => updateField('tags', e.target.value)}
            className="bg-dark-bg border-dark-border text-white placeholder:text-gray-600 focus:border-neon focus:ring-neon/20"
          />
        </div>

        {/* File Upload */}
        <div className="space-y-1.5">
          <Label className="text-gray-300 text-sm">File (.ex4, .ex5, .mq4, .mq5)</Label>
          <div className="relative">
            <Input
              type="file"
              accept=".ex4,.ex5,.mq4,.mq5"
              onChange={(e) => {
                const f = e.target.files?.[0] || null;
                setFile(f);
                if (f) toast.info(`Selected: ${f.name}`);
              }}
              className="bg-dark-bg border-dark-border text-gray-400 file:text-neon file:bg-neon/10 file:border-0 file:rounded file:mr-3 file:px-3 file:py-1 file:text-xs file:font-medium"
            />
          </div>
          {fileUrl && (
            <p className="text-xs text-neon/70 truncate">📎 {fileUrl}</p>
          )}
        </div>

        {/* Image Upload */}
        <div className="space-y-1.5">
          <Label className="text-gray-300 text-sm">Image (.png, .jpg, .jpeg, .webp)</Label>
          <div className="relative">
            <Input
              type="file"
              accept=".png,.jpg,.jpeg,.webp"
              onChange={(e) => {
                const f = e.target.files?.[0] || null;
                setImage(f);
                if (f) toast.info(`Image: ${f.name}`);
              }}
              className="bg-dark-bg border-dark-border text-gray-400 file:text-neon file:bg-neon/10 file:border-0 file:rounded file:mr-3 file:px-3 file:py-1 file:text-xs file:font-medium"
            />
          </div>
          {imageUrl && (
            <div className="mt-2 flex items-center gap-2">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-12 h-12 rounded-lg object-cover border border-dark-border"
              />
              <p className="text-xs text-neon/70 truncate">🖼️ Image set</p>
            </div>
          )}
        </div>

        {/* Checkboxes */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Checkbox
              id="isFeatured"
              checked={form.isFeatured}
              onCheckedChange={(checked) => updateField('isFeatured', !!checked)}
              className="border-dark-border data-[state=checked]:bg-neon data-[state=checked]:border-neon"
            />
            <Label htmlFor="isFeatured" className="text-gray-300 text-sm cursor-pointer">
              ⭐ Featured
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="isHot"
              checked={form.isHot}
              onCheckedChange={(checked) => updateField('isHot', !!checked)}
              className="border-dark-border data-[state=checked]:bg-trading-red data-[state=checked]:border-trading-red"
            />
            <Label htmlFor="isHot" className="text-gray-300 text-sm cursor-pointer">
              🔥 Hot
            </Label>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            type="submit"
            disabled={submitting || uploading}
            className="flex-1 bg-neon text-dark-bg hover:bg-neon-dim font-semibold btn-neon glow-neon"
          >
            {(submitting || uploading) ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {uploading ? 'Uploading...' : 'Saving...'}
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {isEdit ? 'Update Tool' : 'Create Tool'}
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={submitting}
            className="border-dark-border text-gray-300 hover:bg-dark-hover hover:text-white"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
