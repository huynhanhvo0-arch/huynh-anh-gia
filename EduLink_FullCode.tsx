/**
 * EDULINK AI - FULL APPLICATION CODE
 * This file contains all the core logic, services, and components.
 * To run this locally, you will need a standard Vite + React + Tailwind setup.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Home, BookOpen, Mic, PenTool, BarChart2, User, Settings, Flame,
  Search, Bell, Menu, TrendingUp, Book, Star, Clock, ChevronRight, 
  Play, Headphones, Filter, Send, RotateCcw, CheckCircle2, 
  AlertCircle, Sparkles, Loader2, Mail, Lock, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast, Toaster } from 'sonner';
import ReactMarkdown from 'react-markdown';

// --- 1. TYPES ---
export type Level = 'Beginner' | 'Intermediate' | 'Advanced';
export type Goal = 'TOEIC' | 'IELTS' | 'General';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  level: Level;
  goal: Goal;
  targetScore: string;
  dailyGoalMinutes: number;
  streak: number;
  lastStudyDate?: string;
  totalLessonsCompleted: number;
  points: number;
}

export interface Progress {
  lessonId: string;
  userId: string;
  completed: boolean;
  score?: number;
  completedAt: string;
}

export interface UserAuth {
  id: string;
  email: string;
  password?: string;
  displayName: string;
}

// --- 2. STORAGE SERVICE ---
const STORAGE_KEYS = {
  USER_PROFILE: 'edulink_user_profile',
  PROGRESS: 'edulink_progress',
  STREAK: 'edulink_streak',
  USERS: 'edulink_registered_users',
  CURRENT_USER_ID: 'edulink_current_user_id',
};

export const storageService = {
  getUsers: (): UserAuth[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.USERS);
    return stored ? JSON.parse(stored) : [];
  },

  register: (user: Omit<UserAuth, 'id'>) => {
    const users = storageService.getUsers();
    if (users.find(u => u.email === user.email)) {
      throw new Error('Email đã tồn tại!');
    }
    const newUser = { ...user, id: Math.random().toString(36).substr(2, 9) };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return newUser;
  },

  login: (email: string, password?: string) => {
    const users = storageService.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Email hoặc mật khẩu không chính xác!');
    }
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, user.id);
    
    const profileKey = `${STORAGE_KEYS.USER_PROFILE}_${user.id}`;
    if (!localStorage.getItem(profileKey)) {
      const newProfile: UserProfile = {
        uid: user.id,
        displayName: user.displayName,
        email: user.email,
        level: 'Beginner',
        goal: 'IELTS',
        targetScore: '6.5',
        dailyGoalMinutes: 30,
        streak: 0,
        totalLessonsCompleted: 0,
        points: 0,
      };
      localStorage.setItem(profileKey, JSON.stringify(newProfile));
    }
    return user;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
  },

  getCurrentUserId: () => localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID),

  getUserProfile: (): UserProfile | null => {
    const userId = storageService.getCurrentUserId();
    if (!userId) return null;
    const profileKey = `${STORAGE_KEYS.USER_PROFILE}_${userId}`;
    const stored = localStorage.getItem(profileKey);
    return stored ? JSON.parse(stored) : null;
  },

  updateUserProfile: (profile: Partial<UserProfile>) => {
    const userId = storageService.getCurrentUserId();
    if (!userId) return null;
    const profileKey = `${STORAGE_KEYS.USER_PROFILE}_${userId}`;
    const current = storageService.getUserProfile();
    if (!current) return null;
    const updated = { ...current, ...profile };
    localStorage.setItem(profileKey, JSON.stringify(updated));
    return updated;
  },

  getProgress: (): Progress[] => {
    const userId = storageService.getCurrentUserId();
    if (!userId) return [];
    const progressKey = `${STORAGE_KEYS.PROGRESS}_${userId}`;
    const stored = localStorage.getItem(progressKey);
    return stored ? JSON.parse(stored) : [];
  },

  saveProgress: (lessonId: string, score?: number) => {
    const userId = storageService.getCurrentUserId();
    if (!userId) return [];
    const progressKey = `${STORAGE_KEYS.PROGRESS}_${userId}`;
    const progress = storageService.getProgress();
    const existingIndex = progress.findIndex(p => p.lessonId === lessonId);
    
    const newEntry: Progress = {
      lessonId, userId, completed: true, score,
      completedAt: new Date().toISOString(),
    };

    if (existingIndex > -1) {
      progress[existingIndex] = newEntry;
    } else {
      progress.push(newEntry);
      const profile = storageService.getUserProfile();
      if (profile) {
        storageService.updateUserProfile({
          totalLessonsCompleted: profile.totalLessonsCompleted + 1,
          points: profile.points + (score ? score * 10 : 50),
        });
      }
    }
    localStorage.setItem(progressKey, JSON.stringify(progress));
    return progress;
  },

  checkStreak: () => {
    const profile = storageService.getUserProfile();
    if (!profile) return 0;
    const today = new Date().toDateString();
    const lastStudy = profile.lastStudyDate ? new Date(profile.lastStudyDate).toDateString() : null;
    if (lastStudy === today) return profile.streak;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();
    if (lastStudy === yesterdayStr) {
      const newStreak = profile.streak + 1;
      storageService.updateUserProfile({ streak: newStreak, lastStudyDate: new Date().toISOString() });
      return newStreak;
    } else {
      storageService.updateUserProfile({ streak: 1, lastStudyDate: new Date().toISOString() });
      return 1;
    }
  }
};

// --- 3. UI COMPONENTS (MOCK SHADCN) ---
const cn = (...inputs: any[]) => inputs.filter(Boolean).join(' ');

const Card = ({ children, className }: any) => <div className={cn("bg-white rounded-xl border border-slate-200", className)}>{children}</div>;
const CardHeader = ({ children, className }: any) => <div className={cn("p-6 pb-4", className)}>{children}</div>;
const CardTitle = ({ children, className }: any) => <h3 className={cn("text-xl font-bold", className)}>{children}</h3>;
const CardDescription = ({ children, className }: any) => <p className={cn("text-sm text-slate-500", className)}>{children}</p>;
const CardContent = ({ children, className }: any) => <div className={cn("p-6 pt-0", className)}>{children}</div>;

const Button = ({ children, className, variant, size, ...props }: any) => {
  const variants: any = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-slate-200 bg-transparent hover:bg-slate-50 text-slate-600",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-600",
  };
  return (
    <button className={cn("inline-flex items-center justify-center rounded-xl px-4 py-2 font-medium transition-colors disabled:opacity-50", variants[variant || 'default'], className)} {...props}>
      {children}
    </button>
  );
};

const Input = ({ className, ...props }: any) => <input className={cn("flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500", className)} {...props} />;
const Textarea = ({ className, ...props }: any) => <textarea className={cn("flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500", className)} {...props} />;

// --- 4. PAGES ---

// AUTH PAGE
const Auth = ({ onLogin }: { onLogin: () => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        storageService.login(email, password);
        toast.success('Đăng nhập thành công!');
      } else {
        if (!displayName) throw new Error('Vui lòng nhập tên hiển thị');
        storageService.register({ email, password, displayName });
        storageService.login(email, password);
        toast.success('Đăng ký thành công!');
      }
      onLogin();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl mx-auto shadow-xl shadow-blue-200">E</div>
          <h1 className="text-3xl font-bold text-slate-900">EduLink AI</h1>
          <p className="text-slate-500">Nâng tầm tiếng Anh cùng trí tuệ nhân tạo</p>
        </div>
        <Card className="border-none shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader>
            <CardTitle>{isLogin ? 'Chào mừng trở lại' : 'Tạo tài khoản mới'}</CardTitle>
            <CardDescription>{isLogin ? 'Nhập thông tin để tiếp tục học tập' : 'Bắt đầu hành trình chinh phục IELTS/TOEIC'}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Tên hiển thị</label>
                  <Input placeholder="Nguyễn Văn A" value={displayName} onChange={(e: any) => setDisplayName(e.target.value)} />
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Email</label>
                <Input type="email" placeholder="name@example.com" value={email} onChange={(e: any) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Mật khẩu</label>
                <Input type="password" placeholder="••••••••" value={password} onChange={(e: any) => setPassword(e.target.value)} />
              </div>
              <Button className="w-full h-12 mt-4">
                {isLogin ? 'Đăng nhập' : 'Đăng ký ngay'} <ArrowRight className="ml-2" size={18} />
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-slate-500">
              {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
              <button onClick={() => setIsLogin(!isLogin)} className="ml-2 text-blue-600 font-bold">{isLogin ? 'Đăng ký' : 'Đăng nhập'}</button>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// DASHBOARD PAGE
const Dashboard = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  useEffect(() => { setProfile(storageService.getUserProfile()); }, []);
  if (!profile) return null;

  const stats = [
    { label: 'Bài đã học', value: profile.totalLessonsCompleted, icon: Book, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Điểm tích lũy', value: profile.points, icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Cấp độ', value: profile.level, icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Chuỗi học tập', value: profile.streak, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Chào buổi sáng, {profile.displayName.split(' ')[0]}! 👋</h2>
        <p className="text-slate-500">Hôm nay là một ngày tuyệt vời để nâng cấp tiếng Anh của bạn.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-none shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", stat.bg, stat.color)}><stat.icon size={24} /></div>
              <div>
                <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// --- 5. MAIN APP ---
export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (storageService.getCurrentUserId()) setIsAuthenticated(true);
  }, []);

  if (!isAuthenticated) return <><Auth onLogin={() => setIsAuthenticated(true)} /><Toaster position="top-center" /></>;

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar Mock */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-screen sticky top-0 p-6">
        <div className="text-2xl font-bold text-blue-600 mb-10">EduLink AI</div>
        <nav className="space-y-2">
          {['dashboard', 'lessons', 'writing', 'speaking', 'profile'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={cn("w-full text-left px-4 py-3 rounded-xl font-medium", activeTab === tab ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100")}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-slate-200 p-4 flex justify-between items-center">
          <div className="font-bold text-slate-800">Dashboard</div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold">User</p>
              <p className="text-xs text-slate-500">IELTS Target 7.5</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full"></div>
          </div>
        </header>
        <main className="p-8">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab !== 'dashboard' && <div className="text-center py-20 text-slate-400 font-bold">Tính năng {activeTab} đang được tải...</div>}
        </main>
      </div>
      <Toaster position="top-center" />
    </div>
  );
}
