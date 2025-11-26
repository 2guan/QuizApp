import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatDateTime } from '@/lib/utils';
import { AnswerRecord } from '@/contexts/authContext';

interface LeaderboardPageProps {
  records: AnswerRecord[];
}

export default function LeaderboardPage({ records }: LeaderboardPageProps) {
  const navigate = useNavigate();
  const [rankedRecords, setRankedRecords] = useState<(AnswerRecord & { rank: number })[]>([]);
  
  // 计算排行榜数据
  useEffect(() => {
    const sortedRecords = [...records]
      .sort((a, b) => {
        // 首先按分数排序，分数高的在前
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        // 分数相同的情况下，按答题时间排序，答题早的在前
        return new Date(a.time).getTime() - new Date(b.time).getTime();
      })
      .map((record, index) => ({ ...record, rank: index + 1 }));
    
    setRankedRecords(sortedRecords);
  }, [records]);
  
  // 获取前三名的记录
  const topThree = rankedRecords.slice(0, 3);
  
  // 获取其他排名的记录
  const otherRecords = rankedRecords.slice(3);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white text-gray-800">
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-red-100"
        >
          {/* 页面标题 */}
          <div className="text-center mb-8">
            <motion.h1 
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="text-2xl md:text-3xl font-bold text-red-700 mb-2"
            >
              竞赛排行榜
            </motion.h1>
            <p className="text-gray-500">
              <i className="fa-solid fa-trophy text-yellow-500 mr-1"></i>
              知识竞赛成绩排名
            </p>
          </div>
          
          {/* 前三名展示 */}
          <div className="mb-10">
            <h2 className="text-lg font-bold text-gray-700 mb-4 text-center">
              🏆 冠军榜 🏆
            </h2>
            
            <div className="flex justify-center items-end space-x-2 md:space-x-4">
              {/* 第二名 */}
              {topThree.length > 1 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col items-center order-1"
                >
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-red-100 flex items-center justify-center border-4 border-red-200 mb-2">
                    <i className="fa-solid fa-user text-red-500 text-3xl md:text-4xl"></i>
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-gray-800 mb-1">{topThree[1].score}</div>
                  <div className="text-sm md:text-base font-medium text-gray-700 mb-1 max-w-[80px] text-center truncate">{topThree[1].name}</div>
                  <div className="w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center font-bold">
                    2
                  </div>
                </motion.div>
              )}
              
              {/* 第一名 */}
              {topThree.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0 }}
                  className="flex flex-col items-center order-0 md:order-1"
                >
                  <div className="w-32 h-32 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center border-4 border-yellow-300 mb-2 relative">
                    <i className="fa-solid fa-user text-yellow-600 text-4xl md:text-5xl"></i>
                    <div className="absolute -top-4">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg">
                        <i className="fa-solid fa-crown text-white text-xl md:text-2xl"></i>
                      </div>
                    </div>
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-yellow-600 mb-1">{topThree[0].score}</div>
                  <div className="text-base md:text-lg font-medium text-gray-700 mb-1 max-w-[100px] text-center truncate">{topThree[0].name}</div>
                  <div className="w-10 h-10 rounded-full bg-yellow-400 text-white flex items-center justify-center font-bold">
                    1
                  </div>
                </motion.div>
              )}
              
              {/* 第三名 */}
              {topThree.length > 2 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col items-center order-2"
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-red-100 flex items-center justify-center border-4 border-red-200 mb-2">
                    <i className="fa-solid fa-user text-red-500 text-2xl md:text-3xl"></i>
                  </div>
                  <div className="text-lg md:text-xl font-bold text-gray-800 mb-1">{topThree[2].score}</div>
                  <div className="text-sm md:text-base font-medium text-gray-700 mb-1 max-w-[80px] text-center truncate">{topThree[2].name}</div>
                  <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold">
                    3
                  </div>
                </motion.div>
              )}
            </div>
          </div>
          
          {/* 其他排名列表 */}
          {otherRecords.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-700 mb-4 text-center">
                📊 参与者排名
              </h2>
              
              <div className="space-y-2">
                {otherRecords.map((record, index) => (
                  <motion.div 
                    key={record.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center justify-between p-3 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-red-200 text-red-700 flex items-center justify-center font-bold">
                        {record.rank}
                      </div>
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-red-200 mr-2">
                          <i className="fa-solid fa-user text-red-500"></i>
                        </div>
                        <div>
                          <div className="font-medium text-gray-700">{record.name}</div>
                          <div className="text-xs text-gray-500">{formatDateTime(record.time)}</div>
                        </div>
                      </div>
                    </div>
                    <div className="text-xl font-bold text-red-600">
                      {record.score}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
          
          {/* 无记录提示 */}
          {rankedRecords.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto rounded-full bg-red-50 flex items-center justify-center mb-4">
                <i className="fa-solid fa-trophy text-red-300 text-4xl"></i>
              </div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">暂无答题记录</h3>
              <p className="text-gray-500">成为第一个参与知识竞赛的人吧！</p>
            </div>
          )}
          
          {/* 返回按钮 */}
          <div className="mt-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/')}
              className="w-full bg-red-600 text-white font-medium py-3 px-4 rounded-lg shadow-md hover:bg-red-700 transition-all"
            >
              <i className="fa-solid fa-arrow-left mr-2"></i>
              返回首页
            </motion.button>
          </div>
        </motion.div>
        
        {/* 页脚 */}
        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>© 2025 党建知识竞赛活动</p>
          <p className="mt-1">学思想、强党性、重实践、建新功</p>
        </footer>
      </div>
    </div>
  );
}