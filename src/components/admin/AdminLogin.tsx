'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, Lock, User } from 'lucide-react';
import { toast } from 'sonner';
import { useAppStore } from '@/lib/store';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const setAdminLoggedIn = useAppStore((s) => s.setAdminLoggedIn);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      toast.error('Please fill in both fields');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Login failed' }));
        throw new Error(data.error || 'Invalid credentials');
      }

      const data = await res.json();
      if (data.token) {
        localStorage.setItem('admin-token', data.token);
      }

      setAdminLoggedIn(true);
      toast.success('Welcome back, Admin! 🛠️');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div
        className="rounded-2xl p-8 w-full max-w-sm space-y-6"
        style={{
          background: 'rgba(17, 24, 39, 0.8)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 255, 178, 0.15)',
          boxShadow: '0 0 20px rgba(0, 255, 178, 0.05)',
        }}
      >
        {/* Lock Icon */}
        <div className="text-center space-y-3">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
            style={{
              background: 'rgba(0, 255, 178, 0.1)',
              border: '1px solid rgba(0, 255, 178, 0.2)',
              boxShadow: '0 0 15px rgba(0, 255, 178, 0.1)',
            }}
          >
            <Lock className="w-8 h-8 text-[#00FFB2]" />
          </div>
          <h2 className="text-xl font-bold text-white">Admin Login</h2>
          <p className="text-sm text-[#9CA3AF]">
            Masukkan credentials untuk akses admin panel
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="admin-username" className="text-gray-300 text-sm">
              Username
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                id="admin-username"
                type="text"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10 bg-[#0B0F1A] border-[#1F2937] text-white placeholder:text-gray-600 focus:border-[#00FFB2]/50 focus:ring-[#00FFB2]/20"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="admin-password" className="text-gray-300 text-sm">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                id="admin-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 bg-[#0B0F1A] border-[#1F2937] text-white placeholder:text-gray-600 focus:border-[#00FFB2]/50 focus:ring-[#00FFB2]/20"
                disabled={loading}
              />
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full font-semibold h-11 text-sm"
            style={{
              background: 'linear-gradient(135deg, #00FFB2, #00cc8e)',
              color: '#0B0F1A',
              boxShadow: '0 0 15px rgba(0, 255, 178, 0.3)',
            }}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Authenticating...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
