import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Question } from '@/contexts/authContext'

// 工具函数：合并CSS类名
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 工具函数：生成唯一ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// 工具函数：格式化时间
export function formatDateTime(date: Date): string {
  return new Date(date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

// 工具函数：计算得分
export function calculateScore(answers: Record<string, string>, questions: Question[]): number {
  if (questions.length === 0) return 0;
  
  // 计算每题分值
  const questionScore = questions.length < 10 
    ? 100 / questions.length 
    : 10; // 题目大于10个时，每题10分
  
  let score = 0;
  questions.forEach(question => {
    if (answers[question.id] === question.answer) {
      score += questionScore;
    }
  });
  
  // 保留2位小数，避免计算精度问题
  return Math.round(score * 100) / 100;
}

// 工具函数：从题库中随机选取指定数量的题目
export function getRandomQuestions(questions: Question[], count: number): Question[] {
  if (questions.length <= count) {
    return [...questions];
  }
  
  // 随机打乱题目顺序
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  
  // 返回前count个题目
  return shuffled.slice(0, count);
}
