import React, { useEffect, useState } from 'react';
import { Home, BookOpen, Mic, PenTool, BarChart2, User, Settings, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import { storageService } from '../services/storageService';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const NavItem = ({ icon: Icon, label, active, onClick }: NavItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 w-full text-left",
      active 
        ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
        : "text-slate-600 hover:bg-slate-100"
    )}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

export default function Sidebar({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    setStreak(storageService.checkStreak());
  }, []);

  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Tổng quan' },
    { id: 'lessons', icon: BookOpen, label: 'Bài học' },
    { id: 'speaking', icon: Mic, label: 'Luyện nói AI' },
    { id: 'writing', icon: PenTool, label: 'Luyện viết AI' },
    { id: 'progress', icon: BarChart2, label: 'Tiến độ' },
    { id: 'profile', icon: User, label: 'Cá nhân' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-screen sticky top-0 p-6">
      <div className="flex items-center gap-2 mb-10 px-2">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
          E
        </div>
        <h1 className="text-xl font-display font-bold text-slate-800 tracking-tight">EduLink AI</h1>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={activeTab === item.id}
            onClick={() => setActiveTab(item.id)}
          />
        ))}
      </nav>

      <div className="mt-auto pt-6 border-top border-slate-100">
        <div className="bg-orange-50 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
            <Flame size={20} fill="currentColor" />
          </div>
          <div>
            <p className="text-xs text-orange-600 font-bold uppercase tracking-wider">Chuỗi học tập</p>
            <p className="text-lg font-display font-bold text-orange-900">{streak} Ngày</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
