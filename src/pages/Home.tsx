import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '@/contexts/authContext';
import { useContext } from 'react';
import { toast } from 'sonner';

interface HomeProps {
  bannerImage: string;
}

export default function Home({ bannerImage }: HomeProps) {
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);

  const handleStart = () => {
    if (!name.trim()) {
      alert('请输入您的姓名');
      return;
    }
    navigate(`/quiz?name=${encodeURIComponent(name)}`);
  };

  const handleAdminAccess = () => {
    navigate('/login');
  };

  const handleBookClick = () => {
    toast('学习党的二十大精神，贯彻新发展理念！');
  };

  const handleStarClick = () => {
    toast('争做学习标兵，展现党员风采！');
  };

  const handleAwardClick = () => {
    toast('知识竞赛，等你来挑战！');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white text-gray-800">
      {/* 背景装饰元素 */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-red-500 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-red-400 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
          {/* 后台入口按钮已移至页面底部 */}

           {/* Banner区域 */}
            <div className="w-full aspect-[16/10] md:aspect-[25/12] rounded-xl overflow-hidden mb-8 shadow-lg bg-gradient-to-r from-red-500 to-red-600">
             <img 
               src={bannerImage} 
               alt="竞赛活动Banner" 
               className="w-full h-full object-cover"
             />
           </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 border border-red-100"
        >
          <h1 className="text-3xl font-bold text-center text-red-700 mb-8">
"十五五"规划建议知识竞赛
  </h1>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fa-solid fa-user text-red-500 mr-2"></i>您的姓名
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="请输入您的姓名"
                className="w-full px-4 py-3 rounded-lg border border-red-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none"
              />
            </div>
            
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStart}
              className="w-full bg-red-600 text-white font-medium py-3 px-4 rounded-lg shadow-md hover:bg-red-700 transition-all flex items-center justify-center"
            >
              <i className="fa-solid fa-flag-checkered text-lg mr-2"></i>
              开始答题
            </motion.button>
          </div>

           {/* 排行榜按钮 */}
           <div className="mt-8 flex justify-center">
             <motion.button 
               whileHover={{ scale: 1.1, backgroundColor: '#ef4444' }}
               whileTap={{ scale: 0.95 }}
               className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center cursor-pointer transition-colors shadow-md hover:shadow-lg"
               onClick={() => navigate('/leaderboard')}
             >
               <i className="fa-solid fa-award text-red-600 text-2xl"></i>
             </motion.button>
           </div>
           <p className="text-center text-gray-500 text-sm mt-2">查看排行榜</p>
        </motion.div>

         {/* 后台管理入口按钮 */}
        <div className="mt-8 text-center">
          <button 
            onClick={handleAdminAccess}
            className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-200 transition-colors text-sm flex items-center mx-auto"
            title="后台管理"
          >
            <i className="fa-solid fa-gear text-xs mr-1"></i>后台管理
          </button>
        </div>
        
        {/* 页脚 */}
        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p>© 2025 党建知识竞赛活动</p>
          <p className="mt-1">学思想、强党性、重实践、建新功</p>
        </footer>
      </div>
    </div>
  );
}