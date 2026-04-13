import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Mic, Send, RotateCcw, CheckCircle2, AlertCircle, Sparkles, Loader2, PenTool } from 'lucide-react';
import { gradeWriting, getSpeakingFeedback } from '../services/geminiService';
import { storageService } from '../services/storageService';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

export default function AICoach() {
  const [writingText, setWritingText] = useState('');
  const [writingTask, setWritingTask] = useState('IELTS Writing Task 2: Some people think that it is best to work for the same organization for one\'s whole life. Others think that it is better to change jobs frequently. Discuss both views and give your opinion.');
  const [isGrading, setIsGrading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleGradeWriting = async () => {
    if (!writingText.trim()) return;
    setIsGrading(true);
    try {
      const result = await gradeWriting(writingText, writingTask);
      setFeedback(result || 'Không thể nhận phản hồi từ AI.');
      
      // Save progress to local storage
      storageService.saveProgress('writing-task-1', 8); // Mock score for now
      toast.success('Đã lưu tiến độ học tập!');
    } catch (error) {
      console.error(error);
      setFeedback('Có lỗi xảy ra khi chấm bài. Vui lòng thử lại.');
      toast.error('Lỗi khi lưu tiến độ.');
    } finally {
      setIsGrading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-900 flex items-center gap-3">
            AI Coach <Sparkles className="text-blue-500" />
          </h2>
          <p className="text-slate-500 mt-1">Luyện tập kỹ năng Speaking & Writing với phản hồi tức thì từ AI.</p>
        </div>
      </div>

      <Tabs defaultValue="writing" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mb-8 bg-slate-100 p-1 rounded-2xl h-14">
          <TabsTrigger value="writing" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold">
            Luyện Viết (Writing)
          </TabsTrigger>
          <TabsTrigger value="speaking" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold">
            Luyện Nói (Speaking)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="writing" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Card className="border-slate-200 shadow-sm overflow-hidden">
                <CardHeader className="bg-slate-50 border-b border-slate-100">
                  <CardTitle className="text-lg">Đề bài</CardTitle>
                  <CardDescription className="text-slate-600 leading-relaxed">
                    {writingTask}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500 font-medium">Bài viết của bạn</span>
                      <span className={writingText.split(/\s+/).length > 250 ? "text-green-600 font-bold" : "text-slate-400 font-bold"}>
                        {writingText.trim() ? writingText.trim().split(/\s+/).length : 0} / 250 từ
                      </span>
                    </div>
                    <Textarea 
                      placeholder="Nhập bài viết của bạn tại đây..." 
                      className="min-h-[400px] resize-none border-slate-200 focus:ring-blue-500 focus:border-blue-500 rounded-xl p-4 text-base leading-relaxed"
                      value={writingText}
                      onChange={(e) => setWritingText(e.target.value)}
                    />
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        className="flex-1 py-6 rounded-xl font-bold border-slate-200"
                        onClick={() => setWritingText('')}
                      >
                        <RotateCcw size={18} className="mr-2" /> Làm lại
                      </Button>
                      <Button 
                        className="flex-[2] py-6 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
                        onClick={handleGradeWriting}
                        disabled={isGrading || !writingText.trim()}
                      >
                        {isGrading ? (
                          <><Loader2 size={18} className="mr-2 animate-spin" /> Đang chấm bài...</>
                        ) : (
                          <><Send size={18} className="mr-2" /> Gửi bài chấm</>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <AnimatePresence mode="wait">
                {feedback ? (
                  <motion.div
                    key="feedback"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <Card className="border-blue-100 shadow-xl shadow-blue-50 overflow-hidden">
                      <CardHeader className="bg-blue-50 border-b border-blue-100">
                        <CardTitle className="text-blue-900 flex items-center gap-2">
                          <CheckCircle2 className="text-blue-600" /> Kết quả chấm bài
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="prose prose-slate max-w-none prose-headings:font-display prose-headings:text-blue-900 prose-p:text-slate-700 prose-strong:text-blue-800">
                          <ReactMarkdown>{feedback}</ReactMarkdown>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center p-10 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200"
                  >
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-slate-300 mb-6 shadow-sm">
                      <PenTool size={40} />
                    </div>
                    <h3 className="text-xl font-display font-bold text-slate-800 mb-2">Chưa có kết quả</h3>
                    <p className="text-slate-500 max-w-xs">
                      Hãy hoàn thành bài viết và nhấn "Gửi bài chấm" để nhận phản hồi chi tiết từ AI.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="speaking" className="space-y-6">
          <Card className="border-slate-200 shadow-sm p-12 text-center">
            <div className="max-w-md mx-auto space-y-8">
              <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mx-auto relative">
                <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20"></div>
                <Mic size={48} />
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold text-slate-900 mb-2">Luyện nói với AI</h3>
                <p className="text-slate-500">
                  Nhấn vào nút bên dưới để bắt đầu ghi âm. AI sẽ phân tích phát âm, độ trôi chảy và ngữ pháp của bạn.
                </p>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Chủ đề hiện tại</p>
                <p className="text-lg font-medium text-slate-800 italic">"Describe a place you would like to visit in the future."</p>
              </div>
              <Button className="w-full py-8 rounded-2xl font-bold bg-blue-600 hover:bg-blue-700 text-lg shadow-xl shadow-blue-200">
                Bắt đầu ghi âm
              </Button>
              <p className="text-xs text-slate-400">
                * Tính năng này yêu cầu quyền truy cập Micro.
              </p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
