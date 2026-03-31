'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, X, Save } from 'lucide-react';
import { toast } from 'sonner';
import type { TradingTool } from '@/lib/store';

interface EAFormProps {
  editTool?: TradingTool | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const selectStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: '#0B0F1A',
  border: '1px solid #1F2937',
  borderRadius: '8px',
  color: '#fff',
  padding: '8px 12px',
  fontSize: '14px',
  outline: 'none',
  appearance: 'auto',
};

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
      let finalFileUrl = fileUrl;
      if (file) {
        setUploading(true);
        finalFileUrl = await uploadFile(file, 'file');
        setFileUrl(finalFileUrl);
        setUploading(false);
      }

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
          className="text-gray-400 hover:text-white hover:bg-gray-800"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
        {/* Name */}
        <div className="space-y-1.5">
          <Label className="text-gray-300 text-sm">Name *</Label>
          <Input
            placeholder="e.g. Gold Scalper Pro"
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
            style={{ backgroundColor: '#0B0F1A', borderColor: '#1F2937', color: '#fff' }}
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <Label className="text-gray-300 text-sm">Description</Label>
          <Textarea
            placeholder="Describe the tool..."
            rows={3}
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
            style={{ backgroundColor: '#0B0F1A', borderColor: '#1F2937', color: '#fff', resize: 'none' }}
          />
        </div>

        {/* Type & Category Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-gray-300 text-sm">Type</Label>
            <select
              value={form.type}
              onChange={(e) => updateField('type', e.target.value)}
              style={selectStyle}
            >
              <option value="ea">EA (Expert Advisor)</option>
              <option value="indicator">Indicator</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-gray-300 text-sm">Category</Label>
            <select
              value={form.category}
              onChange={(e) => updateField('category', e.target.value)}
              style={selectStyle}
            >
              <option value="scalping">Scalping</option>
              <option value="auto-trading">Auto Trading</option>
              <option value="indicator">Indicator</option>
              <option value="tools">Tools</option>
            </select>
          </div>
        </div>

        {/* Platform */}
        <div className="space-y-1.5">
          <Label className="text-gray-300 text-sm">Platform</Label>
          <select
            value={form.platform}
            onChange={(e) => updateField('platform', e.target.value)}
            style={selectStyle}
          >
            <option value="mt4">MT4</option>
            <option value="mt5">MT5</option>
            <option value="both">Both MT4 & MT5</option>
          </select>
        </div>

        {/* Version & Author Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-gray-300 text-sm">Version</Label>
            <Input
              placeholder="1.0"
              value={form.version}
              onChange={(e) => updateField('version', e.target.value)}
              style={{ backgroundColor: '#0B0F1A', borderColor: '#1F2937', color: '#fff' }}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-gray-300 text-sm">Author</Label>
            <Input
              placeholder="Author name"
              value={form.author}
              onChange={(e) => updateField('author', e.target.value)}
              style={{ backgroundColor: '#0B0F1A', borderColor: '#1F2937', color: '#fff' }}
            />
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-1.5">
          <Label className="text-gray-300 text-sm">Tags</Label>
          <Input
            placeholder="gold, scalping, trend (comma-separated)"
            value={form.tags}
            onChange={(e) => updateField('tags', e.target.value)}
            style={{ backgroundColor: '#0B0F1A', borderColor: '#1F2937', color: '#fff' }}
          />
        </div>

        {/* File Upload */}
        <div className="space-y-1.5">
          <Label className="text-gray-300 text-sm">File (.ex4, .ex5, .mq4, .mq5)</Label>
          <input
            type="file"
            accept=".ex4,.ex5,.mq4,.mq5"
            onChange={(e) => {
              const f = e.target.files?.[0] || null;
              setFile(f);
              if (f) toast.info(`Selected: ${f.name}`);
            }}
            style={{ color: '#9CA3AF' }}
          />
          {fileUrl && (
            <p className="text-xs text-[#00FFB2]/70 truncate">📎 File set</p>
          )}
        </div>

        {/* Image Upload */}
        <div className="space-y-1.5">
          <Label className="text-gray-300 text-sm">Image (.png, .jpg, .jpeg, .webp)</Label>
          <input
            type="file"
            accept=".png,.jpg,.jpeg,.webp"
            onChange={(e) => {
              const f = e.target.files?.[0] || null;
              setImage(f);
              if (f) toast.info(`Image: ${f.name}`);
            }}
            style={{ color: '#9CA3AF' }}
          />
          {imageUrl && (
            <div className="mt-2 flex items-center gap-2">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-12 h-12 rounded-lg object-cover"
                style={{ border: '1px solid #1F2937' }}
              />
              <p className="text-xs text-[#00FFB2]/70">🖼️ Image set</p>
            </div>
          )}
        </div>

        {/* Featured & Hot */}
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) => updateField('isFeatured', e.target.checked)}
              className="w-4 h-4 accent-[#00FFB2]"
            />
            <span className="text-gray-300 text-sm">⭐ Featured</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isHot}
              onChange={(e) => updateField('isHot', e.target.checked)}
              className="w-4 h-4 accent-[#EF4444]"
            />
            <span className="text-gray-300 text-sm">🔥 Hot</span>
          </label>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            type="submit"
            disabled={submitting || uploading}
            className="flex-1 font-semibold"
            style={{ backgroundColor: '#00FFB2', color: '#0B0F1A' }}
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
            style={{ borderColor: '#1F2937', color: '#9CA3AF' }}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
