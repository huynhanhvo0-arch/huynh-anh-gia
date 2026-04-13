import React, { useEffect, useState } from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { storageService } from '../services/storageService';
import { UserProfile } from '../types';

export default function Header() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    setProfile(storageService.getUserProfile());
  }, []);

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4 md:hidden">
        <Button variant="ghost" size="icon">
          <Menu size={24} />
        </Button>
        <span className="font-display font-bold text-xl">EduLink</span>
      </div>

      <div className="hidden md:flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full w-96">
        <Search size={18} className="text-slate-400" />
        <input 
          type="text" 
          placeholder="Tìm kiếm bài học, từ vựng..." 
          className="bg-transparent border-none outline-none text-sm w-full"
        />
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={20} className="text-slate-600" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </Button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-800">{profile?.displayName || 'Người dùng'}</p>
            <p className="text-xs text-slate-500">{profile?.goal} Target {profile?.targetScore}</p>
          </div>
          <Avatar className="w-10 h-10 border-2 border-blue-100">
            <AvatarImage src={profile?.photoURL || "https://picsum.photos/seed/user/200"} />
            <AvatarFallback>{profile?.displayName?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
