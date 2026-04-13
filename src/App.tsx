import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Lessons from './pages/Lessons';
import AICoach from './pages/AICoach';
import Auth from './pages/Auth';
import { Toaster } from 'sonner';
import { storageService } from './services/storageService';
import { Button } from '@/components/ui/button';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const userId = storageService.getCurrentUserId();
    if (userId) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    storageService.logout();
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <>
        <Auth onLogin={handleLogin} />
        <Toaster position="top-center" />
      </>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'lessons':
        return <Lessons />;
      case 'speaking':
      case 'writing':
        return <AICoach />;
      case 'progress':
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
            </div>
            <h3 className="text-xl font-display font-bold text-slate-800">Tính năng đang phát triển</h3>
            <p className="text-slate-500 max-w-xs">Trang thống kê tiến độ chi tiết sẽ sớm ra mắt trong phiên bản tiếp theo.</p>
          </div>
        );
      case 'profile':
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <h3 className="text-xl font-display font-bold text-slate-800">Trang cá nhân</h3>
            <p className="text-slate-500 max-w-xs">Bạn có thể cập nhật thông tin và mục tiêu học tập tại đây.</p>
            <Button variant="outline" onClick={handleLogout} className="mt-4 border-red-200 text-red-600 hover:bg-red-50">
              Đăng xuất
            </Button>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>

        {/* Mobile Navigation */}
        <nav className="md:hidden bg-white border-t border-slate-200 fixed bottom-0 left-0 right-0 px-6 py-3 flex justify-between items-center z-20">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'dashboard' ? 'text-blue-600' : 'text-slate-400'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <span className="text-[10px] font-bold uppercase">Home</span>
          </button>
          <button 
            onClick={() => setActiveTab('lessons')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'lessons' ? 'text-blue-600' : 'text-slate-400'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/><path d="M8 6h10"/></svg>
            <span className="text-[10px] font-bold uppercase">Learn</span>
          </button>
          <button 
            onClick={() => setActiveTab('writing')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'writing' || activeTab === 'speaking' ? 'text-blue-600' : 'text-slate-400'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10H12V2z"/><path d="M12 12L2.1 12"/><path d="M12 12l9.9 0"/><path d="M12 12l0 9.9"/><path d="M12 12l-7-7"/><path d="M12 12l7 7"/></svg>
            <span className="text-[10px] font-bold uppercase">AI Coach</span>
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'profile' ? 'text-blue-600' : 'text-slate-400'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span className="text-[10px] font-bold uppercase">Profile</span>
          </button>
        </nav>
      </div>
      <Toaster position="top-center" />
    </div>
  );
}
