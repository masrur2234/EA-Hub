'use client';

import { useEffect, useState, useCallback } from 'react';
import { Star, Trash2, RefreshCw } from 'lucide-react';
import type { Review } from '@/lib/store';

const ROLE_COLORS: Record<string, string> = {
  'Trader': '#00FFB2',
  'Scalper': '#3B82F6',
  'Pro Trader': '#F59E0B',
  'Analyst': '#8B5CF6',
  'Beginner': '#EF4444',
  'Investor': '#EC4899',
};

export default function AdminReviewList() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Review | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch('/api/reviews?all=true');
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const toggleApproved = async (review: Review) => {
    const token = localStorage.getItem('admin-token');
    try {
      const res = await fetch(`/api/reviews/${review.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isApproved: !review.isApproved }),
      });
      if (res.ok) {
        setReviews((prev) =>
          prev.map((r) =>
            r.id === review.id ? { ...r, isApproved: !r.isApproved } : r
          )
        );
      }
    } catch {
      // silent fail
    }
  };

  const toggleFeatured = async (review: Review) => {
    const token = localStorage.getItem('admin-token');
    try {
      const res = await fetch(`/api/reviews/${review.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isFeatured: !review.isFeatured }),
      });
      if (res.ok) {
        setReviews((prev) =>
          prev.map((r) =>
            r.id === review.id ? { ...r, isFeatured: !r.isFeatured } : r
          )
        );
      }
    } catch {
      // silent fail
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const token = localStorage.getItem('admin-token');
    try {
      const res = await fetch(`/api/reviews/${deleteTarget.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== deleteTarget.id));
        setDeleteTarget(null);
      }
    } catch {
      // silent fail
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
        <RefreshCw style={{ width: 24, height: 24, color: '#00FFB2', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 600, margin: 0 }}>
          Reviews ({reviews.length})
        </h3>
        <button
          onClick={fetchReviews}
          style={{
            padding: '6px 12px',
            borderRadius: 8,
            border: '1px solid #1F2937',
            backgroundColor: 'transparent',
            color: '#9CA3AF',
            cursor: 'pointer',
            fontSize: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#00FFB2';
            e.currentTarget.style.color = '#00FFB2';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#1F2937';
            e.currentTarget.style.color = '#9CA3AF';
          }}
        >
          <RefreshCw style={{ width: 14, height: 14 }} />
          Refresh
        </button>
      </div>

      {reviews.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#9CA3AF' }}>
          <p style={{ margin: 0 }}>Belum ada review.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {reviews.map((review) => {
            const color = ROLE_COLORS[review.role] || '#00FFB2';
            return (
              <div
                key={review.id}
                style={{
                  backgroundColor: '#0B0F1A',
                  border: '1px solid #1F2937',
                  borderRadius: 12,
                  padding: 16,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 13,
                        fontWeight: 700,
                        backgroundColor: `${color}20`,
                        color: color,
                        flexShrink: 0,
                      }}
                    >
                      {review.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                    <div>
                      <div style={{ color: '#FFFFFF', fontSize: 14, fontWeight: 600 }}>
                        {review.name}
                      </div>
                      <div style={{ color, fontSize: 12 }}>
                        {review.role}
                        {review.toolName && (
                          <span style={{ color: '#9CA3AF', marginLeft: 8 }}>
                            → {review.toolName}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        style={{
                          width: 14,
                          height: 14,
                          fill: i < review.rating ? '#F59E0B' : 'transparent',
                          color: i < review.rating ? '#F59E0B' : '#1F2937',
                        }}
                      />
                    ))}
                  </div>
                </div>

                <p style={{ color: '#9CA3AF', fontSize: 13, margin: '8px 0', lineHeight: 1.5 }}>
                  {review.comment.length > 120 ? review.comment.slice(0, 120) + '...' : review.comment}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {/* Approved toggle */}
                    <button
                      onClick={() => toggleApproved(review)}
                      title={review.isApproved ? 'Unapprove' : 'Approve'}
                      style={{
                        padding: '4px 10px',
                        borderRadius: 6,
                        border: `1px solid ${review.isApproved ? '#00FFB2' : '#1F2937'}`,
                        backgroundColor: review.isApproved ? 'rgba(0,255,178,0.1)' : 'transparent',
                        color: review.isApproved ? '#00FFB2' : '#9CA3AF',
                        cursor: 'pointer',
                        fontSize: 14,
                      }}
                    >
                      {review.isApproved ? '✅' : '❌'}
                      <span style={{ fontSize: 11, marginLeft: 4 }}>Approved</span>
                    </button>

                    {/* Featured toggle */}
                    <button
                      onClick={() => toggleFeatured(review)}
                      title={review.isFeatured ? 'Unfeature' : 'Feature'}
                      style={{
                        padding: '4px 10px',
                        borderRadius: 6,
                        border: `1px solid ${review.isFeatured ? '#F59E0B' : '#1F2937'}`,
                        backgroundColor: review.isFeatured ? 'rgba(245,158,11,0.1)' : 'transparent',
                        color: review.isFeatured ? '#F59E0B' : '#9CA3AF',
                        cursor: 'pointer',
                        fontSize: 14,
                      }}
                    >
                      ⭐
                      <span style={{ fontSize: 11, marginLeft: 4 }}>Featured</span>
                    </button>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#9CA3AF', fontSize: 11 }}>
                      {new Date(review.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    <button
                      onClick={() => setDeleteTarget(review)}
                      title="Delete review"
                      style={{
                        padding: '4px 8px',
                        borderRadius: 6,
                        border: '1px solid transparent',
                        backgroundColor: 'transparent',
                        color: '#9CA3AF',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#EF4444';
                        e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)';
                        e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#9CA3AF';
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.borderColor = 'transparent';
                      }}
                    >
                      <Trash2 style={{ width: 14, height: 14 }} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteTarget && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setDeleteTarget(null);
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10000,
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              backgroundColor: '#111827',
              border: '1px solid #1F2937',
              borderRadius: 16,
              padding: 24,
              maxWidth: 400,
              width: '90%',
            }}
          >
            <h3 style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
              Hapus Review?
            </h3>
            <p style={{ color: '#9CA3AF', fontSize: 14, marginBottom: 20, lineHeight: 1.5 }}>
              Review dari <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{deleteTarget.name}</span> akan dihapus secara permanen. Tindakan ini tidak bisa dibatalkan.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setDeleteTarget(null)}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: 8,
                  border: '1px solid #1F2937',
                  backgroundColor: 'transparent',
                  color: '#9CA3AF',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 500,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#1F2937';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#9CA3AF';
                }}
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: 8,
                  border: 'none',
                  backgroundColor: '#EF4444',
                  color: '#FFFFFF',
                  cursor: deleting ? 'not-allowed' : 'pointer',
                  fontSize: 14,
                  fontWeight: 600,
                  opacity: deleting ? 0.6 : 1,
                }}
              >
                {deleting ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
