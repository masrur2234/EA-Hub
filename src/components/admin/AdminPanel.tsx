'use client';

import { useAppStore } from '@/lib/store';
import AdminLogin from './AdminLogin';
import AdminToolList from './AdminToolList';
import AdminBrokerList from './AdminBrokerList';
import AdminReviewList from './AdminReviewList';
import { LogOut, Package, Building2, MessageSquare, X } from 'lucide-react';
import type { AdminTab } from '@/lib/store';

export default function AdminPanel() {
  const isAdminOpen = useAppStore((s) => s.isAdminOpen);
  const setIsAdminOpen = useAppStore((s) => s.setIsAdminOpen);
  const isAdminLoggedIn = useAppStore((s) => s.isAdminLoggedIn);
  const setAdminLoggedIn = useAppStore((s) => s.setAdminLoggedIn);
  const adminTab = useAppStore((s) => s.adminTab);
  const setAdminTab = useAppStore((s) => s.setAdminTab);

  const handleLogout = () => {
    setAdminLoggedIn(false);
    localStorage.removeItem('admin-token');
    setIsAdminOpen(false);
  };

  if (!isAdminOpen) return null;

  const tabs: { key: AdminTab; label: string; icon: typeof Package }[] = [
    { key: 'tools', label: 'EA / Indicator', icon: Package },
    { key: 'brokers', label: 'Broker', icon: Building2 },
    { key: 'reviews', label: 'Reviews', icon: MessageSquare },
  ];

  const renderTabContent = () => {
    switch (adminTab) {
      case 'tools':
        return <AdminToolList />;
      case 'brokers':
        return <AdminBrokerList />;
      case 'reviews':
        return <AdminReviewList />;
      default:
        return <AdminToolList />;
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsAdminOpen(false);
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      {/* Panel */}
      <div
        style={{
          width: '100%',
          maxWidth: '640px',
          height: '100%',
          backgroundColor: '#111827',
          borderLeft: '1px solid #1F2937',
          boxShadow: '-10px 0 40px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'adminSlideIn 0.25s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid #1F2937',
            flexShrink: 0,
          }}
        >
          <h2 style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            🛠️ Admin Panel
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {isAdminLoggedIn && (
              <button
                onClick={handleLogout}
                title="Logout"
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  color: '#9CA3AF',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#EF4444';
                  e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#9CA3AF';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <LogOut style={{ width: 16, height: 16 }} />
              </button>
            )}
            <button
              onClick={() => setIsAdminOpen(false)}
              title="Close"
              style={{
                padding: '8px',
                borderRadius: '8px',
                color: '#9CA3AF',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#FFFFFF';
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#9CA3AF';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <X style={{ width: 16, height: 16 }} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', color: '#FFFFFF' }}>
          {isAdminLoggedIn ? (
            <>
              {/* Tabs */}
              <div style={{ display: 'flex', borderBottom: '1px solid #1F2937', padding: '0 20px' }}>
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const active = adminTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setAdminTab(tab.key)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 16px',
                        fontSize: '14px',
                        fontWeight: 500,
                        color: active ? '#00FFB2' : '#9CA3AF',
                        borderBottom: active ? '2px solid #00FFB2' : '2px solid transparent',
                        backgroundColor: 'transparent',
                        borderLeft: 'none',
                        borderTop: 'none',
                        borderRight: 'none',
                        cursor: 'pointer',
                        transition: 'color 0.2s',
                      }}
                    >
                      <Icon style={{ width: 16, height: 16 }} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              <div style={{ padding: 20 }}>
                {renderTabContent()}
              </div>
            </>
          ) : (
            <div style={{ padding: 24 }}>
              <AdminLogin />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
