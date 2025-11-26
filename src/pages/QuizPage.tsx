import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { calculateScore, getRandomQuestions } from '@/lib/utils';
import { Question } from '@/contexts/authContext';

interface QuizPageProps {
  questions: Question[];
  bannerImage: string;
  onSubmit: (record: { name: string; answers: Record<string, string>; score: number }) => void;
}

export default function QuizPage({ questions, bannerImage, onSubmit }: QuizPageProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [name, setName] = useState('');
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [pointsPerQuestion, setPointsPerQuestion] = useState<number>(0);

  // 从URL参数获取用户信息
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const userName = searchParams.get('name');
    
    if (userName) {
      setName(userName);
    } else {
      navigate('/');
    }
  }, [location.search, navigate]);

  // 初始化题目集和每题分数，当questions变化时重新初始化
  useEffect(() => {
    // 根据题目数量决定使用全部题目还是随机选取10道题
    const selectedQuestions = questions.length > 10 
      ? getRandomQuestions(questions, 10)
      : [...questions];
    
    setQuizQuestions(selectedQuestions);
    
    // 计算每题分数
    const points = questions.length < 10 
      ? 100 / questions.length 
      : 10; // 题目大于10个时，每题10分
    
    setPointsPerQuestion(Math.round(points * 100) / 100);
    
    // 重置当前题目索引和答案
    setCurrentQuestionIndex(0);
    setAnswers({});
  }, [questions]);

  const currentQuestion = quizQuestions[currentQuestionIndex];
  
  // 如果没有题目，返回首页
  if (quizQuestions.length === 0) {
    navigate('/');
    return null;
  }

  const handleAnswerSelect = (option: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: option
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    const score = calculateScore(answers, quizQuestions);
    onSubmit({ name, answers, score });
    navigate(`/result/${encodeURIComponent(name)}`);
  };

  const isLastQuestion = currentQuestionIndex === quizQuestions.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white text-gray-800">
      <div className="container mx-auto px-4 py-8">
          {/* Banner区域 */}
           <div className="w-full aspect-[16/10] md:aspect-[25/12] rounded-xl overflow-hidden mb-6 shadow-lg bg-gradient-to-r from-red-500 to-red-600">
            <img 
              src={bannerImage} 
              alt="竞赛活动Banner" 
              className="w-full h-full object-cover"
            />
          </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-red-100"
        >
          {/* 用户信息和进度 */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-red-700 font-medium">
              <i className="fa-solid fa-user mr-1"></i> {name}
            </div>
            <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
              {currentQuestionIndex + 1}/{quizQuestions.length}
            </div>
          </div>

          {/* 进度条 */}
          <div className="w-full bg-red-100 rounded-full h-2 mb-8">
            <div 
              className="bg-red-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
            ></div>
          </div>
          
          {/* 每题分值显示 */}
          <div className="text-center mb-6">
            <p className="text-gray-600">
              <span className="font-medium text-red-600">{pointsPerQuestion}</span> 分/题
            </p>
          </div>

          {/* 题目内容 */}
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-800 leading-relaxed">
              <span className="text-red-600 font-medium">{currentQuestion.type} </span>
              {currentQuestion.content}
            </h2>

            <div className="space-y-3">
              {Object.entries(currentQuestion.options).map(([key, value]) => (
                <motion.button
                  key={key}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleAnswerSelect(key)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-start ${
                    answers[currentQuestion.id] === key 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-200 hover:border-red-300'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                    answers[currentQuestion.id] === key 
                      ? 'bg-red-500 text-white' 
                      : 'bg-white border border-gray-300 text-gray-600'
                  }`}>
                    {key}
                  </div>
                  <span className="text-gray-700">{value}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* 导航按钮 */}
          <div className="flex justify-between">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePrev}
              disabled={currentQuestionIndex === 0}
              className={`px-4 py-2 rounded-lg border ${
                currentQuestionIndex === 0 
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed' 
                  : 'border-red-300 text-red-600 hover:bg-red-50'
              }`}
            >
              <i className="fa-solid fa-arrow-left mr-1"></i> 上一题
            </motion.button>

            {isLastQuestion ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={!answers[currentQuestion.id]}
                className={`px-6 py-2 rounded-lg ${
                  !answers[currentQuestion.id] 
                    ? 'bg-red-200 text-white cursor-not-allowed' 
                    : 'bg-red-600 text-white hover:bg-red-700 shadow-md'
                }`}
              >
                提交答案
                <i className="fa-solid fa-check ml-1"></i>
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                disabled={!answers[currentQuestion.id]}
                className={`px-6 py-2 rounded-lg ${
                  !answers[currentQuestion.id] 
                    ? 'bg-red-200 text-white cursor-not-allowed' 
                    : 'bg-red-600 text-white hover:bg-red-700 shadow-md'
                }`}
              >
                下一题
                <i className="fa-solid fa-arrow-right ml-1"></i>
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}