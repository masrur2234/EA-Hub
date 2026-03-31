'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, X, Save, Link, Upload, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useAppStore, type TradingTool } from '@/lib/store';

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
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
      setFileName(editTool.fileName || '');
      setImageUrl(editTool.imageUrl || '');
    }
  }, [editTool]);

  const updateField = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const getToken = () => localStorage.getItem('admin-token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error('Nama tool wajib diisi!');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        fileUrl: fileUrl.trim(),
        fileName: fileName.trim(),
        imageUrl: imageUrl.trim(),
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

      toast.success(isEditing ? 'Tool berhasil diupdate! ✅' : 'Tool berhasil dibuat! 🎉');
      resetForm();
      onSuccess();
      useAppStore.getState().bumpDataVersion();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      toast.error(message);
    } finally {
      setSubmitting(false);
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
    setFileUrl('');
    setFileName('');
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

        {/* Download URL */}
        <div className="space-y-1.5">
          <Label className="text-gray-300 text-sm flex items-center gap-1.5">
            <Link className="w-3.5 h-3.5" />
            Download URL *
          </Label>
          <Input
            placeholder="https://drive.google.com/file/d/... / https://mega.nz/..."
            value={fileUrl}
            onChange={(e) => setFileUrl(e.target.value)}
            style={{ backgroundColor: '#0B0F1A', borderColor: '#1F2937', color: '#fff' }}
          />
          <p className="text-[10px] text-gray-500">
            Paste link Google Drive, Mega, MediaFire, dll. Wajib diisi supaya tombol download bisa dipakai.
          </p>
        </div>

        {/* File Name */}
        <div className="space-y-1.5">
          <Label className="text-gray-300 text-sm flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5" />
            Nama File (opsional)
          </Label>
          <Input
            placeholder="GoldScalperPro.ex4"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            style={{ backgroundColor: '#0B0F1A', borderColor: '#1F2937', color: '#fff' }}
          />
        </div>

        {/* Image URL */}
        <div className="space-y-1.5">
          <Label className="text-gray-300 text-sm flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5" />
            Image URL (opsional)
          </Label>
          <Input
            placeholder="https://example.com/image.png"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            style={{ backgroundColor: '#0B0F1A', borderColor: '#1F2937', color: '#fff' }}
          />
          {imageUrl && (
            <div className="mt-2 flex items-center gap-2">
              <img
