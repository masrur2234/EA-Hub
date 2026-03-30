'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { Plus, Pencil, Trash2, Download, RefreshCw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import EAForm from './EAForm';
import type { TradingTool } from '@/lib/store';

export default function AdminToolList() {
  const [tools, setTools] = useState<TradingTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTool, setEditingTool] = useState<TradingTool | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<TradingTool | null>(null);
  const [deleting, setDeleting] = useState(false);

  const getToken = () => localStorage.getItem('admin-token');

  const fetchTools = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/tools', {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error('Failed to fetch tools');
      const data = await res.json();
      setTools(data.tools || data || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load tools';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTools();
  }, [fetchTools]);

  const handleAddNew = () => {
    setEditingTool(null);
    setShowForm(true);
  };

  const handleEdit = (tool: TradingTool) => {
    setEditingTool(tool);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingTool(null);
    fetchTools();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingTool(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/tools/${deleteTarget.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Delete failed' }));
        throw new Error(data.error || 'Failed to delete');
      }
      toast.success(`"${deleteTarget.name}" deleted successfully`);
      setTools((prev) => prev.filter((t) => t.id !== deleteTarget.id));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Delete failed';
      toast.error(message);
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const getTypeBadgeColor = (type: string) => {
    if (type === 'EA') return 'bg-neon/15 text-neon border-neon/30';
    return 'bg-trading-blue/15 text-trading-blue border-trading-blue/30';
  };

  if (showForm) {
    return (
      <EAForm
        editTool={editingTool}
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
          📦 Tools ({tools.length})
        </h3>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={fetchTools}
            disabled={loading}
            className="text-gray-400 hover:text-white hover:bg-dark-hover"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            onClick={handleAddNew}
            className="bg-neon text-dark-bg hover:bg-neon-dim font-semibold btn-neon glow-neon text-sm h-9"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Tool
          </Button>
        </div>
      </div>

      {/* Tool List */}
      <div className="max-h-[65vh] overflow-y-auto space-y-2 pr-1">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-neon" />
            <span className="ml-2 text-gray-400 text-sm">Loading tools...</span>
          </div>
        ) : tools.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-dark-hover flex items-center justify-center mb-3">
              <PackageIcon className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-gray-400 text-sm">No tools yet</p>
            <p className="text-gray-600 text-xs mt-1">Click &quot;Add Tool&quot; to create your first tool</p>
          </div>
        ) : (
          tools.map((tool) => (
            <div
              key={tool.id}
              className="group glass rounded-xl p-4 hover:border-neon/20 transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span className="font-semibold text-white text-sm truncate">
                      {tool.name}
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] px-1.5 py-0 h-5 ${getTypeBadgeColor(tool.type)}`}
                    >
                      {tool.type}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1.5 py-0 h-5 bg-dark-hover text-gray-400 border-dark-border"
                    >
                      {tool.category}
                    </Badge>
                    {tool.isHot && (
                      <Badge className="text-[10px] px-1.5 py-0 h-5 bg-trading-red/15 text-trading-red border-trading-red/30">
                        🔥 Hot
                      </Badge>
                    )}
                    {tool.isFeatured && (
                      <Badge className="text-[10px] px-1.5 py-0 h-5 bg-yellow-500/15 text-yellow-400 border-yellow-500/30">
                        ⭐ Featured
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <span className="text-gray-600">Platform:</span> {tool.platform}
                    </span>
                    <span className="flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      {tool.downloadCount}
                    </span>
                    <span>v{tool.version}</span>
                    {tool.author && (
                      <span className="text-gray-600">by {tool.author}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(tool)}
                    className="h-8 w-8 text-gray-400 hover:text-neon hover:bg-neon/10"
                    title="Edit"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteTarget(tool)}
                    className="h-8 w-8 text-gray-400 hover:text-trading-red hover:bg-trading-red/10"
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent className="bg-dark-card border-dark-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Delete &quot;{deleteTarget?.name}&quot;?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This action cannot be undone. This will permanently delete the tool and remove its data
              from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-dark-border text-gray-300 hover:bg-dark-hover hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-trading-red text-white hover:bg-red-600"
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

function PackageIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16.5 9.4 7.55 4.24" />
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.29 7 12 12 20.71 7" />
      <line x1="12" x2="12" y1="22" y2="12" />
    </svg>
  );
}
