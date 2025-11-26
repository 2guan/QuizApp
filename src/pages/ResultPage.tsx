import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatDateTime, calculateScore } from '@/lib/utils';
import { Question, AnswerRecord } from '@/contexts/authContext';

interface ResultPageProps {
  questions: Question[];
  records: AnswerRecord[];
}

export default function ResultPage({ questions, records }: ResultPageProps) {
  const { name } = useParams();
  const navigate = useNavigate();
  
  // 找到当前用户的答题记录
  const userRecord = records.find(record => record.name === name);
  
  // 如果记录不存在，返回首页
  if (!userRecord) {
    navigate('/');
    return null;
  }
  
  // 计算排行榜数据
  const rankedRecords = [...records]
    .sort((a, b) => b.score - a.score)
    .map((record, index) => ({ ...record, rank: index + 1 }));
  
  const userRank = rankedRecords.find(record => record.id === userRecord.id)?.rank || 0;
  
  // 获取用户实际答题的题目（根据答题记录中的题目ID筛选）
  const userAnsweredQuestions = questions.filter(q => userRecord.answers[q.id] !== undefined);
  
  // 计算每题分值，与QuizPage保持一致
  const questionScore = questions.length < 10 
    ? 100 / questions.length 
    : 10;
  
  // 计算用户答题的正确率
  const correctAnswers = userAnsweredQuestions.filter(q => 
    userRecord.answers[q.id] === q.answer
  ).length;
  
  const accuracy = userAnsweredQuestions.length > 0 
    ? Math.round((correctAnswers / userAnsweredQuestions.length) * 100) 
    : 0;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white text-gray-800">
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-red-100"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-center text-red-700 mb-6">
            答题结果
          </h1>
          
          {/* 用户信息和得分 */}
          <div className="bg-red-50 rounded-2xl p-6 mb-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center border-4 border-white shadow-md">
                <i className="fa-solid fa-user text-red-600 text-4xl"></i>
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">{userRecord.name}</h2>
            <div className="flex flex-wrap justify-center items-center gap-6">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-red-600">{userRecord.score}</div>
                <div className="text-gray-500 text-sm">得分</div>
              </div>
              <div className="h-12 w-px bg-red-200 hidden md:block"></div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-red-600">{userRank}</div>
                <div className="text-gray-500 text-sm">排名</div>
              </div>
              <div className="h-12 w-px bg-red-200 hidden md:block"></div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-red-600">{accuracy}%</div>
                <div className="text-gray-500 text-sm">正确率</div>
              </div>
            </div>
            <p className="text-gray-500 text-sm mt-4">
              答题时间：{formatDateTime(userRecord.time)}
            </p>
            <p className="text-gray-500 text-sm mt-1">
              每题分值：{Math.round(questionScore * 100) / 100} 分
            </p>
          </div>
          
          {/* 答案解析 */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <i className="fa-solid fa-book-open text-red-600 mr-2"></i>
              答案解析
            </h3>
            
            <div className="space-y-6">
              {userAnsweredQuestions.map((question, index) => {
                const userAnswer = userRecord.answers[question.id];
                const isCorrect = userAnswer === question.answer;
                
                return (
                  <motion.div 
                    key={question.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border rounded-xl p-4"
                  >
                    <div className="mb-3">
                      <span className="font-medium">{index + 1}. {question.content}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {Object.entries(question.options).map(([key, value]) => (
                        <div 
                          key={key}
                          className={`px-3 py-2 rounded-lg text-sm ${
                            key === question.answer 
                              ? 'bg-green-50 text-green-700 border border-green-200' 
                              : userAnswer === key && userAnswer !== question.answer
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : 'bg-gray-50 text-gray-600 border border-gray-200'
                          }`}
                        >
                          <span className="font-medium">{key}.</span> {value}
                          {key === question.answer && <span className="ml-1 text-xs bg-green-100 text-green-800 px-1 rounded">正确答案</span>}
                        </div>
                      ))}
                    </div>
                    
                    <div className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <strong className="text-red-600">解析：</strong>
                      {question.explanation}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
          
          {/* 按钮 */}
          <div className="flex flex-col space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/')}
              className="w-full bg-red-600 text-white font-medium py-3 px-4 rounded-lg shadow-md hover:bg-red-700 transition-all"
            >
              返回首页
            </motion.button>
            
            {userRank <= 3 && (
              <div className="text-center text-gray-500 text-sm mt-3">
                <i className="fa-solid fa-medal text-yellow-500 mr-1"></i>
                恭喜您进入前三名！
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}