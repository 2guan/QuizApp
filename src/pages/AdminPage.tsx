import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext, Question, AnswerRecord } from '@/contexts/authContext';
import { generateId, formatDateTime } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AdminPageProps {
  questions: Question[];
  records: AnswerRecord[];
  bannerImage: string;
  onUpdateQuestions: (questions: Question[]) => void;
  onRemoveRecord: (id: string) => void;
  onUpdateBanner: (imageUrl: string) => void;
}

export default function AdminPage({ 
  questions, 
  records, 
  bannerImage, 
  onUpdateQuestions, 
  onRemoveRecord, 
  onUpdateBanner 
}: AdminPageProps) {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'questions' | 'records' | 'statistics'>('questions');
  const [newQuestion, setNewQuestion] = useState<Omit<Question, 'id'>>({
    type: '单选题',
    content: '',
    answer: '',
    options: {
      A: '',
      B: '',
      C: '',
      D: ''
    },
    explanation: ''
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadText, setUploadText] = useState('');
  const [bannerInput, setBannerInput] = useState('');
  const [rankFilter, setRankFilter] = useState<'all' | 'name' | 'score'>('all');
  
  // 检查是否已登录
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  // 排行榜数据
  const rankedRecords = [...records]
      .filter(record => {
        if (!searchTerm) return true;
        return record.name.includes(searchTerm);
      })
      .sort((a, b) => {
        if (rankFilter === 'name') return a.name.localeCompare(b.name);
        if (rankFilter === 'score') return b.score - a.score;
        return new Date(b.time).getTime() - new Date(a.time).getTime();
      });
  
  // 统计数据
  const scoreDistribution = [
    { name: '0-20', count: records.filter(r => r.score <= 20).length },
    { name: '21-40', count: records.filter(r => r.score > 20 && r.score <= 40).length },
    { name: '41-60', count: records.filter(r => r.score > 40 && r.score <= 60).length },
    { name: '61-80', count: records.filter(r => r.score > 60 && r.score <= 80).length },
    { name: '81-100', count: records.filter(r => r.score > 80).length },
  ];
  
  
  
  // 处理添加/更新题目
  const handleSaveQuestion = () => {
    if (!newQuestion.content || !newQuestion.answer || 
        !newQuestion.options.A || !newQuestion.options.B) {
      alert('请填写完整题目信息');
      return;
    }
    
    const question: Question = {
      ...newQuestion,
      id: generateId()
    };
    
    let updatedQuestions: Question[];
    
    if (editIndex !== null) {
      updatedQuestions = [...questions];
      updatedQuestions[editIndex] = question;
    } else {
      updatedQuestions = [...questions, question];
    }
    
    onUpdateQuestions(updatedQuestions);
    resetQuestionForm();
  };
  
  // 重置题目表单
  const resetQuestionForm = () => {
    setNewQuestion({
      type: '单选题',
      content: '',
      answer: '',
      options: {
        A: '',
        B: '',
        C: '',
        D: ''
      },
      explanation: ''
    });
    setEditIndex(null);
  };
  
  // 编辑题目
  const handleEditQuestion = (index: number) => {
    const question = questions[index];
    setNewQuestion({
      type: question.type,
      content: question.content,
      answer: question.answer,
      options: question.options,
      explanation: question.explanation
    });
    setEditIndex(index);
  };
  
  // 删除题目
  const handleDeleteQuestion = (index: number) => {
    if (window.confirm('确定要删除这个题目吗？')) {
      const updatedQuestions = questions.filter((_, i) => i !== index);
      onUpdateQuestions(updatedQuestions);
    }
  };
  
  // 批量导入题目（长文本方式）
  const handleImportText = () => {
    if (!uploadText) return;
    
    try {
      const newQuestions: Question[] = [];
      const lines = uploadText.trim().split('\n');
      
      lines.forEach(line => {
        if (line.trim()) {
          // 这里简化处理，实际应该根据具体格式解析
          const parts = line.split('|');
          if (parts.length >= 7) {
            newQuestions.push({
              id: generateId(),
              type: '单选题',
              content: parts[0].trim(),
              answer: parts[1].trim(),
              options: {
                A: parts[2].trim(),
                B: parts[3].trim(),
                C: parts[4].trim(),
                D: parts[5].trim()
              },
              explanation: parts[6].trim()
            });
          }
        }
      });
      
      if (newQuestions.length > 0) {
        onUpdateQuestions([...questions, ...newQuestions]);
        setUploadText('');
        alert(`成功导入 ${newQuestions.length} 个题目`);
      }
    } catch (error) {
      alert('导入失败，请检查格式');
    }
  };
  
  // 更新Banner图片
  const handleUpdateBanner = () => {
    if (bannerInput) {
      onUpdateBanner(bannerInput);
      setBannerInput('');
      alert('Banner更新成功');
    }
  };
  
  // 退出登录
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white text-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* 顶部导航 */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6 flex justify-between items-center border border-red-100">
          <h1 className="text-xl font-bold text-red-700">
            <i className="fa-solid fa-cog mr-2"></i>
            后台管理
          </h1>
          <button 
            onClick={handleLogout}
            className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm hover:bg-red-200 transition-colors"
          >
            <i className="fa-solid fa-sign-out-alt mr-1"></i>
            退出登录
          </button>
        </div>
        
        {/* 标签页导航 */}
        <div className="flex overflow-x-auto space-x-2 mb-6 pb-2">
          {[
            { key: 'questions' as const, label: '题目管理' },
            { key: 'records' as const, label: '答题记录' },
            { key: 'statistics' as const, label: '统计分析' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-red-50 border border-red-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* 内容区域 */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-6 border border-red-100"
        >
          {activeTab === 'questions' && (
            <div>
              <h2 className="text-lg font-bold mb-4">题目管理</h2>
              
              {/* Banner管理 */}
              <div className="mb-6 p-4 bg-red-50 rounded-xl">
                <h3 className="font-medium mb-3">Banner管理</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <div className="h-24 rounded-lg overflow-hidden">
                    <img 
                      src={bannerImage} 
                      alt="当前Banner" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={bannerInput}
                      onChange={(e) => setBannerInput(e.target.value)}
                      placeholder="输入新的Banner图片URL"
                      className="w-full px-3 py-2 rounded-lg border border-red-200"
                    />
                    <button
                      onClick={handleUpdateBanner}
                      className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-700 transition-colors"
                    >
                      更新Banner
                    </button>
                  </div>
                </div>
              </div>
              
              {/* 题目表单 */}
              <div className="mb-6 p-4 border rounded-xl">
                <h3 className="font-medium mb-3">{editIndex !== null ? '编辑题目' : '添加题目'}</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">题目内容</label>
                    <textarea
                      value={newQuestion.content}
                      onChange={(e) => setNewQuestion(prev => ({ ...prev, content: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-red-200"
                      rows={2}
                    ></textarea>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">选项A</label>
                      <input
                        type="text"
                        value={newQuestion.options.A}
                        onChange={(e) => setNewQuestion(prev => ({ 
                          ...prev, 
                          options: { ...prev.options, A: e.target.value } 
                        }))}
                        className="w-full px-3 py-2 rounded-lg border border-red-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">选项B</label>
                      <input
                        type="text"
                        value={newQuestion.options.B}
                        onChange={(e) => setNewQuestion(prev => ({ 
                          ...prev, 
                          options: { ...prev.options, B: e.target.value } 
                        }))}
                        className="w-full px-3 py-2 rounded-lg border border-red-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">选项C</label>
                      <input
                        type="text"
                        value={newQuestion.options.C}
                        onChange={(e) => setNewQuestion(prev => ({ 
                          ...prev, 
                          options: { ...prev.options, C: e.target.value } 
                        }))}
                        className="w-full px-3 py-2 rounded-lg border border-red-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">选项D</label>
                      <input
                        type="text"
                        value={newQuestion.options.D}
                        onChange={(e) => setNewQuestion(prev => ({ 
                          ...prev, 
                          options: { ...prev.options, D: e.target.value } 
                        }))}
                        className="w-full px-3 py-2 rounded-lg border border-red-200"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">正确答案</label>
                      <select
                        value={newQuestion.answer}
                        onChange={(e) => setNewQuestion(prev => ({ ...prev, answer: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg border border-red-200"
                      >
                        <option value="">请选择</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">答案解析</label>
                    <textarea
                      value={newQuestion.explanation}
                      onChange={(e) => setNewQuestion(prev => ({ ...prev, explanation: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-red-200"
                      rows={2}
                    ></textarea>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSaveQuestion}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      {editIndex !== null ? '更新' : '添加'}
                    </button>
                    <button
                      onClick={resetQuestionForm}
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      取消
                    </button>
                  </div>
                </div>
              </div>
              
              {/* 批量导入 */}
              <div className="mb-6 p-4 border rounded-xl">
                <h3 className="font-medium mb-3">批量导入题目（长文本方式）</h3>
                <div className="space-y-3">
                  <textarea
                    value={uploadText}
                    onChange={(e) => setUploadText(e.target.value)}
                    placeholder="格式：题目|答案|选项A|选项B|选项C|选项D|解析&#10;每行一题"
                    className="w-full px-3 py-2 rounded-lg border border-red-200"
                    rows={4}
                  ></textarea>
                  <button
                    onClick={handleImportText}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    导入题目
                  </button>
                </div>
              </div>
              
              {/* 题目列表 */}
              <div>
                <h3 className="font-medium mb-3">题目列表</h3>
                <div className="space-y-3">
                  {questions.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">暂无题目</div>
                  ) : (
                    questions.map((question, index) => (
                      <div key={question.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium">{index + 1}. {question.content}</div>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleEditQuestion(index)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <i className="fa-solid fa-edit"></i>
                            </button>
                            <button
                              onClick={() => handleDeleteQuestion(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                          <div className="text-gray-600">A: {question.options.A}</div>
                          <div className="text-gray-600">B: {question.options.B}</div>
                          <div className="text-gray-600">C: {question.options.C}</div>
                          <div className="text-gray-600">D: {question.options.D}</div>
                        </div>
                        <div className="text-sm text-green-600">正确答案: {question.answer}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'records' && (
            <div>
              <h2 className="text-lg font-bold mb-4">答题记录</h2>
              
              {/* 搜索和筛选 */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="搜索姓名或机构"
                  className="px-3 py-2 rounded-lg border border-red-200 flex-1"
                />
                <select
                  value={rankFilter}
                  onChange={(e) => setRankFilter(e.target.value as typeof rankFilter)}
                  className="px-3 py-2 rounded-lg border border-red-200"
                >
                  <option value="all">按时间排序</option>
                  <option value="name">按姓名排序</option>
                  <option value="score">按分数排序</option>
                </select>
              </div>
              
              {/* 记录列表 */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-red-50">
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">排名</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">姓名</th>
                      
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">分数</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">答题时间</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankedRecords.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-500">暂无答题记录</td>
                      </tr>
                    ) : (
                      rankedRecords.map((record, index) => (
                        <tr key={record.id} className="hover:bg-red-50">
                          <td className="px-4 py-3 text-sm border-b">{index + 1}</td>
                          <td className="px-4 py-3 text-sm border-b">{record.name}</td>
                           
                          <td className={`px-4 py-3 text-sm font-medium border-b ${
                            record.score >= 80 ? 'text-green-600' : 
                            record.score >= 60 ? 'text-blue-600' : 'text-red-600'
                          }`}>
                            {record.score}
                          </td>
                          <td className="px-4 py-3 text-sm border-b">{formatDateTime(record.time)}</td>
                          <td className="px-4 py-3 text-sm border-b">
                            <button
                              onClick={() => onRemoveRecord(record.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {activeTab === 'statistics' && (
            <div>
              <h2 className="text-lg font-bold mb-4">统计分析</h2>
              
              {/* 基本统计 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-red-50 p-4 rounded-xl">
                  <div className="text-sm text-gray-600">总答题人数</div>
                  <div className="text-2xl font-bold text-red-700">{records.length}</div>
                </div>
                <div className="bg-red-50 p-4 rounded-xl">
                  <div className="text-sm text-gray-600">平均分数</div>
                  <div className="text-2xl font-bold text-red-700">
                    {records.length > 0 
                      ? (records.reduce((sum, r) => sum + r.score, 0) / records.length).toFixed(1)
                      : '0.0'
                    }
                  </div>
                </div>
                <div className="bg-red-50 p-4 rounded-xl">
                  <div className="text-sm text-gray-600">满分人数</div>
                  <div className="text-2xl font-bold text-red-700">
                    {records.filter(r => r.score === 100).length}
                  </div>
                </div>
              </div>
              
              {/* 分数分布图表 */}
              <div className="mb-8">
                <h3 className="font-medium mb-3">分数分布</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={scoreDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* 其他统计信息 */}
              <div className="mt-8 p-4 bg-red-50 rounded-xl text-center">
                <h3 className="font-medium mb-3">答题情况总结</h3>
                <p className="text-gray-700">
                  通过知识竞赛，有效提高了参与者对"十五五"规划建议的理解和掌握程度。
                  希望大家继续深入学习，将理论知识应用到实际工作中。
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}