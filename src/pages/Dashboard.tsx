import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Book, Star, Clock, ChevronRight, Play } from 'lucide-react';
import { motion } from 'motion/react';
import { storageService } from '../services/storageService';
import { UserProfile } from '../types';

export default function Dashboard() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    setProfile(storageService.getUserProfile());
  }, []);

  if (!profile) return null;

  const stats = [
    { label: 'Bài đã học', value: profile.totalLessonsCompleted.toString(), icon: Book, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Điểm tích lũy', value: profile.points.toString(), icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Cấp độ', value: profile.level, icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Chuỗi học tập', value: profile.streak.toString(), icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  const currentLessons = [
    { id: 1, title: 'IELTS Writing Task 1: Line Graph', type: 'Writing', progress: 45, level: 'Intermediate' },
    { id: 2, title: 'TOEIC Listening Part 3: Conversations', type: 'Listening', progress: 80, level: 'Advanced' },
    { id: 3, title: 'Common Phrasal Verbs in Business', type: 'Vocabulary', progress: 20, level: 'Beginner' },
  ];

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h2 className="text-3xl font-display font-bold text-slate-900">Chào buổi sáng, {profile.displayName.split(' ')[0]}! 👋</h2>
        <p className="text-slate-500 mt-1">Hôm nay là một ngày tuyệt vời để nâng cấp tiếng Anh của bạn.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", stat.bg, stat.color)}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                  <p className="text-2xl font-display font-bold text-slate-900">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-display font-bold text-slate-800">Đang học dở</h3>
            <Button variant="ghost" className="text-blue-600 hover:text-blue-700 font-bold">
              Xem tất cả <ChevronRight size={16} />
            </Button>
          </div>

          <div className="space-y-4">
            {currentLessons.map((lesson) => (
              <Card key={lesson.id} className="group overflow-hidden border-slate-200 hover:border-blue-200 transition-all">
                <CardContent className="p-0 flex items-stretch">
                  <div className="w-24 bg-slate-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                      <Play size={20} fill="currentColor" />
                    </div>
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-none">
                        {lesson.type}
                      </Badge>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{lesson.level}</span>
                    </div>
                    <h4 className="text-lg font-bold text-slate-800 mb-4">{lesson.title}</h4>
                    <div className="flex items-center gap-4">
                      <Progress value={lesson.progress} className="h-2 flex-1" />
                      <span className="text-sm font-bold text-slate-600">{lesson.progress}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-display font-bold text-slate-800">Lộ trình hôm nay</h3>
          <Card className="bg-blue-600 text-white border-none shadow-xl shadow-blue-200 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <TrendingUp size={120} />
            </div>
            <CardContent className="p-8 relative z-10">
              <p className="text-blue-100 font-bold uppercase tracking-widest text-xs mb-2">Mục tiêu ngày</p>
              <h4 className="text-2xl font-display font-bold mb-6">Hoàn thành 3 bài học mới</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center border border-blue-400">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">Ngữ pháp: Câu điều kiện loại 2</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500/50 flex items-center justify-center border border-blue-400/50"></div>
                  <span className="text-sm font-medium opacity-70">Từ vựng: Chủ đề Môi trường</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500/50 flex items-center justify-center border border-blue-400/50"></div>
                  <span className="text-sm font-medium opacity-70">Luyện nghe: IELTS Section 1</span>
                </div>
              </div>
              <Button className="w-full mt-8 bg-white text-blue-600 hover:bg-blue-50 font-bold py-6 rounded-xl">
                Bắt đầu ngay
              </Button>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg">Phân tích kỹ năng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-slate-600">Listening</span>
                  <span className="font-bold">85%</span>
                </div>
                <Progress value={85} className="h-1.5 bg-slate-100" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-slate-600">Reading</span>
                  <span className="font-bold">70%</span>
                </div>
                <Progress value={70} className="h-1.5 bg-slate-100" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-slate-600">Speaking</span>
                  <span className="font-bold">45%</span>
                </div>
                <Progress value={45} className="h-1.5 bg-slate-100" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-slate-600">Writing</span>
                  <span className="font-bold">55%</span>
                </div>
                <Progress value={55} className="h-1.5 bg-slate-100" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Helper for class merging
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
