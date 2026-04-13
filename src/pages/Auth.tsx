import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { storageService } from '../services/storageService';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { Sparkles, Mail, Lock, User, ArrowRight } from 'lucide-react';

export default function Auth({ onLogin }: { onLogin: () => void }) {
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
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl mx-auto shadow-xl shadow-blue-200">
            E
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-900">EduLink AI</h1>
          <p className="text-slate-500">Nâng tầm tiếng Anh cùng trí tuệ nhân tạo</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-3xl overflow-hidden">
            <CardHeader className="space-y-1 pb-2">
              <CardTitle className="text-2xl font-display font-bold">
                {isLogin ? 'Chào mừng trở lại' : 'Tạo tài khoản mới'}
              </CardTitle>
              <CardDescription>
                {isLogin ? 'Nhập thông tin để tiếp tục học tập' : 'Bắt đầu hành trình chinh phục IELTS/TOEIC'}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Tên hiển thị</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <Input 
                        placeholder="Nguyễn Văn A" 
                        className="pl-10 h-12 rounded-xl border-slate-200 focus:ring-blue-500"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                      />
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <Input 
                      type="email" 
                      placeholder="name@example.com" 
                      className="pl-10 h-12 rounded-xl border-slate-200 focus:ring-blue-500"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Mật khẩu</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      className="pl-10 h-12 rounded-xl border-slate-200 focus:ring-blue-500"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                
                <Button className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-lg font-bold shadow-lg shadow-blue-100 mt-4">
                  {isLogin ? 'Đăng nhập' : 'Đăng ký ngay'} <ArrowRight className="ml-2" size={20} />
                </Button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-slate-500 text-sm">
                  {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
                  <button 
                    onClick={() => setIsLogin(!isLogin)}
                    className="ml-2 text-blue-600 font-bold hover:underline"
                  >
                    {isLogin ? 'Đăng ký' : 'Đăng nhập'}
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="flex items-center justify-center gap-4 text-slate-400 text-xs font-bold uppercase tracking-widest">
          <div className="h-px flex-1 bg-slate-200"></div>
          <span>Học cùng AI</span>
          <div className="h-px flex-1 bg-slate-200"></div>
        </div>
      </div>
    </div>
  );
}
