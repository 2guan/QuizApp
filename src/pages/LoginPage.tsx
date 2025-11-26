import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '@/contexts/authContext';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 默认密码：ccb2025
    if (password === 'ccb2025') {
      setIsAuthenticated(true);
      navigate('/admin');
    } else {
      setError('密码错误，请重新输入');
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-red-100"
      >
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={handleBack}
            className="text-gray-500 hover:text-red-600 transition-colors"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <h1 className="text-xl font-bold text-red-700">管理员登录</h1>
          <div className="w-5"></div> {/* 占位，保持标题居中 */}
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              请输入管理员密码
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-red-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none"
              autoFocus
            />
          </div>
          
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200"
            >
              <i className="fa-solid fa-exclamation-circle mr-1"></i>
              {error}
            </motion.div>
          )}
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-red-600 text-white font-medium py-3 px-4 rounded-lg shadow-md hover:bg-red-700 transition-all flex items-center justify-center"
          >
            <i className="fa-solid fa-lock mr-2"></i>
            登录
          </motion.button>
        </form>
        
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>此页面仅供管理员使用</p>
          <p className="mt-1">请确保在使用完毕后退出登录</p>
        </div>
      </motion.div>
    </div>
  );
}