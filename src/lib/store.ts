import { create } from 'zustand';

export type Category = 'all' | 'scalping' | 'auto-trading' | 'indicator' | 'tools';
export type FilterType = 'all' | 'ea' | 'indicator';
export type Platform = 'all' | 'mt4' | 'mt5' | 'both';
export type AdminTab = 'tools' | 'brokers' | 'reviews';

export interface TradingTool {
  id: string;
  name: string;
  description: string;
  category: string;
  type: string;
  platform: string;
  tags: string;
  fileUrl: string;
  fileName: string;
  imageUrl: string;
  version: string;
  author: string;
  rating: number;
  downloadCount: number;
  isFeatured: boolean;
  isHot: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Broker {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  affiliateUrl: string;
  rating: number;
  features: string;
  bonusInfo: string;
  isFeatured: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  toolId: string;
  toolName: string;
  name: string;
  role: string;
  comment: string;
  rating: number;
  isApproved: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AppState {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeCategory: Category;
  setActiveCategory: (c: Category) => void;
  filterType: FilterType;
  setFilterType: (t: FilterType) => void;
  filterPlatform: Platform;
  setFilterPlatform: (p: Platform) => void;

  isAdminLoggedIn: boolean;
  setAdminLoggedIn: (v: boolean) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (v: boolean) => void;
  adminTab: AdminTab;
  setAdminTab: (t: AdminTab) => void;

  selectedTool: TradingTool | null;
  setSelectedTool: (tool: TradingTool | null) => void;

  dataVersion: number;
  bumpDataVersion: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),
  activeCategory: 'all',
  setActiveCategory: (c) => set({ activeCategory: c }),
  filterType: 'all',
  setFilterType: (t) => set({ filterType: t }),
  filterPlatform: 'all',
  setFilterPlatform: (p) => set({ filterPlatform: p }),
  isAdminLoggedIn: false,
  setAdminLoggedIn: (v) => set({ isAdminLoggedIn: v }),
  isAdminOpen: false,
  setIsAdminOpen: (v) => set({ isAdminOpen: v }),
  adminTab: 'tools',
  setAdminTab: (t) => set({ adminTab: t }),
  selectedTool: null,
  setSelectedTool: (tool) => set({ selectedTool: tool }),
  dataVersion: 0,
  bumpDataVersion: () => set((s) => ({ dataVersion: s.dataVersion + 1 })),
}));
