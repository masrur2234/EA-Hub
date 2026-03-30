'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Pencil, Trash2, RefreshCw, Loader2, X, Save, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import type { Broker } from '@/lib/store';

const getToken = () => localStorage.getItem('admin-token');

export default function AdminBrokerList() {
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBroker, setEditingBroker] = useState<Broker | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Broker | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchBrokers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/brokers');
      if (!res.ok) throw new Error('Failed to fetch brokers');
      const data = await res.json();
      setBrokers(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load brokers';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrokers();
  }, [fetchBrokers]);

  const handleAddNew = () => {
    setEditingBroker(null);
    setShowForm(true);
  };

  const handleEdit = (broker: Broker) => {
    setEditingBroker(broker);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingBroker(null);
    fetchBrokers();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingBroker(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/brokers/${deleteTarget.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Delete failed' }));
        throw new Error(data.error || 'Failed to delete');
      }
      toast.success(`"${deleteTarget.name}" deleted`);
      setBrokers((prev) => prev.filter((b) => b.id !== deleteTarget.id));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Delete failed';
      toast.error(message);
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  if (showForm) {
    return (
      <BrokerForm
        editBroker={editingBroker}
        onSuccess={handleFormSuccess}
        onCancel={handleFormCancel}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          🏢 Brokers ({brokers.length})
        </h3>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={fetchBrokers}
            disabled={loading}
            className="text-gray-400 hover:text-white hover:bg-white/5"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            onClick={handleAddNew}
            className="bg-[#00FFB2] text-[#0B0F1A] hover:bg-[#00cc8e] font-semibold btn-neon glow-neon text-sm h-9"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Broker
          </Button>
        </div>
      </div>

      {/* Broker List */}
      <div className="max-h-[65vh] overflow-y-auto space-y-2 pr-1">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-[#00FFB2]" />
            <span className="ml-2 text-gray-400 text-sm">Loading brokers...</span>
          </div>
        ) : brokers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-3">
              <Building2Icon className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-gray-400 text-sm">No brokers yet</p>
            <p className="text-gray-600 text-xs mt-1">Click &quot;Add Broker&quot; to add one</p>
          </div>
        ) : (
          brokers.map((broker) => (
            <div
              key={broker.id}
              className="group rounded-xl p-4 bg-white/[0.03] border border-[#1F2937] hover:border-[#00FFB2]/20 transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-white text-sm">{broker.name}</span>
                    {broker.isFeatured && (
                      <Badge className="text-[10px] px-1.5 py-0 h-5 bg-yellow-500/15 text-yellow-400 border-yellow-500/30 border">
                        ⭐ Featured
                      </Badge>
                    )}
                    {broker.affiliateUrl && (
                      <Badge className="text-[10px] px-1.5 py-0 h-5 bg-[#00FFB2]/15 text-[#00FFB2] border-[#00FFB2]/30 border">
                        🔗 Link
                      </Badge>
                    )}
                  </div>
                  {broker.description && (
                    <p className="text-xs text-gray-500 line-clamp-1 mb-1">{broker.description}</p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    {broker.rating > 0 && <span>⭐ {broker.rating}</span>}
                    {broker.bonusInfo && <span className="text-[#00FFB2]">{broker.bonusInfo}</span>}
                    <span>Sort: {broker.sortOrder}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(broker)}
                    className="h-8 w-8 text-gray-400 hover:text-[#00FFB2] hover:bg-[#00FFB2]/10"
                    title="Edit"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteTarget(broker)}
                    className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-red-400/10"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent className="bg-[#111827] border-[#1F2937]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Delete &quot;{deleteTarget?.name}&quot;?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#1F2937] text-gray-300 hover:bg-white/5 hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* ─── Broker Form ─── */

function BrokerForm({
  editBroker,
  onSuccess,
  onCancel,
}: {
  editBroker: Broker | null;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    logoUrl: '',
    affiliateUrl: '',
    rating: 0,
    features: '',
    bonusInfo: '',
    isFeatured: false,
    sortOrder: 0,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editBroker) {
      setForm({
        name: editBroker.name || '',
        description: editBroker.description || '',
        logoUrl: editBroker.logoUrl || '',
        affiliateUrl: editBroker.affiliateUrl || '',
        rating: editBroker.rating || 0,
        features: editBroker.features || '',
        bonusInfo: editBroker.bonusInfo || '',
        isFeatured: editBroker.isFeatured || false,
        sortOrder: editBroker.sortOrder || 0,
      });
    }
  }, [editBroker]);

  const updateField = (field: string, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Broker name is required');
      return;
    }

    setSubmitting(true);
    try {
      const isEditing = !!editBroker?.id;
      const url = isEditing ? `/api/brokers/${editBroker.id}` : '/api/brokers';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Failed to save' }));
        throw new Error(data.error || 'Failed to save broker');
      }

      toast.success(isEditing ? 'Broker updated ✅' : 'Broker added 🎉');
      onSuccess();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const isEdit = !!editBroker?.id;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          {isEdit ? '✏️ Edit Broker' : '➕ Add Broker'}
        </h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="text-gray-400 hover:text-white hover:bg-white/5"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
        {/* Name */}
        <div className="space-y-1.5">
          <Label className="text-gray-300 text-sm">Name *</Label>
          <Input
            placeholder="e.g. Exness"
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
            className="bg-[#0B0F1A] border-[#1F2937] text-white placeholder:text-gray-600 focus:border-[#00FFB2]/50 focus:ring-[#00FFB2]/20"
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <Label className="text-gray-300 text-sm">Description</Label>
          <Textarea
            placeholder="Short description..."
            rows={2}
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
            className="bg-[#0B0F1A] border-[#1F2937] text-white placeholder:text-gray-600 focus:border-[#00FFB2]/50 resize-none"
          />
        </div>

        {/* Affiliate URL */}
        <div className="space-y-1.5">
          <Label className="text-gray-300 text-sm">Affiliate Link</Label>
          <div className="relative">
            <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="https://..."
              value={form.affiliateUrl}
              onChange={(e) => updateField('affiliateUrl', e.target.value)}
              className="pl-10 bg-[#0B0F1A] border-[#1F2937] text-white placeholder:text-gray-600 focus:border-[#00FFB2]/50"
            />
          </div>
        </div>

        {/* Logo URL */}
        <div className="space-y-1.5">
          <Label className="text-gray-300 text-sm">Logo URL</Label>
          <Input
            placeholder="https://... (image URL)"
            value={form.logoUrl}
            onChange={(e) => updateField('logoUrl', e.target.value)}
            className="bg-[#0B0F1A] border-[#1F2937] text-white placeholder:text-gray-600 focus:border-[#00FFB2]/50"
          />
        </div>

        {/* Features */}
        <div className="space-y-1.5">
          <Label className="text-gray-300 text-sm">Features</Label>
          <Textarea
            placeholder="Spread mulai 0.0 pip, MT4/MT5, dll (comma-separated)"
            rows={2}
            value={form.features}
            onChange={(e) => updateField('features', e.target.value)}
            className="bg-[#0B0F1A] border-[#1F2937] text-white placeholder:text-gray-600 focus:border-[#00FFB2]/50 resize-none"
          />
        </div>

        {/* Bonus Info */}
        <div className="space-y-1.5">
          <Label className="text-gray-300 text-sm">Bonus Info</Label>
          <Input
            placeholder="e.g. Bonus 100% Deposit"
            value={form.bonusInfo}
            onChange={(e) => updateField('bonusInfo', e.target.value)}
            className="bg-[#0B0F1A] border-[#1F2937] text-white placeholder:text-gray-600 focus:border-[#00FFB2]/50"
          />
        </div>

        {/* Rating & Sort Order */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-gray-300 text-sm">Rating (0-5)</Label>
            <Input
              type="number"
              min={0}
              max={5}
              step={0.1}
              value={form.rating}
              onChange={(e) => updateField('rating', parseFloat(e.target.value) || 0)}
              className="bg-[#0B0F1A] border-[#1F2937] text-white focus:border-[#00FFB2]/50"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-gray-300 text-sm">Sort Order</Label>
            <Input
              type="number"
              min={0}
              value={form.sortOrder}
              onChange={(e) => updateField('sortOrder', parseInt(e.target.value) || 0)}
              className="bg-[#0B0F1A] border-[#1F2937] text-white focus:border-[#00FFB2]/50"
            />
          </div>
        </div>

        {/* Featured checkbox */}
        <div className="flex items-center gap-2">
          <Checkbox
            id="broker-featured"
            checked={form.isFeatured}
            onCheckedChange={(checked) => updateField('isFeatured', !!checked)}
            className="border-[#1F2937] data-[state=checked]:bg-[#00FFB2] data-[state=checked]:border-[#00FFB2]"
          />
          <Label htmlFor="broker-featured" className="text-gray-300 text-sm cursor-pointer">
            ⭐ Featured Broker
          </Label>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-[#00FFB2] text-[#0B0F1A] hover:bg-[#00cc8e] font-semibold btn-neon glow-neon"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {isEdit ? 'Update Broker' : 'Add Broker'}
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={submitting}
            className="border-[#1F2937] text-gray-300 hover:bg-white/5 hover:text-white"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

function Building2Icon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </svg>
  );
}
