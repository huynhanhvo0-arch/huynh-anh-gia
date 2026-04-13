import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Headphones, PenTool, Mic, Search, Filter, Play } from 'lucide-react';

export default function Lessons() {
  const categories = [
    { name: 'Tất cả', icon: BookOpen },
    { name: 'Nghe', icon: Headphones },
    { name: 'Nói', icon: Mic },
    { name: 'Đọc', icon: BookOpen },
    { name: 'Viết', icon: PenTool },
  ];

  const lessons = [
    { id: 1, title: 'IELTS Listening: Multiple Choice Questions', category: 'Listening', level: 'Intermediate', duration: '20m', image: 'https://picsum.photos/seed/listen/400/250' },
    { id: 2, title: 'TOEIC Part 5: Incomplete Sentences', category: 'Reading', level: 'Beginner', duration: '15m', image: 'https://picsum.photos/seed/read/400/250' },
    { id: 3, title: 'IELTS Speaking Part 2: Cue Card Strategy', category: 'Speaking', level: 'Advanced', duration: '30m', image: 'https://picsum.photos/seed/speak/400/250' },
    { id: 4, title: 'Academic Vocabulary: Education & Work', category: 'Vocabulary', level: 'Intermediate', duration: '25m', image: 'https://picsum.photos/seed/vocab/400/250' },
    { id: 5, title: 'Grammar: Present Perfect vs Past Simple', category: 'Grammar', level: 'Beginner', duration: '20m', image: 'https://picsum.photos/seed/grammar/400/250' },
    { id: 6, title: 'IELTS Writing: Task 2 Introduction', category: 'Writing', level: 'Advanced', duration: '35m', image: 'https://picsum.photos/seed/write/400/250' },
  ];

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-900">Thư viện bài học</h2>
          <p className="text-slate-500 mt-1">Khám phá hàng trăm bài học được thiết kế riêng cho mục tiêu của bạn.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-xl border-slate-200">
            <Filter size={18} className="mr-2" /> Bộ lọc
          </Button>
          <div className="relative flex-1 md:w-64">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Tìm bài học..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <Button 
            key={cat.name} 
            variant={cat.name === 'Tất cả' ? 'default' : 'outline'}
            className={cn(
              "rounded-full px-6 py-5 font-bold whitespace-nowrap",
              cat.name === 'Tất cả' ? "bg-blue-600 shadow-lg shadow-blue-100" : "border-slate-200 text-slate-600 hover:bg-slate-50"
            )}
          >
            <cat.icon size={18} className="mr-2" /> {cat.name}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map((lesson) => (
          <Card key={lesson.id} className="group border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 rounded-2xl">
            <div className="aspect-video relative overflow-hidden">
              <img 
                src={lesson.image} 
                alt={lesson.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 duration-300">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-lg">
                  <Play size={24} fill="currentColor" />
                </div>
              </div>
              <Badge className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-slate-900 border-none font-bold">
                {lesson.category}
              </Badge>
            </div>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">{lesson.level}</span>
                <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                  <BookOpen size={12} /> {lesson.duration}
                </span>
              </div>
              <h4 className="text-lg font-bold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors">
                {lesson.title}
              </h4>
              <Button className="w-full mt-6 bg-slate-50 hover:bg-blue-600 text-slate-600 hover:text-white border-none font-bold py-5 rounded-xl transition-all">
                Học ngay
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
