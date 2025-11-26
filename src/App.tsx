import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import QuizPage from "@/pages/QuizPage";
import ResultPage from "@/pages/ResultPage";
import AdminPage from "@/pages/AdminPage";
import LeaderboardPage from "@/pages/LeaderboardPage";
import LoginPage from "@/pages/LoginPage";
import { useState, useEffect } from "react";
import { AuthContext, Question, AnswerRecord } from '@/contexts/authContext';
import { generateId } from "@/lib/utils";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // 初始化题目数据，优先从localStorage加载
  const [questions, setQuestions] = useState<Question[]>(() => {
    const savedQuestions = localStorage.getItem('questions');
    if (savedQuestions) {
      try {
        return JSON.parse(savedQuestions);
      } catch (e) {
        console.error('Failed to parse saved questions:', e);
      }
    }
    
    // 默认题目数据
    return [
      {
        id: generateId(),
        type: '单选题',
        content: '“十五五”时期经济社会发展的主题是？',
        answer: 'C',
        options: {
          A: '改革开放',
          B: '共同富裕',
          C: '推动高质量发展',
          D: '生态文明建设'
        },
        explanation: '发展是解决我国一切问题的基础和关键，但新时代的发展必须是高质量发展。《建议》确立了"以推动高质量发展为主题"，意味着经济发展不再单纯追求速度，而是更加注重质的有效提升和量的合理增长。'
      },
      {
        id: generateId(),
        type: '单选题',
        content: '根据规划目标，我国人均国内生产总值预计在哪一年达到中等发达国家水平？',
        answer: 'D',
        options: {
          A: '2025年',
          B: '2027年',
          C: '2030年',
          D: '2035年'
        },
        explanation: '《建议》提出了二〇三五年的远景目标，即在"十五五"基础上再奋斗五年，到2035年实现基本社会主义现代化，其中经济指标明确为"人均国内生产总值达到中等发达国家水平"。'
      },
      {
        id: generateId(),
        type: '单选题',
        content: '中国式现代化的物质技术基础是？',
        answer: 'A',
        options: {
          A: '现代化产业体系',
          B: '高水平科技自立自强',
          C: '强大国内市场',
          D: '绿色发展'
        },
        explanation: '实体经济是一国经济的立身之本。为了避免经济"脱实向虚"，《建议》明确指出"现代化产业体系"是中国式现代化的物质技术基础，强调了制造业和实体经济在国家发展中的核心支撑作用。'
      },
      {
        id: generateId(),
        type: '单选题',
        content: '建设现代化产业体系，必须坚持把发展经济的着力点放在哪里？',
        answer: 'B',
        options: {
          A: '数字经济',
          B: '实体经济',
          C: '金融投资',
          D: '房地产市场'
        },
        explanation: '针对产业发展方向，《建议》强调要坚持把着力点放在"实体经济"上，加快建设制造强国等，防止产业空心化，确保国家经济底盘稳固。'
      },
      {
        id: generateId(),
        type: '单选题',
        content: '在前瞻布局未来产业方面，下列哪项属于《建议》重点提及的领域？',
        answer: 'A',
        options: {
          A: '量子科技',
          B: '传统纺织业',
          C: '煤炭开采',
          D: '房地产开发'
        },
        explanation: '《建议》列举了多个未来产业方向，旨在培育新经济增长点。选项A"量子科技"是明确列出的前沿技术领域。虽然其他技术也很重要，但量子科技、核聚变等代表了未来科技竞争的制高点。'
      }
    ];
  });
  
  // 初始化答题记录，优先从localStorage加载
  const [answerRecords, setAnswerRecords] = useState<AnswerRecord[]>(() => {
    const savedRecords = localStorage.getItem('answerRecords');
    if (savedRecords) {
      try {
        return JSON.parse(savedRecords).map((record: any) => ({
          ...record,
          time: new Date(record.time) // 确保时间对象正确转换
        }));
      } catch (e) {
        console.error('Failed to parse saved records:', e);
      }
    }
    return [];
  });
  
  // 初始化Banner图片，优先从localStorage加载
  const [bannerImage, setBannerImage] = useState<string>(() => {
    return localStorage.getItem('bannerImage') || 'https://lf-code-agent.coze.cn/obj/x-ai-cn/332146068994/attachment/十五五竞赛答题背景_20251125101426.jpg';
  });

  // 组件挂载后，从localStorage加载认证状态
  useEffect(() => {
    const savedAuth = localStorage.getItem('isAuthenticated');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // 当认证状态改变时，保存到localStorage
  useEffect(() => {
    localStorage.setItem('isAuthenticated', String(isAuthenticated));
  }, [isAuthenticated]);

  const logout = () => {
    setIsAuthenticated(false);
  };

  const addAnswerRecord = (record: Omit<AnswerRecord, 'id' | 'time'>) => {
    const newRecord: AnswerRecord = {
      ...record,
      id: generateId(),
      time: new Date()
    };
    setAnswerRecords(prev => {
      const updatedRecords = [...prev, newRecord];
      localStorage.setItem('answerRecords', JSON.stringify(updatedRecords));
      return updatedRecords;
    });
  };

  const removeAnswerRecord = (id: string) => {
    setAnswerRecords(prev => {
      const updatedRecords = prev.filter(record => record.id !== id);
      localStorage.setItem('answerRecords', JSON.stringify(updatedRecords));
      return updatedRecords;
    });
  };

  const updateQuestions = (newQuestions: Question[]) => {
    setQuestions(newQuestions);
    localStorage.setItem('questions', JSON.stringify(newQuestions));
  };

  const updateBannerImage = (imageUrl: string) => {
    setBannerImage(imageUrl);
    localStorage.setItem('bannerImage', imageUrl);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, logout }}
    >
      <Routes>
        <Route 
          path="/" 
          element={<Home bannerImage={bannerImage} />} 
        />
        <Route 
          path="/quiz" 
          element={
            <QuizPage 
              questions={questions} 
              bannerImage={bannerImage}
              onSubmit={addAnswerRecord} 
            />
          } 
        />
        <Route 
          path="/result/:name" 
          element={
            <ResultPage 
              questions={questions} 
              records={answerRecords}
            />
          } 
        />
        <Route 
          path="/login" 
          element={<LoginPage />} 
        />
        <Route 
          path="/admin" 
          element={
            <AdminPage 
              questions={questions} 
              records={answerRecords}
              bannerImage={bannerImage}
              onUpdateQuestions={updateQuestions}
              onRemoveRecord={removeAnswerRecord}
              onUpdateBanner={updateBannerImage}
            />
          } 
        />
        <Route 
          path="/leaderboard" 
          element={<LeaderboardPage records={answerRecords} />} 
        />
      </Routes>
    </AuthContext.Provider>
  );
}
